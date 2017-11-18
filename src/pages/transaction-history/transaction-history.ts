import { Component } from '@angular/core';
import { API, ROUTES } from '../../services/api';
import { Authentication } from '../../services/authentication';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { AppStorage } from '../../services/app-storage.service';
import { BaseViewController } from '../../components/base-view-controller/base-view-controller';

@IonicPage()
@Component({
  selector: 'page-transaction-history',
  templateUrl: 'transaction-history.html'
})
export class TransactionHistoryPage extends BaseViewController {
  transactions: Array<{products: any, purchaseDate: string|Date, total: number}> = [];
  auth: any = this.authentication.getCurrentUser();
  appHeaderBarLogo: string = AppStorage.getImg().logoImgSrc;
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
            this.transactions.forEach((x) => {
              if (x.products && x.products.length) x.products = x.products.split(",");
              else x.products = ["Transaction made in-store."];
              //console.log("x.products: ", x.products);
            })
          }, this.errorHandler(this.ERROR_TYPES.API));
  }
}
