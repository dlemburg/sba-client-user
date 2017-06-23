import { Component } from '@angular/core';
import { IPurchaseItem, IErrChecks, IPopup, ProductDetailsToClient, AuthUserInfo } from '../../models/models';
import { UtilityService } from '../../global/utility.service';
import { StoreService } from '../../global/store.service';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { AppDataService } from '../../global/app-data.service';
import { BaseViewController } from '../base-view-controller/base-view-controller';
import { API, ROUTES } from '../../global/api.service';
import { Authentication } from '../../global/authentication.service';
import { ImgService } from '../../global/img.service';

@IonicPage()
@Component({
  selector: 'page-edit-purchase-item',
  templateUrl: 'edit-purchase-item.html'
})
export class EditPurchaseItemPage extends BaseViewController {
  auth: AuthUserInfo;
  productOid: number;
  productImg: string = '';
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
    numberOfFreeAddonsUntilCharged: 0,
    addonsPriceAboveLimit: 0
  };
  quantities: Array<number> = UtilityService.getNumbersList();
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
  constructor(public navCtrl: NavController, public navParams: NavParams, public API: API, public authentication: Authentication, public modalCtrl: ModalController, public alertCtrl: AlertController, public toastCtrl: ToastController, public loadingCtrl: LoadingController, private storeService: StoreService) {
    super(navCtrl, navParams, API, authentication, modalCtrl, alertCtrl, toastCtrl, loadingCtrl);
  }

  ionViewDidLoad() {
    this.presentLoading();
    this.auth = this.authentication.getCurrentUser();
    this.productOid = this.navParams.data.purchaseItem.selectedProduct.oid;
    this.purchaseItem = this.navParams.data.purchaseItem;

    this.API.stack(ROUTES.getProductDetails + `/${this.auth.companyOid}/${this.productOid}`, "GET")
      .subscribe(
          (response) => {
            console.log('response: ', response);
            this.productDetails = response.data.productDetails;
            
            /* init values */
            this.productDetails.img = ImgService.checkImgIsNull(this.productDetails.img);
            if (!this.productDetails.sizesAndPrices.length) {
              this.purchaseItem.sizeAndOrPrice = {price: this.productDetails.fixedPrice};
            }

            this.dismissLoading();
          }, (err) => {
            const shouldPopView = false;
            this.errorHandler.call(this, err, shouldPopView)
          });    
  }

  submit(): void {
    let checks = this.doChecksPurchaseItem(this.purchaseItem);
    
    if (!checks.isValid) {
       this.showPopup({
          title: AppDataService.defaultSuccessTitle, 
          message: checks.errs.join(" "), 
          buttons: [{text: AppDataService.defaultConfirmButtonText}]
        });
    } else {
      this.storeService.editOrder(this.index, this.purchaseItem); 
      this.navCtrl.pop();
    }
  }

  doChecksPurchaseItem(purchaseItem): IErrChecks {
    let errs = [];

    if (this.productDetails.sizesAndPrices.length && !purchaseItem.sizeAndOrPrice.name) {
      errs.push('You forgot to select a size!');
      return {isValid: false, errs: errs};
    }
    // if flavors are available, force a selection
    if (this.productDetails.flavorsToClient.length && !this.purchaseItem.flavors.length) {
      errs.push('You forgot to select a flavor!');
      return {isValid: false, errs: errs};
    }

    return {isValid: true, errs};
  }

  navCheckout() {
    this.navCtrl.push('CheckoutPage');
  }  
}
