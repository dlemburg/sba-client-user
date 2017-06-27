import { Component } from '@angular/core';
import { API, ROUTES } from '../../global/api';
import { Authentication } from '../../global/authentication';
import { Utils } from '../../utils/utils';
import { AuthUserInfo } from '../../models/models';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { BaseViewController } from '../base-view-controller/base-view-controller';
import { AppData } from '../../global/app-data.service';
import { SocialSharing } from '@ionic-native/social-sharing';


@IonicPage()
@Component({
  selector: 'page-barcode-pay',
  templateUrl: 'barcode-pay.html'
})
export class BarcodePayPage extends BaseViewController {
  companyDetails: any = {
    hasSocialMedia: false,
    socialMediaDiscountPercent: 0,
    hasFacebook: false,
    hasTwitter: false,
    hasInstagram: false
  };
  socialMediaDiscountString: string;
  paymentID: string = null;
  auth: AuthUserInfo;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public socialSharing: SocialSharing,
    public appData: AppData, 
    public utils: Utils, 
    public API: API, 
    public authentication: Authentication, 
    public modalCtrl: ModalController, 
    public alertCtrl: AlertController, 
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController) {
      super(appData, modalCtrl, alertCtrl, toastCtrl, loadingCtrl);
  }
  ionViewDidLoad() {
    // API get company details && user pay code
    this.presentLoading();
    this.socialMediaDiscountString = this.utils.percentToString(this.companyDetails.socialMediaDiscount, 1);
    this.auth = this.authentication.getCurrentUser();
    this.API.stack(ROUTES.getCompanyDetails, "POST", {companyOid: this.auth.companyOid})
      .subscribe(
          (response) => {
            console.log('response: ', response);
            this.companyDetails.hasSocialMedia =  response.data.companyDetails.hasSocialMedia;
            this.companyDetails.hasFacebook =  response.data.companyDetails.hasFacebook;
            this.companyDetails.hasTwitter =  response.data.companyDetails.hasTwitter;
            this.companyDetails.hasInstagram =  response.data.companyDetails.hasInstagram;
            this.companyDetails.socialMediaDiscountPercent =  response.data.companyDetails.socialMediaDiscountPercent;
            this.getUserPayCode();
          }, (err) => {
            const shouldPopView = false;
            const shouldDismiss = false;
            this.errorHandler.call(this, err, shouldPopView, shouldDismiss)
          });
  }

  getUserPayCode() {
     this.API.stack(ROUTES.getUserPaymentID, "POST", {userOid: this.auth.userOid, companyOid: this.auth.companyOid})
      .subscribe(
          (response) => {
            console.log('response: ', response);
            this.paymentID = response.data.paymentID;
            this.dismissLoading();
          }, (err) => {
            const shouldPopView = false;
            this.errorHandler.call(this, err, shouldPopView)
          });
  }

  twitter() {

  }

  facebook() {

  }

  instagram() {

  }

  submit() {
    this.navCtrl.setRoot('HomePage');
  }

}
