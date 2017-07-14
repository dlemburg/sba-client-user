import { Component } from '@angular/core';
import { Validation } from '../../utils/validation-utils';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AppUtils } from '../../utils/app-utils';
import { API, ROUTES } from '../../global/api';
import { Authentication } from '../../global/authentication';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { BaseViewController } from '../base-view-controller/base-view-controller';
import { AppViewData } from '../../global/app-data.service';
import { Stripe } from '@ionic-native/stripe';

@IonicPage()
@Component({
  selector: 'page-add-card-value',
  templateUrl: 'add-card-value.html'
})
export class AddCardValuePage extends BaseViewController {
  paymentIdLastFourDigits: number;
  amount: number = 10;
  cardCVV: string;
  password: string;
  email: string;
  isSubmitted: boolean = false;
  myForm: FormGroup;
  dollarValues: any = AppUtils.getDollarValues();
  auth: any = this.authentication.getCurrentUser();
  appHeaderBarLogo: string = AppViewData.getImg().logoImgSrc;
  companyName: string = this.auth.companyName;


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public API: API, 
    public authentication: Authentication, 
    public alertCtrl: AlertController, 
    public modalCtrl: ModalController,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController, 
    private formBuilder: FormBuilder ) {
    super(alertCtrl, toastCtrl, loadingCtrl);

  }

  ionViewDidLoad() {
    this.presentLoading();
    this.API.stack(ROUTES.getMobileCardIdLastFourDigits, "POST", {userOid: this.auth.userOid})
      .subscribe(
          (response) => {
            console.log('response: ', response);
            this.dismissLoading();
            this.paymentIdLastFourDigits = response.data.paymentIdLastFourDigits;
          },this.errorHandler(this.ERROR_TYPES.API));
  }

  selectAmount(amount) {
    this.amount = amount;
  }

  presentModal(): Promise<{code: number, message: string}> {
    return new Promise((resolve, reject) => {
      let confirmEmailAndPassword = this.modalCtrl.create("ConfirmEmailAndPasswordPage");

      confirmEmailAndPassword.onDidDismiss((data) => {
        if (data && data.password && data.email) {
          this.confirmEmailAndPasswordAPI(data.password, data.email).then((data) => {
            resolve(data);
          }).catch((err) => {
            reject(err);
          })
        } else resolve({code: 999});
      });

      confirmEmailAndPassword.present();
    });
  }

  confirmEmailAndPasswordAPI(password, email): Promise<{code: number, message: string}> {
    return new Promise((resolve, reject) => {
      const toData = {password: password, email: email, userOid: this.auth.userOid, companyOid: this.auth.companyOid};
      this.presentLoading("Confirming identity...");
      this.API.stack(ROUTES.confirmEmailAndPassword, "POST", toData)
        .subscribe(
          (response) => {
            this.dismissLoading();
            console.log('response: ', response);
            resolve({code: response.code, message: response.message});
          }, (err) => {
            this.errorHandler(this.ERROR_TYPES.API)(err);
            reject(err);
          });
    });

  }

  submit() {
    // modal password/email -> query db -> return -> alert success/fail -> server
    this.presentModal().then((data) => {
      
      // didn't complete email/password form -> do nothing
      if (data.code === 999) {
        return;
      // email or password incorrect -> alert user
      } else if (data.code === 2) {
          this.showPopup({
            title: AppViewData.getPopup().defaultErrorTitle, 
            message: data.message || "No email found.", 
            buttons: [{text: AppViewData.getPopup().defaultConfirmButtonText}]
          });
          return;
      // correct -> continue to stripe
      } else {

       /*** Package for submit ***/
        this.presentLoading("Adding funds...");
        const toData = {amount: this.amount, userOid: this.auth.userOid, email: this.auth.email, companyOid: this.auth.companyOid, companyName: this.auth.companyName};
        this.API.stack(ROUTES.addMobileCardValue, "POST", toData)
          .subscribe(
              (response) => {
                console.log('response: ', response);
                this.dismissLoading("Success!");
                this.navCtrl.setRoot("HomePage");
              }, this.errorHandler(this.ERROR_TYPES.API));
      }
    }).catch(() => {
      // do nothing, already handled
    });
  }
}