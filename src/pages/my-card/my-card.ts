import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,  AlertController, ModalController, ToastController, LoadingController } from 'ionic-angular';
import { AppDataService } from '../../global/app-data.service';
import { API, ROUTES } from '../../global/api.service';
import { Authentication } from '../../global/authentication.service';
import { ImgService } from '../../global/img.service';
import { BaseViewController } from '../base-view-controller/base-view-controller';

@IonicPage()
@Component({
  selector: 'page-my-card',
  templateUrl: 'my-card.html'
})
export class MyCardPage extends BaseViewController {
  balance: number|string = 0;
  myCardImg: string = AppDataService.getDefaultImg;
  items: Array<{component: Component, name: string}>;
  auth: any;
  unavailable: string = "Unavailable";

  constructor(public navCtrl: NavController, public navParams: NavParams, public API: API, public authentication: Authentication, public modalCtrl: ModalController, public alertCtrl: AlertController, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
    super(navCtrl, navParams, API, authentication, modalCtrl, alertCtrl, toastCtrl, loadingCtrl);
    
    this.auth = this.authentication.getCurrentUser();
    this.myCardImg;
    this.items = [
      {component: 'AddCardPage', name: 'Create Mobile Card'},
      {component: 'AddCardValuePage', name: 'Add Value'},
      {component: 'TransactionHistoryPage', name: 'Transaction History'},
      {component: 'MyCardMorePage', name: 'More'},
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
          }, (err) => {
            const shouldPopView = false;
            this.balance = this.unavailable;
            this.errorHandler.call(this, err, shouldPopView)
          });

    // get myCardImg, doesn't need to be async
    // has nothing to do with getting balance, so just separated it
    this.API.stack(ROUTES.getMyCardImg + `/${this.auth.companyOid}`, "GET")
      .subscribe(
          (response) => {
            console.log('response: ', response);
            
            this.myCardImg = ImgService.checkImgIsNull(response.data.myCardImg, "img");
            //  CORDOVA FILE TRANSFER
          }, (err) => {
            this.myCardImg = AppDataService.getDefaultImg;
          });
  }

  nav(item) {
    this.navCtrl.push(item.component);
  }

  navBarcodePayPage() {
    this.navCtrl.push('BarcodePayPage');
  }
}
