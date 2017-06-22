import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { Validation } from '../../global/validation';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { API, ROUTES } from '../../global/api.service';
import { Authentication } from '../../global/authentication.service';
import { AppDataService } from '../../global/app-data.service';
import { BaseViewController } from '../base-view-controller/base-view-controller';

@Component({
  selector: 'page-account-details',
  templateUrl: 'account-details.html'
})
export class AccountDetailsPage extends BaseViewController {
  myForm: FormGroup;
  auth: any;
    constructor(public navCtrl: NavController, public navParams: NavParams, public API: API, public authentication: Authentication, public modalCtrl: ModalController, public alertCtrl: AlertController, public toastCtrl: ToastController, public loadingCtrl: LoadingController, private formBuilder: FormBuilder ) {
      super(navCtrl, navParams, API, authentication, modalCtrl, alertCtrl, toastCtrl, loadingCtrl);

      this.myForm = this.formBuilder.group({
        firstName: [null, Validators.required],
        lastName: [null, Validators.required],
        email: [null, Validators.compose([Validators.required, Validation.isEmail])],
        zipcode: [null, Validators.compose([Validators.required, Validation.isZipCode])],
        hasPushNotifications: [true, Validators.required]
      });
  }

  ionViewDidLoad() {
    this.auth = this.authentication.getCurrentUser();
    this.presentLoading();

    this.API.stack(ROUTES.getUserAccountDetails, "POST", {userOid: this.auth.userOid})
      .subscribe(
          (response) => {
            console.log('response: ', response);
            this.dismissLoading();
            let {firstName, lastName, email, zipcode, pushNotifications} = response.data.accountDetails;
            this.myForm.patchValue({firstName, lastName, email, zipcode, pushNotifications });
          }, (err) => {
            const shouldPopView = true;
            this.errorHandler.call(this, err, shouldPopView)
          });
  } 

  submit(myForm) {
    this.presentLoading(AppDataService.loading.saving);
    let toData = {toData: myForm, userOid: this.auth.userOid};
    this.API.stack(ROUTES.editUserAccountDetails, "POST", toData)
      .subscribe(
          (response) => {
            this.dismissLoading(AppDataService.loading.saved)
            console.log('response: ', response);
          },  (err) => {
            const shouldPopView = true;
            this.errorHandler.call(this, err, shouldPopView)
          });
  }
}
