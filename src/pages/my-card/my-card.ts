import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,  AlertController, ModalController, ToastController, LoadingController } from 'ionic-angular';
import { AppViewData } from '../../global/app-data.service';
import { API, ROUTES } from '../../global/api';
import { Authentication } from '../../global/authentication';
import { BaseViewController } from '../base-view-controller/base-view-controller';
import { CONST_APP_IMGS } from '../../global/global';

@IonicPage()
@Component({
  selector: 'page-my-card',
  templateUrl: 'my-card.html'
})
export class MyCardPage extends BaseViewController {
  balance: number|string = 0;
  mobileCardImgSrc: string = "";
  items: Array<{component: Component, name: string}>;
  auth: any;
  unavailable: string = "Unavailable";

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public API: API, 
    public authentication: Authentication, 
    public modalCtrl: ModalController, 
    public alertCtrl: AlertController, 
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController) {

    super(alertCtrl, toastCtrl, loadingCtrl);
    
    this.auth = this.authentication.getCurrentUser();
    this.items = [
      {component: 'EditPaymentDetailsPage', name: 'Create Mobile Card'},
      {component: 'AddCardValuePage', name: 'Add Value to Mobile Card'},
      {component: 'TransactionHistoryPage', name: 'Transaction History'},
      {component: 'MyCardMorePage', name: 'More...'},
    ]
  }

  ionViewDidLoad() {
    this.presentLoading();
    this.API.stack(ROUTES.getBalance, "POST", {userOid: this.auth.userOid})
      .subscribe(
          (response) => {
            this.dismissLoading();
            console.log('response: ', response);
            this.balance = response.data.balance;
          }, this.errorHandler(this.ERROR_TYPES.API));

    // get myCardImg, doesn't need to be async
    const imgName =CONST_APP_IMGS[11];
    this.API.stack(ROUTES.getImgName + `/${this.auth.companyOid}/${imgName}`, "GET")
      .subscribe(
          (response) => {
            console.log('response: ', response);
            const img = response.data.img;
            this.mobileCardImgSrc = AppViewData.getDisplayImgSrc(img);
          },this.errorHandler(this.ERROR_TYPES.API));
  }

  nav(page) {
    this.navCtrl.push(page.component);
  }

  navBarcodePayPage() {
    this.navCtrl.push('BarcodePayPage');
  }
}
