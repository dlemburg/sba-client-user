import { Component } from '@angular/core';
import { Validation } from '../../global/validation';
import { AsyncValidation } from '../../global/async-validation.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Authentication } from '../../global/authentication.service';
import { API, ROUTES } from '../../global/api.service';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { AppDataService } from '../../global/app-data.service';
import { IPopup } from '../../models/models';
import { BaseViewController } from '../base-view-controller/base-view-controller';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage extends BaseViewController {
  myForm: FormGroup;
  auth: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public API: API, public authentication: Authentication, public modalCtrl: ModalController, public alertCtrl: AlertController, public toastCtrl: ToastController, public loadingCtrl: LoadingController, private AsyncValidation: AsyncValidation, private formBuilder: FormBuilder) {
    super(navCtrl, navParams, API, authentication, modalCtrl, alertCtrl, toastCtrl, loadingCtrl);
    this.myForm = this.formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      email: [null, Validators.compose([Validators.required, Validation.isEmail]) /* this.AsyncValidation.isEmailNotUniqueAsync.bind(this) */],
      zipcode: [null, Validators.compose([Validators.required, Validation.isZipCode])],
      password: [null, Validators.required],
      password2: [null, Validators.required],
      birthday: [null, Validators.required]
    }, {validator: Validation.isMismatch('password', 'password2')});
  }

  ionViewDidLoad() {
    this.auth = this.authentication.getCurrentUser();
  }

  navLogin() {
    this.navCtrl.setRoot('LoginPage');
  }

  submit(myForm, isValid) {
    const toData = myForm;
    this.presentLoading();

    this.API.stack(ROUTES.registerUser + `/${AppDataService.getCompanyOid}`, "POST", toData)
        .subscribe(
            (response) => {
              console.log('response ', response);

              if (response.code === 4) {
                this.dismissLoading();
                this.showPopup({
                  title: AppDataService.defaultErrorTitle, 
                  message: response.message || "Sorry, this email is taken.", 
                  buttons: [{text: AppDataService.defaultConfirmButtonText}]
                });
              } else {
                this.dismissLoading();
                const {token} = response.data;
                this.authentication.saveToken(token);
                this.navCtrl.setRoot('HomePage');
              }
            }, (err) => {
              console.log("err: ", err);
              const shouldPopView = false;
              this.errorHandler.call(this, err, shouldPopView)
            });
  }
}

