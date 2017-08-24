import { Component } from '@angular/core';
import { IPurchaseItem, IErrChecks, IPopup, ProductDetailsToClient, AuthUserInfo } from '../../models/models';
import { Utils } from '../../utils/utils';
import { CheckoutStore } from '../../global/checkout-store.service';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController, ModalController, ViewController } from 'ionic-angular';
import { AppViewData } from '../../global/app-data.service';
import { BaseViewController } from '../base-view-controller/base-view-controller';
import { API, ROUTES } from '../../global/api';
import { Authentication } from '../../global/authentication';

@IonicPage()
@Component({
  selector: 'page-edit-purchase-item',
  templateUrl: 'edit-purchase-item.html'
})
export class EditPurchaseItemPage extends BaseViewController {
  auth: any = this.authentication.getCurrentUser();
  appHeaderBarLogo: string = AppViewData.getImg().logoImgSrc;
  companyName: string = this.auth.companyName;
  productOid: number;
  productImg: string = '';
  dairyQuantities: Array<number> = Utils.getNumbersList(5);
  productDetails: ProductDetailsToClient = {
    name: '',
    oid: 0,
    categoryOid: 0,
    caloriesLow: 0,
    caloriesHigh: 0,
    sizesAndPrices: [],
    fixedPrice: 0,     /* new */
    addonsToClient: [],
    flavorsToClient: [],
    varietyToClient: [],
    dairyToClient: [],
    sweetenerToClient: [],
    img: '',
    imgSrc: '',
    numberOfFreeAddonsUntilCharged: 0,
    addonsPriceAboveLimit: 0
  };
  quantities: Array<number> = Utils.getNumbersList();
  purchaseItem: IPurchaseItem = {
    selectedProduct: {oid: null, name: null},
    sizeAndOrPrice: { oid: null, name: null, price: null},
    quantity: 0,
    addons: [],
    flavors: [],
    addonsCost: null,
    discounts: null
  };
  order: any = {};
  index: number;
  isOrderInProgress: boolean = this.checkoutStore.isOrderInProgress;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public API: API, 
    public authentication: Authentication, 
    public modalCtrl: ModalController, 
    public alertCtrl: AlertController, 
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController, 
    public viewCtrl: ViewController,
    private checkoutStore: CheckoutStore) {
    super(alertCtrl, toastCtrl, loadingCtrl, navCtrl);
  }

  ionViewDidLoad() {
    this.presentLoading();
    this.productOid = this.navParams.data.purchaseItem.selectedProduct.oid;
    this.purchaseItem = this.navParams.data.purchaseItem;

    this.API.stack(ROUTES.getProductDetails + `/${this.auth.companyOid}/${this.productOid}`, "GET")
      .subscribe(
          (response) => {
            console.log('response: ', response);
            this.productDetails = response.data.productDetails;
            
            /* init values */
            this.productDetails.imgSrc = AppViewData.getDisplayImgSrc(this.productDetails.img);
            if (!this.productDetails.sizesAndPrices.length) {
              this.purchaseItem.sizeAndOrPrice = {price: this.productDetails.fixedPrice};
            }

            this.dismissLoading();
          }, this.errorHandler(this.ERROR_TYPES.API));    
  }

   // [compareWith]="compareFn"
  compareFn(c1, c2): boolean {
      return c1 && c2 ? c1.oid === c2.oid : c1 === c2;
  }

  onSelectCheckQuantityDefault(arr, field) {
    this.purchaseItem[field].forEach((x) => {
      if (x.hasQuantity && !x.quantity) x.quantity = x.defaultQuantity || 3;
    });
  }

  selectDairyQuantity(index, quantity) {
    this.purchaseItem.dairy[index].quantity = quantity;
  }



  doChecksPurchaseItem(purchaseItem): IErrChecks {
    let errs = [];

    if (this.productDetails.sizesAndPrices.length && !purchaseItem.sizeAndOrPrice.name) {
      errs.push('You forgot to select a size!');
      return {isValid: false, errs: errs};
    }
    return {isValid: true, errs};
  }

  dissmissWithoutData() {
    this.viewCtrl.dismiss({
      index: null,
      purchaseItem: null
    })
  }

  submit(): void {
    let doChecks = this.doChecksPurchaseItem(this.purchaseItem);
    
    if (!doChecks.isValid) {
       this.showPopup({
          title: AppViewData.getPopup().defaultSuccessTitle, 
          message: doChecks.errs.join(" "), 
          buttons: [{text: AppViewData.getPopup().defaultConfirmButtonText}]
        });
    } else {
      this.viewCtrl.dismiss({
        index: this.index,
        purchaseItem: this.purchaseItem
      });
     // this.navCtrl.pop();
    }
  }
}
