import { Component } from '@angular/core';
import { API, ROUTES } from '../../global/api.service';
import { Authentication } from '../../global/authentication.service';
import { UtilityService } from '../../global/utility.service';
import { AuthUserInfo } from '../../models/models';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { BaseViewController } from '../base-view-controller/base-view-controller';


@IonicPage()
@Component({
  selector: 'page-barcode-pay',
  templateUrl: 'barcode-pay.html'
})
export class BarcodePayPage extends BaseViewController {
  companyDetails: any = {
    hasSocialMedia: true,
    socialMediaDiscount: 0.153,
    hasFacebook: true,
    hasTwitter: true,
    hasInstagram: true
  };
  socialMediaDiscountString: string;
  userPayCode: string = "1234 5678 9876";
  auth: AuthUserInfo;
  constructor(public navCtrl: NavController, public navParams: NavParams, public API: API, public authentication: Authentication, public modalCtrl: ModalController, public alertCtrl: AlertController, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
    super(navCtrl, navParams, API, authentication, modalCtrl, alertCtrl, toastCtrl, loadingCtrl);
  }
  ionViewDidLoad() {
    // API get company details && user pay code
    this.presentLoading();
    this.socialMediaDiscountString = UtilityService.percentToString(this.companyDetails.socialMediaDiscount, 1);
    this.auth = this.authentication.getCurrentUser();
    this.API.stack(ROUTES.getCompanyDetails, "GET")
      .subscribe(
          (response) => {
            console.log('response: ', response);
            this.companyDetails = response.data.companyDetails;
            this.getUserPayCode();
          }, (err) => {
            const shouldPopView = false;
            this.errorHandler.call(this, err, shouldPopView)
          });
  }

  getUserPayCode() {
     this.API.stack(ROUTES.getUserPaymentID, "POST", {userOid: this.auth.userOid, companyOid: this.auth.companyOid})
      .subscribe(
          (response) => {
            console.log('response: ', response);
            this.userPayCode = response.data.userPayCode;
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
