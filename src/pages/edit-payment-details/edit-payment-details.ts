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
import { Stripe } from '@ionic-native/stripe';

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
  stripePublishableKey: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public API: API, 
    public authentication: Authentication, 
    public modalCtrl: ModalController, 
    public alertCtrl: AlertController, 
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController, 
    private formBuilder: FormBuilder,
    public stripe: Stripe) {
    super(alertCtrl, toastCtrl, loadingCtrl);

    this.myForm = this.formBuilder.group({
      amount: [10, Validators.required],
      cardNumber: [null, Validators.compose([Validators.required, Validation.test('isCreditCard')])],
      expMonth: [null, Validators.compose([Validators.required, Validation.test('isMonth')])],
      expYear: [null, Validators.compose([Validators.required, Validation.test('isYear')])],
      cardCVC: [null, Validators.compose([Validators.required, Validation.test('isCreditCardCVC')]) ],
      address: [null, Validators.compose([Validators.required, Validation.test('isStreetAddress')])],
      city: [null, Validators.compose([Validators.required, Validation.test('isCity')])],
      state: [null, Validators.compose([Validators.required, Validation.test('isState')])],
      zipcode: [null, Validators.compose([Validators.required, Validation.test('isZipcode')])],
    });
  }


ionViewDidLoad() {
    this.presentLoading();
    this.auth = this.authentication.getCurrentUser();

    this.API.stack(ROUTES.getStripePublishableKey, "GET",)
      .subscribe(
          (response) => {
            console.log('response: ', response);
            this.stripePublishableKey = response.data.key;

          }, this.errorHandler(this.ERROR_TYPES.API));
  }
  selectDollarValue(amount) {
    this.myForm.patchValue({amount});
  }

  createStripeToken(myForm) {
    return new Promise((resolve, reject) => {
      this.stripe.setPublishableKey(this.stripePublishableKey);

      let card = {
        number: myForm.cardNumber,
        expMonth: myForm.expMonth,
        expYear: myForm.expYear,
        cvc: myForm.cardCVC
      };

      this.stripe.createCardToken(card).then((token) => {
        console.log(token);
        resolve({token});
      })
      .catch((err) => {
        console.log("err: ", err);
        reject(err);
      });
    });
  }

  submit(myForm, isValid) {

    this.createStripeToken(myForm).then(() => {
      const onConfirmFn = () => {
        this.navCtrl.setRoot('HomePage');
      };

      /*** Package for submit ***/
      this.presentLoading(AppViewData.getLoading().saving);
      const { address, city, state, zipcode } = myForm;
      const toData = {toData: {address, city, state, zipcode}, userOid: this.auth.userOid, email: this.auth.email, amount: myForm.amount};
      
      this.API.stack(ROUTES.createCustomer, "POST", toData)
        .subscribe(
            (response) => {
              console.log('response: ', response);
              this.dismissLoading(AppViewData.getLoading().saved);
            }, this.errorHandler(this.ERROR_TYPES.API));
      })
  }
}
