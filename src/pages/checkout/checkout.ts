import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, ModalController, LoadingController, Events } from 'ionic-angular';
import { IOrder, IPurchaseItem, AuthUserInfo, ICompanyDetailsForProcessOrder } from '../../models/models';
import { StoreService } from '../../global/store.service';
import { API, ROUTES } from '../../global/api.service';
import { Authentication } from '../../global/authentication.service';
import { EditPurchaseItemPage } from '../edit-purchase-item/edit-purchase-item';
import { BaseViewController } from '../base-view-controller/base-view-controller';
import { Dates } from '../../global/dates.service';
import { AppDataService } from '../../global/app-data.service';
import { UtilityService } from '../../global/utility.service';
import { OrderCompletePage } from '../order-complete/order-complete';
import { SocketService } from '../../global/socket.service';
import { HomePage } from '../home/home';
import * as io from "socket.io-client";


@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html'
})
export class CheckoutPage extends BaseViewController {
 orderSubmitted: boolean = false;
 order: IOrder = { 
    purchaseItems: [], 
    transactionDetails: { 
      rewards: [],
      isRewardUsed: false,
      isRewardAllUsed: false,
      isRewardIndividualUsed: false,
      subtotal: null, 
      taxes: null, 
      total: null, 
      rewardsSavings: 0,
      isSocialMediaUsed: false,
      lkpSocialMediaTypeOid: null,
      socialMediaDiscountAmount: 0,
      isEdited: false,
      editAmount: 0,
      reasonsForEdit: null,
      oldPrice: null,
      newPrice: null
    } 
  };
  balance: number|string = 0;
  unavailable: string = "Unavailable";
  room: number = null;
  socket: SocketIOClient.Socket;
  etas: Array<number> = UtilityService.getEtas();
  eta: number = 15;
  comments: string = null;
  exclusions: string = 'Note: Some rewards are not redeemable when using Order-Ahead';
  auth: AuthUserInfo;
  showRewards: boolean = false;
  minutesUntilClose: number = 0;

  // constants
  UNAVAILABLE: string = "Unavailable";
  INSUFFICIENT_FUNDS_ALERT: string = "Uh oh! Looks like you need to add value to your card. Your balance: ";
  COMPANY_DETAILS: ICompanyDetailsForProcessOrder = {
    HAS_SOCIAL_MEDIA : true,
    ACCEPTS_PARTIAL_PAYMENTS : true,
    SOCIAL_MEDIA_DISCOUNT_AMOUNT : null,
    TAX_RATE : null,
    DOES_CHARGE_FOR_ADDONS: false,
    ALLOWS_COMMENTS_ON_ORDER_AHEAD: false
  };
  REWARDS_TYPE = {
    REWARDS_INDIVIDUAL: "rewards_individual",
    REWARDS_ALL: "rewards_all"
  };
  REWARDS_PROCESSING_TYPE = {
    AUTOMATIC: "Automatic",
    MANUAL: "Manual"
  };
  REWARDS_DISCOUNT_RULE = {
    DATE_TIME_RANGE: "Date-Time-Range",
    PRODUCT: "Product"
  };
  REWARDS_DISCOUNT_TYPE = {
    MONEY: "Money",
    NEW_PRICE: "New Price",
    PERCENT: "Percent"
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, public API: API, public authentication: Authentication, public modalCtrl: ModalController, public alertCtrl: AlertController, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public storeService: StoreService, public events: Events, public socketService: SocketService) {
    super(navCtrl, navParams, API, authentication, modalCtrl, alertCtrl, toastCtrl, loadingCtrl);
    this.auth = this.authentication.getCurrentUser();
    this.room = this.auth.companyOid + this.storeService.getLocationOid;
  }

  ionViewDidLoad() {
    this.minutesUntilClose = this.getMinutesUntilClose(this.storeService.getLocationCloseTime);


    this.socketService.connect(this.room);
    this.presentLoading();

    const toData = { companyOid: this.auth.companyOid };
    this.API.stack(ROUTES.getCompanyDetailsForTransaction, "POST", toData)
      .subscribe(
          (response) => {

            // company details
            this.COMPANY_DETAILS.ACCEPTS_PARTIAL_PAYMENTS = response.data.companyDetails.acceptsPartialPayments;
            this.COMPANY_DETAILS.HAS_SOCIAL_MEDIA = response.data.companyDetails.hasSocialMedia;
            this.COMPANY_DETAILS.SOCIAL_MEDIA_DISCOUNT_AMOUNT = response.data.companyDetails.socialMediaDiscountAmount; 
            this.COMPANY_DETAILS.DOES_CHARGE_FOR_ADDONS = response.data.companyDetails.doesChargeForAddons; 
            this.COMPANY_DETAILS.TAX_RATE = response.data.companyDetails.taxRate;
            this.COMPANY_DETAILS.ALLOWS_COMMENTS_ON_ORDER_AHEAD = response.data.companyDetails.allowsCommentsOnOrderAhead;
            
            // get order and rewards
            this.order =  Object.assign({}, this.storeService.getOrder());
            this.getEligibleRewardsAPI();
            this.dismissLoading();
            console.log('response: ', response);
          }, (err) => {
            const shouldPopView = false;
            this.errorHandler.call(this, err, shouldPopView);
          });   
      
      // does not need to be async
      this.API.stack(ROUTES.getBalance, "POST", {userOid: this.auth.userOid})
        .subscribe(
          (response) => {
            console.log('response: ', response);
            this.balance = response.data.balance;
          }, (err) => {
            const shouldPopView = false;
            this.balance = this.UNAVAILABLE;
            this.errorHandler.call(this, err, shouldPopView)
          }); 
  }

