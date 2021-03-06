import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, ModalController, LoadingController, Events } from 'ionic-angular';
import { IOrder, IPurchaseItem, ICompanyDetails } from '../../interfaces/interfaces';
import { CheckoutStore } from './checkout-store.service';
import { API, ROUTES } from '../../services/api';
import { Authentication } from '../../services/authentication';
import { BaseViewController } from '../../components/base-view-controller/base-view-controller';
import { DateUtils } from '../../utils/date-utils';
import { Utils } from '../../utils/utils';
import { AppViewData } from '../../services/app-data.service';
import { AppStorage } from '../../services/app-storage.service';
import { SocketIO } from '../../services/socket-io';
import { CONSTANT } from '../../constants/constants';

@IonicPage()
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
      subtotal: 0, 
      taxes: 0, 
      total: 0, 
      rewardsSavings: 0,
      isSocialMediaUsed: false,
      lkpSocialMediaTypeOid: null,
      socialMediaDiscountAmount: 0,
      isEdited: false,
      editAmount: 0,
      reasonsForEdit: null,
      oldPrice: 0,
      newPrice: 0
    } 
  };
  balance: number|string = "Unavailable";
  unavailable: string = "Unavailable";
  room: number = null;
  socket: SocketIOClient.Socket;
  etas: Array<number> = Utils.getEtas();
  eta: number = 15;
  comments: string = null;
  exclusions: string = 'Note: Some rewards are not redeemable when using Order-Ahead';
  auth: any = this.authentication.getCurrentUser();
  appHeaderBarLogo: string = AppStorage.getImg().logoImgSrc;
  companyName: string = this.auth.companyName;
  showRewards: boolean = false;
  minutesUntilClose: number = 0;
  showApplyRewardBtn: boolean = true;
  // constants
  UNAVAILABLE: string = "Unavailable";
  INSUFFICIENT_FUNDS_ALERT: string = "Uh oh! Looks like you need to add value to your card. Your balance: ";
  companyDetails: ICompanyDetails = {};
  REWARDS_TYPE = CONSTANT.REWARDS_TYPES;
  REWARDS_PROCESSING_TYPE = CONSTANT.REWARDS_PROCESSING_TYPE;
  REWARDS_DISCOUNT_RULE = CONSTANT.REWARDS_DISCOUNT_RULE;
  REWARDS_DISCOUNT_TYPE = CONSTANT.REWARDS_DISCOUNT_TYPE;


  /*
    All state held in checkout-store
  */
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public API: API, 
    public authentication: Authentication, 
    public modalCtrl: ModalController, 
    public alertCtrl: AlertController, 
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController, 
    public checkoutStore: CheckoutStore, 
    public events: Events, 
    public socketIO: SocketIO) {
      super(alertCtrl, toastCtrl, loadingCtrl, navCtrl);

    this.auth = this.authentication.getCurrentUser();
    this.room = this.auth.companyOid + this.checkoutStore.getLocationOid;
  }

  ionViewDidLoad() {
    this.minutesUntilClose = this.getMinutesUntilClose(this.checkoutStore.getLocationCloseTime);
    console.log("client connecting to socket.io room: ", this.room);

    // socket subscription
    this.socketIO.connect().subscribe(this.room.toString());
    
    this.API.stack(ROUTES.getCompanyDetailsForTransaction, "POST", { companyOid: this.auth.companyOid })
      .subscribe(
        (response) => {
          this.companyDetails = response.data.companyDetails;
          
          // get order and rewards
          this.order =  Object.assign({}, this.checkoutStore.getOrder());
          this.getEligibleRewards(this.order);
          console.log('response: ', response);
        },  this.errorHandler(this.ERROR_TYPES.API));   
      
      // does not need to be async
      this.API.stack(ROUTES.getBalance, "POST", {userOid: this.auth.userOid})
        .subscribe(
          (response) => {
            console.log('response: ', response);
            this.balance = response.data.balance;
          },  this.errorHandler(this.ERROR_TYPES.API, undefined, {shouldDismissLoading: false})); 
  }

  ionViewDidLeave() {
    if (!this.orderSubmitted) {
      this.checkoutStore.setOrder(this.order);  // gives control back to service
    }

    // socket unsubscription
    this.socketIO.unsubscribe(this.room.toString()).disconnect();
  }

  getEligibleRewards(order: IOrder) {
    
    this.presentLoading();
    const dateInfo = DateUtils.getCurrentDateInfo();
    const toData = {
      date: DateUtils.toLocalIsoString(dateInfo.date.toString()), // get all rewards where expiry date < date
      day: dateInfo.day, 
      hours: dateInfo.hours,
      mins: dateInfo.mins, 
      purchaseItems: order.purchaseItems,
      companyOid: this.auth.companyOid,
      taxRate: this.companyDetails.taxRate
    };

    this.API.stack(ROUTES.getEligibleRewardsProcessingTypeAutomaticForTransaction, "POST", toData )
      .subscribe(
        (response) => {
          console.log('response.data: ' , response.data);
          this.order = this.checkoutStore.setPurchaseItemsAndTransactionDetails(response.data.purchaseItems, response.data.transactionDetails);
          this.order = this.checkoutStore.roundAllTransactionDetails(this.order.transactionDetails);
          this.dismissLoading();
        }, this.errorHandler(this.ERROR_TYPES.API));
    }



  // calculate difference between now and closing time of currently selected location in checkoutStore
  getMinutesUntilClose(closeTime: Date): number {
    let nowMinutes = DateUtils.millisecondsToMinutes(new Date().getTime());
    let closeMinutes = DateUtils.millisecondsToMinutes(closeTime.getTime());

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

  getRewadsIndividual() {
    return new Promise((resolve, reject) => {
      this.API.stack(ROUTES.getRewardsIndividual, "POST", {userOid: this.auth.userOid, companyOid: this.auth.companyOid})
      .subscribe((response) => {
        resolve(response.data.rewardsIndividual);
      }, (err) => {
        reject(err);
      })
    })
  }

  applyReward() {
    
    this.getRewadsIndividual().then((rewardsIndividual: Array<any>) => {
      if (rewardsIndividual.length) {
        const applyRewardModal = this.modalCtrl.create('ApplyRewardPage', {rewardsIndividual});
        applyRewardModal.present();

        // isFreePurchaseItem, rewardOid, userOid, rewardType
        applyRewardModal.onDidDismiss((rewardData) => {
          
          if (rewardData && rewardData.reward) {
            this.order.transactionDetails.rewards = [...this.order.transactionDetails.rewards, rewardData.reward];
            
            if (rewardData.reward.isFreePurchaseItem) {
              const freePurchaseItemPrice = this.calculateFreePurchaseItem(this.order, [rewardData.reward]);

              /* RE-CALCULATE TRANSACTION DETAILS  */
              // dairyCost, addonsCost   should i do totalCost???
              this.order.transactionDetails.rewardsSavings = Utils.round(this.order.transactionDetails.rewardsSavings + freePurchaseItemPrice);
              this.order.transactionDetails.taxes = this.order.transactionDetails.subtotal - this.order.transactionDetails.rewardsSavings === 0
                                                    ? 0
                                                    : this.calculateTaxes((this.order.transactionDetails.subtotal - this.order.transactionDetails.rewardsSavings), this.companyDetails.taxRate);
              this.order.transactionDetails.total =  this.order.transactionDetails.subtotal - this.order.transactionDetails.rewardsSavings === 0
                                                    ? 0
                                                    : Utils.round(this.order.transactionDetails.total - this.order.transactionDetails.rewardsSavings);
              this.order.transactionDetails.isRewardIndividualUsed = true;
              
              /* ONLY ALLOW 1 REWARD_INDIVIDUAL FOR NOW */
              this.showApplyRewardBtn = false

              
            }
          }
        })
      } else {
        // TODO popup no rewards_individual available
      }
    })
    .catch((err) => {
      // do nothing
      this.errorHandler(this.ERROR_TYPES.API)(err);
      
    })
    
    // get individual rewards
    // modal showing individual rewards
    // click on reward -> blur -> show buttons -> click button
    // return here with reward info
    // add to rewards arr
    // apply reward to high item
  }

  calculateTaxes(subtotal: number, TAX_RATE: number): number {
    return Utils.round(subtotal * TAX_RATE);
  }

   /*** ONLY ALLOWS 1 REWARD_INVIDUAL PER ORDER RIGHT NOW  ***/
   calculateFreePurchaseItem(order: IOrder, individualRewards: Array<any>): number {
    // set to first
    let highItem: IPurchaseItem = order.purchaseItems.length && order.purchaseItems[0]; 
    let totalPrice: number = 0;

    if (individualRewards.length && order.purchaseItems.length) {
      order.purchaseItems.forEach((x, i) => {

        if (x.sizeAndOrPrice.price > highItem.sizeAndOrPrice.price) {
            highItem = Object.assign({}, x);
            //highItem.sizeAndOrPrice.price = x.sizeAndOrPrice.price;
        }
      });

      // account for any discounts already on item
     // if (highItem.discounts > 0) highItem.sizeAndOrPrice.price -= highItem.discounts;
      
      totalPrice = (highItem.sizeAndOrPrice.price + highItem.dairyCost + highItem.addonsCost) - highItem.discounts;
      return totalPrice;
    } else return 0;
  }

  deletePurchaseItem(purchaseItem: IPurchaseItem, index: number) {
    this.order = this.checkoutStore.deletePurchaseItem(this.order, purchaseItem, index);
    this.order = this.checkoutStore.clearDiscountsAndRewards(this.order);

    if (this.order.purchaseItems.length === 0) this.order = this.checkoutStore.deleteOrder();
    else this.getEligibleRewards(this.order);
  }

  editPurchaseItem(purchaseItem: IPurchaseItem, index: number) {
   // this.navCtrl.push("EditPurchaseItemPage", {purchaseItem});

    let editPurchaseItemModal = this.modalCtrl.create("EditPurchaseItemPage", {purchaseItem}, {showBackdrop: false, enableBackdropDismiss: false});
    
    editPurchaseItemModal.onDidDismiss((data: {index?: number, purchaseItem?: IPurchaseItem} = {}) => {
      if (data.index !== null && data.purchaseItem) {
        this.order = this.checkoutStore.editOrder(data.index, data.purchaseItem);
        this.getEligibleRewards(this.order);
      }
    });
    editPurchaseItemModal.present();
  }

  submit() {
    if (this.getMinutesUntilClose(new Date(this.checkoutStore.getLocationCloseTime)) > this.eta) {
      this.presentLoading(AppViewData.getLoading().processing);
      let toData = { 
        companyOid: this.auth.companyOid, 
        locationOid: this.checkoutStore.getLocationOid, 
        userOid: this.auth.userOid,
        isOrderAhead: true,
        isProcessing: false,
        isExpired: false,
        eta: this.eta,
        userComments: this.comments,
        purchaseDate: DateUtils.toLocalIsoString(new Date().toString()),
        purchaseItems: this.order.purchaseItems,
        transactionDetails: this.order.transactionDetails,
        customerName: this.auth.firstName,
        room: this.auth.companyOid + this.checkoutStore.getLocationOid     // for websockets
      };

      console.log("toData: ", toData);

      this.API.stack(ROUTES.processTransaction, "POST", toData)
        .subscribe(
          (response) => {
            console.log('response: ', response);

            this.orderSubmitted = true;
            this.order = this.checkoutStore.clearOrder();

            this.socketIO.emit(this.socketIO.socketEvents.userPlacedNewOrder, toData);
            this.dismissLoading();

            let modal = this.modalCtrl.create('OrderCompletePage', {}, { enableBackdropDismiss: false, showBackdrop: false });
            modal.present();
            modal.onDidDismiss(() => {
              this.navCtrl.setRoot('HomePage');
            });     
          }, this.errorHandler(this.ERROR_TYPES.API));
    }
  }
}
