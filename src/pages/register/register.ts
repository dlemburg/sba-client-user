import { Component } from '@angular/core';
import { Validation } from '../../utils/validation-utils';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Authentication } from '../../global/authentication';
import { API, ROUTES } from '../../global/api';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { AppData } from '../../global/app-data.service';
import { IPopup } from '../../models/models';
import { BaseViewController } from '../base-view-controller/base-view-controller';
import { COMPANY_OID } from '../../global/companyOid';
import { APP_IMGS } from '../../global/global';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage extends BaseViewController {
  myForm: FormGroup;
  auth: any;
  logoImgSrc: string = this.appData.getImg().logoImgSrc; 

  constructor(public navCtrl: NavController, public navParams: NavParams, public validation: Validation, public appData: AppData, public API: API, public authentication: Authentication, public modalCtrl: ModalController, public alertCtrl: AlertController, public toastCtrl: ToastController, public loadingCtrl: LoadingController, private formBuilder: FormBuilder) {
    super(appData, modalCtrl, alertCtrl, toastCtrl, loadingCtrl);
    this.myForm = this.formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      email: [null, Validators.compose([Validators.required, this.validation.test('isEmail')]) /* this.Asyncthis.validation.test(isEmailNotUniqueAsync.bind(this) */],
      zipcode: [null, Validators.compose([Validators.required, this.validation.test('isZipcode')])],
      password: [null, Validators.required],
      password2: [null, Validators.required],
      birthday: [null, Validators.required]
    }, {validator: this.validation.isMismatch('password', 'password2')});
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

    this.API.stack(ROUTES.registerUser + `/${COMPANY_OID}`, "POST", toData)
        .subscribe(
            (response) => {
              console.log('response ', response);

              if (response.code === 4) {
                this.dismissLoading();
                this.showPopup({
                  title: this.appData.getPopup().defaultErrorTitle, 
                  message: response.message || "Sorry, this email is taken.", 
                  buttons: [{text: this.appData.getPopup().defaultConfirmButtonText}]
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

