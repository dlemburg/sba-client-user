import { Component } from '@angular/core';
import { Validation } from '../../utils/validation-utils';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AppUtils } from '../../utils/app-utils';
import { API, ROUTES } from '../../global/api';
import { Authentication } from '../../global/authentication';
import { NavController, NavParams, AlertController, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { AppViewData } from '../../global/app-data.service';
import { IPopup } from '../../models/models';
import { BaseViewController } from '../base-view-controller/base-view-controller';

@Component({
  selector: 'page-add-card',
  templateUrl: 'add-card.html'
})
export class AddCardPage extends BaseViewController {
  //masks: any;
  auth: any;
  isSubmitted: boolean = false;
  myForm: FormGroup;
  dollarValues: Array<any>;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public API: API, 
    public authentication: Authentication, 
    public modalCtrl: ModalController, 
    public alertCtrl: AlertController, 
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController, 
    private formBuilder: FormBuilder ) {
    super(alertCtrl, toastCtrl, loadingCtrl);

    this.dollarValues = AppUtils.getDollarValues();

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
      zipcode: [null, Validators.compose([Validators.required, Validation.test('isZipcode')])],
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
    const toData: ToDataAddCard = {toData: myForm, userOid: this.auth.userOid};
    this.API.stack(ROUTES.addCard, "POST", toData)
      .subscribe(
          (response) => {
            console.log('response: ', response);
            this.dismissLoading()

          }, (err) => {
            const shouldPopView = true;
            this.errorHandler.call(this, err, shouldPopView)
          });
  }
}
interface ToDataAddCard {

}

/* MASKS-- couldn't get them to work with regex validation
  save() {
    let unmaskedData = {
        phoneNumber: this.phoneNumber.replace(/\D+/g, ''),
        cardNumber: this.cardNumber.replace(/\D+/g, ''),
        cardExpiry: this.cardExpiry.replace(/\D+/g, ''),
        cardCVV: this.cardCVV.replace(/\D+/g, ''),
    };
    console.log(unmaskedData);
  }


   // couldn't get the masks to work well with the validator regexes
     this.masks = {
         // phoneNumber: ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
         // cardNumber: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
         // cardExpiry: [/[0-1]/, /\d/, '/', /[1-2]/, /\d/],
        //  cardCVV: [/\d/, /\d/, /\d/]
      };
*/
