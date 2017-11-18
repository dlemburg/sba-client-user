import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { Validation } from '../../utils/validation-utils';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { API, ROUTES } from '../../services/api';
import { Authentication } from '../../services/authentication';
import { BaseViewController } from '../../components/base-view-controller/base-view-controller';
import { AppStorage } from '../../services/app-storage.service';
import { AppViewData } from '../../services/app-view-data.service';
import { AuthUserInfo } from '../../interfaces/interfaces';

@IonicPage()
@Component({
  selector: 'page-account-details',
  templateUrl: 'account-details.html'
})
export class AccountDetailsPage extends BaseViewController {
  myForm: FormGroup;
  logoImgSrc: string;
  auth: AuthUserInfo;
  appHeaderBarLogo: string;
  companyName: string;

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

      super(alertCtrl, toastCtrl, loadingCtrl, navCtrl);

      this.myForm = this.formBuilder.group({
        firstName: [null, Validators.required],
        lastName: [null, Validators.required],
        email: [null, Validators.compose([Validators.required, Validation.test("isEmail")])],
        zipcode: [null, Validators.compose([Validators.required, Validation.test('isZipCode')])],
        hasPushNotifications: [true, Validators.required]
      });
      this.logoImgSrc = AppStorage.getImg().logoImgSrc;
      this.auth = this.authentication.getCurrentUser();
      this.appHeaderBarLogo = AppStorage.getImg().logoImgSrc;
      this.companyName = this.auth.companyName;
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
