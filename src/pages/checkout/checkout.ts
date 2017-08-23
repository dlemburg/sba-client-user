import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, ModalController, LoadingController, Events } from 'ionic-angular';
import { IOrder, IPurchaseItem, AuthUserInfo, ICompanyDetails } from '../../models/models';
import { CheckoutStore } from '../../global/checkout-store.service';
import { API, ROUTES } from '../../global/api';
import { Authentication } from '../../global/authentication';
import { BaseViewController } from '../base-view-controller/base-view-controller';
import { DateUtils } from '../../utils/date-utils';
import { Utils } from '../../utils/utils';
import { AppViewData } from '../../global/app-data.service';
import { SocketIO } from '../../global/socket-io';
import { CONST_REWARDS_DISCOUNT_RULE, CONST_REWARDS_DISCOUNT_TYPE, CONST_REWARDS_TYPES, CONST_REWARDS_PROCESSING_TYPE } from '../../global/global';

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
  balance: number|string = "Unavailable";
  unavailable: string = "Unavailable";
  room: number = null;
  socket: SocketIOClient.Socket;
  etas: Array<number> = Utils.getEtas();
  eta: number = 15;
  comments: string = null;
  exclusions: string = 'Note: Some rewards are not redeemable when using Order-Ahead';
  auth: any = this.authentication.getCurrentUser();
  appHeaderBarLogo: string = AppViewData.getImg().logoImgSrc;
  companyName: string = this.auth.companyName;
  showRewards: boolean = false;
  minutesUntilClose: number = 0;
  // constants
  UNAVAILABLE: string = "Unavailable";
  INSUFFICIENT_FUNDS_ALERT: string = "Uh oh! Looks like you need to add value to your card. Your balance: ";
  companyDetails: ICompanyDetails = {};
  REWARDS_TYPE = CONST_REWARDS_TYPES;
  REWARDS_PROCESSING_TYPE = CONST_REWARDS_PROCESSING_TYPE;
  REWARDS_DISCOUNT_RULE = CONST_REWARDS_DISCOUNT_RULE;
  REWARDS_DISCOUNT_TYPE = CONST_REWARDS_DISCOUNT_TYPE;


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
    this.socketIO.connect(this.room);
    const toData = { companyOid: this.auth.companyOid };

    this.API.stack(ROUTES.getCompanyDetailsForTransaction, "POST", toData)
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
    this.socketIO.disconnect();
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

  selectEta(x) { this.eta = x;}

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
