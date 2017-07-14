import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { Validation } from '../../utils/validation-utils';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { API, ROUTES } from '../../global/api';
import { Authentication } from '../../global/authentication';
import { BaseViewController } from '../base-view-controller/base-view-controller';
import { AppViewData } from '../../global/app-data.service';

@IonicPage()
@Component({
  selector: 'page-account-details',
  templateUrl: 'account-details.html'
})
export class AccountDetailsPage extends BaseViewController {
  myForm: FormGroup;
  logoImgSrc: string = AppViewData.getImg().logoImgSrc;
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
      private formBuilder: FormBuilder ) {

      super(alertCtrl, toastCtrl, loadingCtrl);

      this.myForm = this.formBuilder.group({
        firstName: [null, Validators.required],
        lastName: [null, Validators.required],
        email: [null, Validators.compose([Validators.required, Validation.test("isEmail")])],
        zipcode: [null, Validators.compose([Validators.required, Validation.test('isZipCode')])],
        hasPushNotifications: [true, Validators.required]
      });
  }

  ionViewDidLoad() {
    this.presentLoading();

    this.API.stack(ROUTES.getUserAccountDetails, "POST", {userOid: this.auth.userOid})
      .subscribe(
          (response) => {
            console.log('response: ', response);
            this.dismissLoading();
            let {firstName, lastName, email, zipcode, hasPushNotifications} = response.data.accountDetails;
            this.myForm.patchValue({firstName, lastName, email, zipcode, hasPushNotifications });
          }, this.errorHandler(this.ERROR_TYPES.API));
  } 

  submit(myForm) {
    this.presentLoading(AppViewData.getLoading().saving);
    let toData = {toData: myForm, userOid: this.auth.userOid};
    this.API.stack(ROUTES.editUserAccountDetails, "POST", toData)
      .subscribe(
          (response) => {
            this.dismissLoading(AppViewData.getLoading().saved);
            setTimeout(() => {
              this.navCtrl.setRoot("HomePage");
            }, 1000);
            console.log('response: ', response);
          },  this.errorHandler(this.ERROR_TYPES.API));
  }
}
