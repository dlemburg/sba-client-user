import { Component } from '@angular/core';
import { Validation } from '../../utils/validation-utils';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AppUtils } from '../../utils/app-utils';
import { API, ROUTES } from '../../global/api';
import { Authentication } from '../../global/authentication';
import { IonicPage, NavController, NavParams, ModalController, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { AppViewData } from '../../global/app-data.service';
import { IPopup } from '../../models/models';
import { BaseViewController } from '../base-view-controller/base-view-controller';

@IonicPage()
@Component({
  selector: 'page-edit-payment-details',
  templateUrl: 'edit-payment-details.html'
})
export class EditPaymentDetailsPage extends BaseViewController {
  isChanged: boolean = false;
  auth: any;
  isSubmitted: boolean = false;
  myForm: FormGroup;
  dollarValues: any = AppUtils.getDollarValues();
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public API: API, 
    public authentication: Authentication, 
    public modalCtrl: ModalController, 
    public alertCtrl: AlertController, 
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController, 
    private formBuilder: FormBuilder) {
    super(alertCtrl, toastCtrl, loadingCtrl);

    this.myForm = this.formBuilder.group({
      dollarValue: [10, Validators.required],
      cardNumber: [null, Validators.compose([Validators.required, Validation.test('isCreditCard')])],
      cardExpiry: [null, Validators.compose([Validators.required, Validation.test('isCreditCardExpiryDate')])],
      cardCVV: [null, Validators.compose([Validators.required, Validation.test('isCreditCardCVV')]) ],
      firstName: [null, Validators.compose([Validators.required])],
      lastName: [null, Validators.compose([Validators.required])],
      address: [null, Validators.compose([Validators.required, Validation.test('isStreetAddress')])],
      city: [null, Validators.compose([Validators.required, Validation.test('isCity')])],
      state: [null, Validators.compose([Validators.required, Validation.test('isState')])],
      zipCode: [null, Validators.compose([Validators.required, Validation.test('isZipCode')])],
      phoneNumber: [null, Validators.compose([Validators.required, Validation.test('isPhoneNumber')])]
    });
  }

  ionViewDidLoad() {
    this.auth = this.authentication.getCurrentUser();
  }

  selectDollarValue(amount) {
    this.myForm.patchValue({dollarValue: amount});
  }

  submit(myForm, isValid) {
    this.isSubmitted = true;
    
    const onConfirmFn = () => {
      this.navCtrl.setRoot('HomePage');
    }

     /*** Package for submit ***/
    this.presentLoading(AppViewData.getLoading().saving);
    const toData = {toData: myForm, userOid: this.auth.userOid, isEdit: false};
    this.API.stack(ROUTES.submitPaymentDetails, "POST", toData)
      .subscribe(
          (response) => {
            console.log('response: ', response);
            this.dismissLoading(AppViewData.getLoading().saved);
          }, this.errorHandler(this.ERROR_TYPES.API));
  }
}
