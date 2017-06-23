import { Component } from '@angular/core';
import { StoreService } from '../../global/store.service';
import { API, ROUTES } from '../../global/api.service';
import { Authentication } from '../../global/authentication.service';
import { ImgService } from '../../global/img.service';
import { IonicPage, NavController, NavParams, AlertController, ToastController, ModalController, LoadingController } from 'ionic-angular';
import { AppDataService } from '../../global/app-data.service';
import { IPopup } from '../../models/models';
import { BaseViewController } from '../base-view-controller/base-view-controller';

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
  auth: any;
  categoryOid: number = 0;
  categoryName: string = "";
  isOrderInProgress: boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams, public API: API, public authentication: Authentication, public modalCtrl: ModalController, public alertCtrl: AlertController, public toastCtrl: ToastController, public loadingCtrl: LoadingController, private storeService: StoreService) {
    super(navCtrl, navParams, API, authentication, modalCtrl, alertCtrl, toastCtrl, loadingCtrl);
  }

// this page used storeService
  ionViewDidLoad() {
   // this.isOrderInProgress = this.storeService
    this.auth = this.authentication.getCurrentUser();
    this.categoryOid = this.navParams.data.category.oid;
    this.categoryName = this.navParams.data.category.categoryName;
    this.presentLoading();

    this.API.stack(ROUTES.getProducts + `/${this.auth.companyOid}/${this.categoryOid}`, "GET")
      .subscribe(
          (response) => {
            this.dismissLoading();
            console.log('response: ', response);
            this.products = response.data.products;
            if (this.products.length) this.products = ImgService.checkImgIsNull(this.products, "img");
          }, (err) => {
            const shouldPopView = false;
            this.errorHandler.call(this, err, shouldPopView);
          });
  }

  navToProductDetails(product) {
    this.navCtrl.push('ProductsDetailsPage', {product})
  }

  navCheckout() {
    let order = this.storeService.getOrder();

    if (!order.purchaseItems.length) {
      this.showPopup({
          title: "Almost there!", 
          message: "Your cart doesn't have any items in it yet!", 
          buttons: [ {text: "OK"}]
        });
    } else this.navCtrl.push('CheckoutPage');
  }
}
