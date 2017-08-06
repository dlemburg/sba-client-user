import { Component } from '@angular/core';
import { Validation } from '../../utils/validation-utils';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Utils } from '../../utils/utils';
import { API, ROUTES } from '../../global/api';
import { Authentication } from '../../global/authentication';
import { IonicPage, NavController, NavParams, ModalController, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { AppViewData } from '../../global/app-data.service';
import { IPopup } from '../../models/models';
import { BaseViewController } from '../base-view-controller/base-view-controller';
import { Stripe } from '@ionic-native/stripe';

@IonicPage()
@Component({
  selector: 'page-add-credit-card',
  templateUrl: 'add-credit-card.html'
})
export class AddCreditCardPage extends BaseViewController {
  isChanged: boolean = false;
  isSubmitted: boolean = false;
  cardDetailsForm: FormGroup;
  extraInformationForm: FormGroup;
  dollarValues: any = Utils.getDollarValues();
  months: any = Utils.getMonths();
  years: any = Utils.getYears();
  states: any = Utils.getStates();
  stripePublishableKey: string;
  auth: any = this.authentication.getCurrentUser();
  appHeaderBarLogo: string = AppViewData.getImg().logoImgSrc;
  companyName: string = this.auth.companyName;


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
    super(alertCtrl, toastCtrl, loadingCtrl, navCtrl);

    this.cardDetailsForm = this.formBuilder.group({
      amount: [10, Validators.required],
      cardNumber: [null, Validators.compose([Validators.required, Validators.minLength(14)])],
      expMonth: [null, Validators.compose([Validators.required])],
      expYear: [null, Validators.compose([Validators.required])],
      cardCVC: [null, Validators.compose([Validators.required, Validation.test('isCreditCardCVC')]) ]
    });

    this.extraInformationForm = this.formBuilder.group({
      address: [null, Validators.compose([Validators.required, Validation.test('isStreetAddress')])],
      city: [null, Validators.compose([Validators.required, Validation.test('isCity')])],
      state: [null, Validators.compose([Validators.required, Validation.test('isState')])],
      zipcode: [null, Validators.compose([Validators.required, Validation.test('isZipcode')])],
    });
    
  }


ionViewDidLoad() {
    this.presentLoading();

    this.API.stack(ROUTES.getStripePublishableKey, "POST")
      .subscribe(
          (response) => {
            this.dismissLoading();
            console.log('response: ', response);
            this.stripePublishableKey = response.data.key;

          }, (err) => {
            this.errorHandler(this.ERROR_TYPES.API, undefined)(err);
            this.navCtrl.pop();
          });
  }

  selectAmount(amount) {
    this.cardDetailsForm.patchValue({amount});
  }

  createStripeToken(cardDetailsForm) {
    return new Promise((resolve, reject) => {
      this.stripe.setPublishableKey(this.stripePublishableKey);

      let card = {
        number: cardDetailsForm.cardNumber,
        expMonth: cardDetailsForm.expMonth,
        expYear: cardDetailsForm.expYear,
        cvc: cardDetailsForm.cardCVC
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

  stripeCardValidators(cardDetailsForm) {
    const p1 = this.stripe.validateCardNumber(cardDetailsForm.cardNumber);
    const p2 = this.stripe.validateCVC(cardDetailsForm.cardCVC);
    const p3 = this.stripe.validateExpiryDate(cardDetailsForm.expMonth, cardDetailsForm.expYear);

    return Promise.all([p1, p2, p3]);
  }


  submit() {
    const cardDetailsForm = this.cardDetailsForm.value;
    const extraInformationForm = this.extraInformationForm.value;

    debugger;

    this.stripeCardValidators(cardDetailsForm).then(() => {
      return this.createStripeToken(cardDetailsForm);
    })
    .then(() => {
      /*** Package for submit ***/
        this.presentLoading(AppViewData.getLoading().saving);
        const toData = {toData: extraInformationForm, userOid: this.auth.userOid, email: this.auth.email, amount: cardDetailsForm.amount};
        
        this.API.stack(ROUTES.addCreditCard, "POST", toData)
          .subscribe(
              (response) => {
                console.log('response: ', response);
                this.dismissLoading(AppViewData.getLoading().saved);
              }, this.errorHandler(this.ERROR_TYPES.API));
    })
    .catch((err) => {
      console.log("err: ", err);
      this.presentToast(
        false, 
        `Uh Oh! Looks like some of your credit card details are invalid.
          This error has come from our official credit card processing intermediary, so if you feel this is an error, 
          please fill out an issue report (do not include any confidential details), and we will try to resolve it ASAP.`,
        "bottom",
        6000);
    })
      
  }
}
