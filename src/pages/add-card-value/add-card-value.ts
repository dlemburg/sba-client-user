import { Component } from '@angular/core';
import { Validation } from '../../global/validation';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UtilityService } from '../../global/utility.service';
import { API, ROUTES } from '../../global/api.service';
import { Authentication } from '../../global/authentication.service';
import { IonicPage, NavController, NavParams, AlertController, ToastController, ModalController, LoadingController } from 'ionic-angular';
import { BaseViewController } from '../base-view-controller/base-view-controller';

@IonicPage()
@Component({
  selector: 'page-add-card-value',
  templateUrl: 'add-card-value.html'
})
export class AddCardValuePage extends BaseViewController {
  cardNumberLastFourDigits: number;
  cardCVV: string;
  password: string;
  isSubmitted: boolean = false;
  auth: any;
  myForm: FormGroup;
  dollarValues: any = UtilityService.getDollarValues();

  constructor(public navCtrl: NavController, public navParams: NavParams, public API: API, public authentication: Authentication, public modalCtrl: ModalController, public alertCtrl: AlertController, public toastCtrl: ToastController, public loadingCtrl: LoadingController, private formBuilder: FormBuilder ) {
    super(navCtrl, navParams, API, authentication, modalCtrl, alertCtrl, toastCtrl, loadingCtrl);

    this.myForm = this.formBuilder.group({
      cardCVV: [null, Validators.compose([Validators.required, Validation.isCreditCardCVV])],
      dollarValue: [10, Validators.required]
    });
  }

  ionViewDidLoad() {
    this.presentLoading();
    this.API.stack(ROUTES.getCardNumberLastFourDigits, "POST", {userOid: this.auth.userOid})
      .subscribe(
          (response) => {
            console.log('response: ', response);
            this.dismissLoading();
            this.cardNumberLastFourDigits = response.data.cardNumberLastFourDigits;
          }, (err) => {
            const shouldPopView = false;
            this.errorHandler.call(this, err, shouldPopView)
          });
  }

  selectDollarValue(amount) {
    this.myForm.patchValue({dollarValue: amount});
  }

  confirmPassword() {
    this.presentLoading();
    const toData = {toData: this.password, userOid: this.auth.userOid, isEdit: false};
    this.API.stack(ROUTES.addCardValue, "POST", toData)
      .subscribe(
          (response) => {
            this.dismissLoading();
            console.log('response: ', response);
          }, (err) => {
            const shouldPopView = true;
            this.errorHandler.call(this, err, shouldPopView)
          });
  }

  submit(myForm, isValid) {
    this.isSubmitted = true;
    
    // POPUP: confirm password

    const onConfirmFn = () => {
      this.navCtrl.setRoot('HomePage');
    }

    // ROUTES.generateRewardOnFirstMobileCardUpload   (server side done, client needs implementation)

     /*** Package for submit ***/
    this.presentLoading("Adding funds...");
    const toData = {toData: myForm, userOid: this.auth.userOid, isEdit: false};
    this.API.stack(ROUTES.addCardValue, "POST", toData)
      .subscribe(
          (response) => {
            console.log('response: ', response);
            this.dismissLoading("Success!");
          }, (err) => {
            const shouldPopView = false;
            this.errorHandler.call(this, err, shouldPopView)
          });
  }

}