  ionViewDidLeave() {
    if (!this.orderSubmitted) {
      this.storeService.setOrder(this.order);  // gives control back to service
    }
    this.socketService.disconnect();
  }

  // calculate difference between now and closing time of currently selected location in storeService
  getMinutesUntilClose(closeTime: Date): number {
    let nowMinutes = Dates.millisecondsToMinutes(new Date().getTime());
    let closeMinutes = Dates.millisecondsToMinutes(closeTime.getTime());

    return closeMinutes - nowMinutes;
  }

  // if minutesUntilClose < [any of the etas], show the user the closing time in minutes
  areAnyEtasDisabled(): boolean {
    const disabledEtas: Array<number> = this.etas.filter((x) => {
      return this.minutesUntilClose < x;
    });

    return disabledEtas.length ? true : false;
  }

  selectEta(x) {
    this.eta = x;
  }

  getEligibleRewardsAPI() {
    this.presentLoading();

    const dateInfo = Dates.getCurrentDateInfo();
    const toData = {
      date: Dates.toLocalIsoString(dateInfo.date.toString()), // get all rewards where expiry date < date
      day: dateInfo.day, 
      hours: dateInfo.hours,
      mins: dateInfo.mins, 
      purchaseItems: this.order.purchaseItems,
      companyOid: this.auth.companyOid,
    };

    console.log("toData: ", toData);

    this.API.stack(ROUTES.getEligibleRewardsProcessingTypeAutomaticForTransaction, "POST", toData )
      .subscribe(
          (response) => {
            console.log('response.data: ' , response.data);

            this.order.purchaseItems = response.data.purchaseItems;
            this.order.transactionDetails = response.data.transactionDetails;
            this.order = this.storeService.calculateTaxesSubtotalTotalAndReturnOrder(this.order, this.order.transactionDetails.subtotal, this.COMPANY_DETAILS.TAX_RATE);

            this.dismissLoading();
          },  (err) => {
            console.log("err: ", err);
            const shouldPopView = false;
            this.errorHandler.call(this, err, shouldPopView)
          });
  }

  deletePurchaseItem(purchaseItem: IPurchaseItem, index: number) {
    this.order = this.storeService.deletePurchaseItemAndReturnOrder(this.order, purchaseItem, index, this.COMPANY_DETAILS.TAX_RATE);

    // clear discounts here
    this.order = this.storeService.clearDiscountsAndRewardsAndReturnOrder(this.order);

    if (this.order.transactionDetails.rewards.length) {
      this.getEligibleRewardsAPI();
    }
  }

