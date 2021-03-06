import { Component } from '@angular/core';
import { Utils } from '../../utils/utils';
import { CheckoutStore } from '../checkout/checkout-store.service';
import { API, ROUTES } from '../../services/api';
import { Authentication } from '../../services/authentication';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { AppStorage } from '../../services/app-storage.service';
import { ProductDetails, IPurchaseItem, IErrChecks } from '../../interfaces/interfaces';
import { BaseViewController } from '../../components/base-view-controller/base-view-controller';

@IonicPage()
@Component({
  selector: 'page-products-details',
  templateUrl: 'products-details.html'
})
export class ProductsDetailsPage extends BaseViewController {
  productImg: string = '';
  productImgSrc: string = null;
  productDetails: ProductDetails = {
    name: '',
    oid: 0,
    categoryOid: 0,
    caloriesLow: 0,
    caloriesHigh: 0,
    sizesAndPrices: [],
    fixedPrice: 0,     /* new */
    addons: [],
    flavors: [],
    dairy: [],
    sweetener: [],
    variety: [],
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
  auth: any = this.authentication.getCurrentUser();
  appHeaderBarLogo: string = AppStorage.getImg().logoImgSrc;
  companyName: string = this.auth.companyName;
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
    super(alertCtrl, toastCtrl, loadingCtrl, navCtrl);
  }

// this page uses checkoutStore
  ionViewDidLoad() {
    this.auth = this.authentication.getCurrentUser();
    this.productImg = this.navParams.data.product.img;
    this.productImgSrc = AppStorage.getDisplayImgSrc(this.productImg);
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
          
          if (!this.productDetails.sizesAndPrices.length && this.productDetails.fixedPrice) {
            this.purchaseItem.sizeAndOrPrice = {name: null, oid: null, price: this.productDetails.fixedPrice};
          }

          }, this.errorHandler(this.ERROR_TYPES.API));
  }

  addToOrder(): void {
    let doChecks = this.doChecksPurchaseItem(this.purchaseItem);
    
    if (!doChecks.isValid) {
       this.presentToast(false, doChecks.errs.join(". "), "bottom", 5000);
    } else {
      this.checkoutStore.addToOrder(this.purchaseItem, this.productDetails);

      let modal = this.modalCtrl.create('AddedToCartPage', {
          purchaseItem: this.purchaseItem, 
          productImg: this.productImg, 
        }, 
        {enableBackdropDismiss: false, showBackdrop: false});
        modal.present();

        modal.onDidDismiss((data) => {
          if (data.checkout) this.navCtrl.push("CheckoutPage");
          else if (data.continueOrder) {
             this.navCtrl.pop();
          } else {
            //do nothing
          }
        })
    }
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
