import { Component } from '@angular/core';
import { API, ROUTES } from '../../global/api.service';
import { Authentication } from '../../global/authentication.service';
import { HomePage } from "../home/home";
import { NavController, NavParams, AlertController, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { AppDataService } from '../../global/app-data.service';
import { IPopup } from '../../models/models';
import { BaseViewController } from '../base-view-controller/base-view-controller';

@Component({
  selector: 'page-transaction-history',
  templateUrl: 'transaction-history.html'
})
export class TransactionHistoryPage extends BaseViewController {
  transactions: Array<{productsArray: Array<string>, purchaseDate: string|Date, total: number}> = [];
  auth: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public API: API, public authentication: Authentication, public modalCtrl: ModalController, public alertCtrl: AlertController, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
    super(navCtrl, navParams, API, authentication, modalCtrl, alertCtrl, toastCtrl, loadingCtrl);
  }

  // transactions: purchaseDate, productsArray, total
  ionViewDidLoad() {
    this.presentLoading();
    this.auth = this.authentication.getCurrentUser();
    this.API.stack(ROUTES.getUserTransactionHistory, "POST", {userOid: this.auth.userOid})
      .subscribe(
          (response) => {
            this.dismissLoading();
            console.log('response: ', response);
            this.transactions = response.data.transactions;
          }, (err) => {
            const shouldPopView = false;
            this.errorHandler.call(this, err, shouldPopView)
          });
  }
}
