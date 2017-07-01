import { Component } from '@angular/core';
import { Utils } from '../../utils/utils';
import { CheckoutStore } from '../../global/checkout-store.service';
import { API, ROUTES } from '../../global/api';
import { Authentication } from '../../global/authentication';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { AppViewData } from '../../global/app-data.service';
import { IPopup, ProductDetailsToClient, IPurchaseItem, IErrChecks } from '../../models/models';
import { BaseViewController } from '../base-view-controller/base-view-controller';

@IonicPage()
@Component({
  selector: 'page-products-details',
  templateUrl: 'products-details.html'
})
export class ProductsDetailsPage extends BaseViewController {
  productImg: string = '';
  productImgSrc: string = null;
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
    dairyToClient: [],
    sweetenerToClient: [],
    varietyToClient: [],
    img: null,
    numberOfFreeAddonsUntilCharged: null,
    addonsPriceAboveLimit: null
  };
  quantities: Array<number> = Utils.getNumbersList();
  dairyQuantities: Array<number> = Utils.getNumbersList(5);
  productOid: any;
  purchaseItem: IPurchaseItem = {
    selectedProduct: {oid: null, name: null},
    sizeAndOrPrice: { oid: null, name: null, price: null},
    quantity: 1,
    addons: [],
    flavors: [],
    dairy: [],
    variety: [],
    sweetener: [],
    addonsCost: 0,
    discounts: 0
  };
  order: any = {};
  auth: any;
  isOrderInProgress: boolean;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public API: API, 
    public authentication: Authentication, 
    public modalCtrl: ModalController, 
    public alertCtrl: AlertController, 
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController, 
    private checkoutStore: CheckoutStore) {
    super(alertCtrl, toastCtrl, loadingCtrl);
  }

// this page uses checkoutStore
  ionViewDidLoad() {
    this.auth = this.authentication.getCurrentUser();
    this.productImgSrc = AppViewData.getDisplayImgSrc(this.navParams.data.product.img);
    this.productOid = this.navParams.data.product.oid;
    this.purchaseItem.selectedProduct.oid = this.navParams.data.product.oid;
    this.isOrderInProgress = this.checkoutStore.isOrderInProgress;
    this.presentLoading();

    this.API.stack(ROUTES.getProductDetails + `/${this.auth.companyOid}/${this.productOid}`, "GET")
      .subscribe(
          (response) => {
            console.log('response: ', response);
            this.dismissLoading();
            this.productDetails = response.data.productDetails;

            /* init values and purchase item */
            this.purchaseItem.selectedProduct = { name: this.productDetails.name, oid: this.productDetails.oid};
           
            // IMG
            //this.productDetails.img = ImgService.checkImgIsNull(this.productDetails.img);
            if (!this.productDetails.sizesAndPrices.length && this.productDetails.fixedPrice) {
              this.purchaseItem.sizeAndOrPrice = {name: null, oid: null, price: this.productDetails.fixedPrice};
            }

          }, (err) => {
            const shouldPopView = true;
            this.errorHandler.call(this, err, shouldPopView)
          });
  }

  addToOrder(): void {
    let doChecks = this.doChecksPurchaseItem(this.purchaseItem);
    
    if (!doChecks.isValid) {
       this.presentToast(false, doChecks.errs.join(". "), "bottom", 5000);
    } else {
      this.checkoutStore.addToOrder(this.purchaseItem, this.productDetails);


      // change this to listen for on dismiss and change route from here
      let modal = this.modalCtrl.create('AddedToCartPage', {
        purchaseItem: this.purchaseItem, 
        productImg: this.productDetails.img, 
        categoryOid: this.productDetails.categoryOid}, 
        {enableBackdropDismiss: false, showBackdrop: false});
        modal.present();

        modal.onDidDismiss((data) => {
          if (data.checkout) this.navCtrl.push("CheckoutPage");
          else if (data.continueOrer) {
             this.navCtrl.pop();
          } else {
            //do nothing
          }
        })
    }
  }

  // name, oid, price, quantity, hasQuantity

  selectDairyQuantity(index, quantity) {
    this.purchaseItem.dairy[index].quantity = quantity;
  }

  doChecksPurchaseItem(purchaseItem): IErrChecks {
    let errs = [];

    if (this.productDetails.sizesAndPrices.length && !purchaseItem.sizeAndOrPrice.name) {
      errs.push('You forgot to select a size!');
      return {isValid: false, errs: errs};
    }
    // if flavors are available, force a selection
    /*
    if (this.productDetails.flavorsToClient.length && !this.purchaseItem.flavors.length) {
      errs.push('You forgot to select a flavor!');
      return {isValid: false, errs: errs};
    }
    */
   
    return {isValid: true, errs};
  }

  navCheckout() {
    let order = this.checkoutStore.getOrder();

    if (!order.purchaseItems.length) {
        this.showPopup({
            title: "Almost there!", 
            message: "Your cart doesn't have any items in it yet!", 
            buttons: [ {text: "OK"}]
          });
      } else this.navCtrl.push('CheckoutPage');
  } 
}
