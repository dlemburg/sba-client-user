import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, ModalController, LoadingController } from 'ionic-angular';
import { StoreService } from '../../global/store.service';
import { ProductsListPage } from '../products-list/products-list';
import { CheckoutPage } from '../checkout/checkout';
import { API, ROUTES } from '../../global/api.service';
import { Authentication } from '../../global/authentication.service';
import { ImgService } from '../../global/img.service';
import { BaseViewController } from '../base-view-controller/base-view-controller';
import { AppDataService } from '../../global/app-data.service';

@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html'
})

export class CategoriesPage extends BaseViewController {
  categories: Array<any> = [];
  store: any = {
    isOrderInProgress: null
  };
  auth: any;
  canLeave: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public API: API, public authentication: Authentication, public modalCtrl: ModalController, public alertCtrl: AlertController, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public storeService: StoreService) {
    super(navCtrl, navParams, API, authentication, modalCtrl, alertCtrl, toastCtrl, loadingCtrl);
  }

  ionViewDidEnter() {
    this.canLeave = false;
  }

  ionViewDidLoad() {
    this.store.isOrderInProgress = this.storeService.isOrderInProgress;
    this.auth = this.authentication.getCurrentUser();
    this.presentLoading();
    this.API.stack(ROUTES.getCategories + `/${this.auth.companyOid}`, "GET")
      .subscribe(
          (response) => {
            this.dismissLoading();
            console.log('response: ', response);
            this.categories = response.data.categories;
            if (this.categories.length) this.categories = ImgService.checkImgIsNull(this.categories, "img");
          }, (err) => {
            const shouldPopView = false;
            this.errorHandler.call(this, err, shouldPopView)
          });
    
  }

  navToProductsList(category) {
    this.canLeave = true;
    this.navCtrl.push(ProductsListPage, {category}).catch(() => {});
  }

  navCheckout() {
    let order = this.storeService.getOrder();
    this.canLeave = true;
    
    if (!order.purchaseItems.length) {
      this.showPopup({
          title: "Almost there!", 
          message: "Your cart doesn't have any items in it yet!", 
          buttons: [ {text: "OK"}]
        });
    } else this.navCtrl.push(CheckoutPage).catch(() => {});
  }

  // canLeave is set to true on any nav route except going back
  // so if order is in progress and going back, nav guard will popup
  ionViewCanLeave(): Promise<{}>|boolean {
    if (this.storeService.isOrderInProgress && !this.canLeave) {
      return new Promise((resolve, reject) => {
        let confirm = this.alertCtrl.create({
          title: "Please Confirm", 
          message: "If you navigate back to the Locations page, you will lose all order information in your cart. Are you sure you want to do that?", 
          buttons: [
            {
              text: "Nevermind", 
              handler: () => { 
                reject(); 
              }  
            }, 
            {
              text: "Yes, it's OK", 
              handler: () => { 
                this.storeService.clearOrderInProgress();
                resolve(); 
              } 
            }
          ]
        });
        confirm.present();
      });
    } else return true;

    
  }

}


