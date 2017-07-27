import { Component } from '@angular/core';
import { API, ROUTES } from '../../global/api';
import { Authentication } from '../../global/authentication';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { AppViewData } from '../../global/app-data.service';
import { IPopup } from '../../models/models';
import { BaseViewController } from '../base-view-controller/base-view-controller';

@IonicPage()
@Component({
  selector: 'page-transaction-history',
  templateUrl: 'transaction-history.html'
})
export class TransactionHistoryPage extends BaseViewController {
  transactions: Array<{productsArray: Array<string>, purchaseDate: string|Date, total: number}> = [];
  auth: any = this.authentication.getCurrentUser();
  appHeaderBarLogo: string = AppViewData.getImg().logoImgSrc;
  companyName: string = this.auth.companyName;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public API: API, 
    public authentication: Authentication, 
    public alertCtrl: AlertController, 
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController) {
      super(alertCtrl, toastCtrl, loadingCtrl, navCtrl);
  }

  // transactions: purchaseDate, productsArray, total
  ionViewDidLoad() {
    this.presentLoading();
    this.API.stack(ROUTES.getUserTransactionHistory, "POST", {userOid: this.auth.userOid})
      .subscribe(
          (response) => {
            this.dismissLoading();
            console.log('response: ', response);
            this.transactions = response.data.transactions;
          }, this.errorHandler(this.ERROR_TYPES.API));
  }
}