  submit() {

    this.presentLoading(AppDataService.loading.processing);
    let toData = { 
      companyOid: this.auth.companyOid, 
      locationOid: this.storeService.getLocationOid, 
      userOid: this.auth.userOid,
      isOrderAhead: true,
      isProcessing: false,
      isExpired: false,
      eta: this.eta,
      userComments: this.comments,
      purchaseDate: Dates.toLocalIsoString(new Date().toString()),
      purchaseItems: this.order.purchaseItems,
      transactionDetails: this.order.transactionDetails,
      customerName: this.auth.firstName,
      room: this.auth.companyOid + this.storeService.getLocationOid     // for websockets
    };

    console.log("toData: ", toData);

    this.API.stack(ROUTES.processTransaction, "POST", toData)
      .subscribe(
          (response) => {
            console.log('response: ', response);

            this.orderSubmitted = true;
            this.storeService.clearOrder();

            //console.log("this.order (checkout): ", this.order);

            this.socketService.emit(this.socketService.socketEvents.userPlacedNewOrder, toData);
            this.dismissLoading();
            this.presentModal(OrderCompletePage, {}, { enableBackdropDismiss: false, showBackdrop: false });
            this.navCtrl.setRoot(HomePage);
            
          }, (err) => {
            console.log("err: ", err);
            const shouldPopView = false;
            this.errorHandler.call(this, err, shouldPopView);
          });
  }
}


  // MOVED TO SERVER  
  /*
    parseRewardsForTransaction() {
    
    let rewards = this.order.transactionDetails.rewards;
    let subtotal = this.storeService.calculateSubtotal(this.order);
    let dateTimeRangeMoneyOff = 0;
    let dateTimeRangePercentOff = 0;
    let dtrPercentSavings = 0;
    let hasFreePurchaseItemReward: boolean = false;

    if (rewards.length)  {
      this.order.transactionDetails.isRewardUsed = true;

      rewards.forEach((reward, index) => {

        if (reward.processingType === this.REWARDS_PROCESSING_TYPE.AUTOMATIC && reward.type === this.REWARDS_TYPE.REWARDS_ALL) {
          this.order.transactionDetails.isRewardAllUsed = true;
          if (reward.discountRule === this.REWARDS_DISCOUNT_RULE.PRODUCT) {
            this.rewardTypeProductAction(reward);
          } else if (reward.discountRule === this.REWARDS_DISCOUNT_RULE.DATE_TIME_RANGE) {
              if (reward.discountType === this.REWARDS_DISCOUNT_TYPE.MONEY) {
                  dateTimeRangeMoneyOff += this.rewardTypeDateTimeRangeAction(reward).money;
                  reward.discount = {type: this.REWARDS_DISCOUNT_TYPE.MONEY, amount: reward.discountAmount};
              } else if (reward.discountType === this.REWARDS_DISCOUNT_TYPE.PERCENT) {
                  dateTimeRangePercentOff += this.rewardTypeDateTimeRangeAction(reward).percent;
                  reward.discount = {type: this.REWARDS_DISCOUNT_TYPE.PERCENT, amount: reward.discountAmount * 100};
              }
          } else if (reward.type === this.REWARDS_TYPE.REWARDS_INDIVIDUAL && reward.isFreePurchaseItem) {  // limited to one per transaction at the moment
              hasFreePurchaseItemReward = true;
          }
        }
      });


      // cache products discounts
      const allProductsDiscounts = this.calculateAllProductsDiscounts();

      subtotal -= (allProductsDiscounts + dateTimeRangeMoneyOff);
      if (subtotal < 0) subtotal = 0; // calculate subtotal-  make new calculateSubtotalWithDiscounts fn in storeService

      if (dateTimeRangePercentOff > 0) {         // calculate dtr percentage for whole order
        dtrPercentSavings = subtotal * dateTimeRangePercentOff;
        subtotal -= dtrPercentSavings;
      }

      // calculate rewards savings & total & taxes
      this.order.transactionDetails.rewardsSavings = (allProductsDiscounts  + dateTimeRangeMoneyOff + dtrPercentSavings);
      this.order = this.storeService.calculateTaxesSubtotalTotalAndReturnOrder(this.order, subtotal, this.COMPANY_DETAILS.TAX_RATE);

    }
  }

  // move to server
  calculateAllProductsDiscounts(): number {
    let discounts = 0;

    this.order.purchaseItems.forEach((x, index) => {
      discounts += x.discounts;
    });

    return discounts;
  }

  // move to server
  // rewards action:   PRODUCT 
  rewardTypeProductAction(reward) {
    this.order.purchaseItems.forEach((purchaseItem, index) => {
        if (purchaseItem.selectedProduct.oid === reward.productOid) {
          let originalPrice = purchaseItem.sizeAndOrPrice.price, 
              newPrice = 0, 
              newDiscount = 0;

          switch (reward.discountType) {
            case this.REWARDS_DISCOUNT_TYPE.MONEY:
              purchaseItem.discounts += (this.quantityTimesDiscount(purchaseItem.quantity, reward.discountAmount));
              purchaseItem.discounts = this.returnDiscountOrOriginalPrice(purchaseItem.discounts, originalPrice, purchaseItem.quantity);
              break;
            case this.REWARDS_DISCOUNT_TYPE.PERCENT:
              newPrice = originalPrice * (this.quantityTimesDiscount(purchaseItem.quantity, reward.discountAmount));
              newDiscount = purchaseItem.discounts + (originalPrice - newPrice);
              purchaseItem.discounts = this.returnDiscountOrOriginalPrice(newDiscount, originalPrice, purchaseItem.quantity);
              break;
            case this.REWARDS_DISCOUNT_TYPE.NEW_PRICE:
              newDiscount = purchaseItem.discounts  + this.quantityTimesDiscount(purchaseItem.quantity, originalPrice);
              purchaseItem.discounts = this.returnDiscountOrOriginalPrice(newDiscount, originalPrice, purchaseItem.quantity);
              break;
            default: 
              // do nothing
              break;
          }
        }
      }); 
  }
  
  // move to server
  // rewards action: DATE-TIME-RANGE 
  rewardTypeDateTimeRangeAction(reward): {money: number, percent: number} {
    let ret = { money: 0, percent: 0 };
    
    switch (reward.discountType) {
      case this.REWARDS_DISCOUNT_TYPE.MONEY:
        ret = {money: reward.discountAmount, percent: 0};
        break;
      case this.REWARDS_DISCOUNT_TYPE.PERCENT:
        ret = {percent: reward.discountAmount, money: 0};
        break;
      default: 
        break; 
    }

    return ret;
  }

  // move to server
  quantityTimesDiscount(num: number, amount: number) {
    return num * amount;
  }

  // move to server
  returnDiscountOrOriginalPrice(newDiscount: number, originalPrice: number, quantity: number): number {
    if (newDiscount > (originalPrice * quantity)) return originalPrice;
    else return newDiscount;
  }
*/

