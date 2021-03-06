import { Component } from '@angular/core';
import { Validation } from '../../utils/validation-utils';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Authentication } from '../../services/authentication';
import { API, ROUTES } from '../../services/api';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { AppViewData } from '../../services/app-data.service';
import { AppStorage } from '../../services/app-storage.service';
import { BaseViewController } from '../../components/base-view-controller/base-view-controller';
import { COMPANY_OID } from '../../constants/constants';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage extends BaseViewController {
  myForm: FormGroup;
  auth: any = this.authentication.getCurrentUser();
  logoImgSrc: string = AppStorage.getImg().logoImgSrc; 
  appHeaderBarLogo: string = this.logoImgSrc.indexOf("default") > -1 ? null : this.logoImgSrc;
  companyName: string = this.auth ? this.auth.companyName : null;

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
    super(alertCtrl, toastCtrl, loadingCtrl, navCtrl);

    this.myForm = this.formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      email: [null, Validators.compose([Validators.required, Validation.test('isEmail')]) /* this.AsyncValidation.test(isEmailNotUniqueAsync.bind(this) */],
      zipcode: [null, Validators.compose([Validators.required, Validation.test('isZipcode')])],
      password: [null, Validators.required],
      password2: [null, Validators.required],
      birthday: [null, Validators.required]
    }, {validator: Validation.isMismatch('password', 'password2')});
  }

  ionViewDidLoad() {
  }

  navLogin() {
    this.navCtrl.setRoot('LoginPage');
  }

  submit(myForm, isValid) {
    const toData = myForm;
    toData.companyOid = COMPANY_OID;
    console.log("register toData: ", toData);
    this.presentLoading();

    this.API.stack(ROUTES.registerUser + `/${COMPANY_OID}`, "POST", toData)
        .subscribe(
            (response) => {
              console.log('response ', response);
              // Node: 2, .Net: 4
              if (response.code === 2 || response.code === 4) {
                this.dismissLoading();
                this.showPopup({
                  title: AppViewData.getPopup().defaultErrorTitle, 
                  message: response.message || "Sorry, this email is taken.", 
                  buttons: [{text: AppViewData.getPopup().defaultConfirmButtonText}]
                });
              } else {
                this.dismissLoading();
                const {token} = response.data;
                this.authentication.saveToken(token);
                this.navCtrl.setRoot('HomePage');
              }
            }, this.errorHandler(this.ERROR_TYPES.API));
  }
}

