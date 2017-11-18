import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, ModalController, LoadingController } from 'ionic-angular';
import { CheckoutStore } from '../checkout/checkout-store.service';
import { API, ROUTES } from '../../services/api';
import { Authentication } from '../../services/authentication';
import { BaseViewController } from '../../components/base-view-controller/base-view-controller';
import { AppStorage } from '../../services/app-storage.service';
import { Utils } from '../../utils/utils';

@IonicPage()
@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html'
})

export class CategoriesPage extends BaseViewController {
  categories: Array<any> = [];
  store: any = {
    isOrderInProgress: null
  };
  auth: any = this.authentication.getCurrentUser();
  appHeaderBarLogo: string = AppStorage.getImg().logoImgSrc;
  companyName: string = this.auth.companyName;
  canLeave: boolean = false;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public API: API, 
    public authentication: Authentication, 
    public modalCtrl: ModalController, 
    public alertCtrl: AlertController, 
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController, 
    public checkoutStore: CheckoutStore) {
      super(alertCtrl, toastCtrl, loadingCtrl, navCtrl);
  }

  ionViewDidEnter() {
    this.canLeave = false;
  }

  ionViewDidLoad() {
    this.store.isOrderInProgress = this.checkoutStore.isOrderInProgress;
    this.auth = this.authentication.getCurrentUser();
    this.presentLoading();
    this.API.stack(ROUTES.getCategories + `/${this.auth.companyOid}`, "GET")
      .subscribe(
          (response) => {
            this.dismissLoading();
            console.log('response: ', response);
            this.categories = Utils.getImgs(response.data.categories);

          }, this.errorHandler(this.ERROR_TYPES.API));
    
  }

  navToProductsList(category) {
    this.canLeave = true;
    this.navCtrl.push('ProductsListPage', {category}).catch(() => {});
  }

  navCheckout() {
    let order = this.checkoutStore.getOrder();
    this.canLeave = true;
    
    if (!order.purchaseItems.length) {
      this.showPopup({
          title: "Almost there!", 
          message: "Your cart doesn't have any items in it yet!", 
          buttons: [ {text: "OK"}]
        });
    } else this.navCtrl.push('CheckoutPage').catch(() => {});
  }

  // canLeave is set to true on any nav route except going back
  // so if order is in progress and going back, nav guard will popup
  ionViewCanLeave(): Promise<{}>|boolean {
    if (this.checkoutStore.isOrderInProgress && !this.canLeave) {
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
                this.checkoutStore.clearOrderInProgress();
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


