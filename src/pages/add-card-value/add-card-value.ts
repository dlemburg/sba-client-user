import { Component } from '@angular/core';
import { Validation } from '../../utils/validation-utils';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AppUtils } from '../../utils/app-utils';
import { API, ROUTES } from '../../global/api';
import { Authentication } from '../../global/authentication';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { BaseViewController } from '../base-view-controller/base-view-controller';
import { AppViewData } from '../../global/app-data.service';

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
  dollarValues: any = AppUtils.getDollarValues();

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public API: API, 
    public authentication: Authentication, 
    public alertCtrl: AlertController, 
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController, 
    private formBuilder: FormBuilder ) {
    super(alertCtrl, toastCtrl, loadingCtrl);

    this.myForm = this.formBuilder.group({
      cardCVV: [null, Validators.compose([Validators.required, Validation.test("isCreditCardCvv")])],
      dollarValue: [10, Validators.required]
    });

    this.auth = this.authentication.getCurrentUser();
  }

  ionViewDidLoad() {
    this.presentLoading();
    this.API.stack(ROUTES.getCardNumberLastFourDigits, "POST", {userOid: this.auth.userOid})
      .subscribe(
          (response) => {
            console.log('response: ', response);
            this.dismissLoading();
            this.cardNumberLastFourDigits = response.data.cardNumberLastFourDigits;
          },this.errorHandler(this.ERROR_TYPES.API));
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
          }, this.errorHandler(this.ERROR_TYPES.API));
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
          }, this.errorHandler(this.ERROR_TYPES.API));
  }

}