import { Component } from '@angular/core';
import { CheckoutStore } from '../checkout/checkout-store.service';
import { API, ROUTES } from '../../services/api';
import { Authentication } from '../../services/authentication';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { AppStorage } from '../../services/app-storage.service';
import { BaseViewController } from '../../components/base-view-controller/base-view-controller';
import { Utils } from '../../utils/utils';

@IonicPage()
@Component({
  selector: 'page-products-list',
  templateUrl: 'products-list.html'
})
export class ProductsListPage extends BaseViewController {
  products: Array<any> = [];
  category: any = {
    title: '',
    img: ''
  };
  auth: any = this.authentication.getCurrentUser();
  appHeaderBarLogo: string = AppStorage.getImg().logoImgSrc;
  companyName: string = this.auth.companyName;
  categoryOid: number = 0;
  categoryName: string = "";
  isOrderInProgress: boolean = this.checkoutStore.isOrderInProgress;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public API: API, 
    public authentication: Authentication, 
    public alertCtrl: AlertController, 
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController, 
    private checkoutStore: CheckoutStore) {
    super(alertCtrl, toastCtrl, loadingCtrl, navCtrl);
  }

// this page used checkoutStore
  ionViewDidLoad() {
   // this.isOrderInProgress = this.checkoutStore
    this.auth = this.authentication.getCurrentUser();
    this.categoryOid = this.navParams.data.category.oid;
    this.categoryName = this.navParams.data.category.name;
    this.presentLoading();

    this.API.stack(ROUTES.getProducts + `/${this.auth.companyOid}/${this.categoryOid}`, "GET")
      .subscribe(
          (response) => {
            this.dismissLoading();
            console.log('response: ', response);
            this.products = Utils.getImgs(response.data.products);

          }, this.errorHandler(this.ERROR_TYPES.API));
  }

  navProductDetails(product) {
    this.navCtrl.push('ProductsDetailsPage', {product})
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
