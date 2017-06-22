import { Component } from '@angular/core';
import { Validation } from '../../global/validation';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UtilityService } from '../../global/utility.service';
import { API, ROUTES } from '../../global/api.service';
import { Authentication } from '../../global/authentication.service';
import { HomePage } from "../home/home";
import { NavController, NavParams, ModalController, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { AppDataService } from '../../global/app-data.service';
import { IPopup } from '../../models/models';
import { BaseViewController } from '../base-view-controller/base-view-controller';

@Component({
  selector: 'page-edit-payment-details',
  templateUrl: 'edit-payment-details.html'
})
export class EditPaymentDetailsPage extends BaseViewController {
  isChanged: boolean = false;
  auth: any;
  isSubmitted: boolean = false;
  myForm: FormGroup;
  dollarValues: any = UtilityService.getDollarValues();
  constructor(public navCtrl: NavController, public navParams: NavParams, public API: API, public authentication: Authentication, public modalCtrl: ModalController, public alertCtrl: AlertController, public toastCtrl: ToastController, public loadingCtrl: LoadingController, private formBuilder: FormBuilder) {
    super(navCtrl, navParams, API, authentication, modalCtrl, alertCtrl, toastCtrl, loadingCtrl);

    this.myForm = this.formBuilder.group({
      dollarValue: [10, Validators.required],
      cardNumber: [null, Validators.compose([Validators.required, Validation.isCreditCard])],
      cardExpiry: [null, Validators.compose([Validators.required, Validation.isCreditCardExpiryDate])],
      cardCVV: [null, Validators.compose([Validators.required, Validation.isCreditCardCVV]) ],
      firstName: [null, Validators.compose([Validators.required])],
      lastName: [null, Validators.compose([Validators.required])],
      address: [null, Validators.compose([Validators.required, Validation.isStreetAddress])],
      city: [null, Validators.compose([Validators.required, Validation.isCity])],
      state: [null, Validators.compose([Validators.required, Validation.isState])],
      zipCode: [null, Validators.compose([Validators.required, Validation.isZipCode])],
      phoneNumber: [null, Validators.compose([Validators.required, Validation.isPhoneNumber])]
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
      this.navCtrl.setRoot(HomePage);
    }

     /*** Package for submit ***/
    this.presentLoading(AppDataService.loading.saving);
    const toData = {toData: myForm, userOid: this.auth.userOid, isEdit: false};
    this.API.stack(ROUTES.submitPaymentDetails, "POST", toData)
      .subscribe(
          (response) => {
            console.log('response: ', response);
            this.dismissLoading(AppDataService.loading.saved);
          }, (err) => {
            const shouldPopView = false;
            this.errorHandler.call(this, err, shouldPopView)
          });
  }
}
