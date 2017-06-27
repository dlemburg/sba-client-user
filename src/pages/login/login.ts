import { Component } from '@angular/core';
import { Validation } from '../../global/validation';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { API, ROUTES } from '../../global/api';
import { Authentication } from '../../global/authentication';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { AppData } from '../../global/app-data.service';
import { IPopup, AuthUserInfo } from '../../models/models';
import { BaseViewController } from '../base-view-controller/base-view-controller';
import { COMPANY_OID } from '../../global/companyOid';
import { APP_IMGS } from '../../global/global'

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage extends BaseViewController {
  bgroundImg: string;
  myForm: FormGroup;
  loginBackgroundImgSrc: string = null;
  auth: AuthUserInfo;
  logoImgSrc: string = this.appData.getImg().logoImgSrc; 
  

  constructor(public navCtrl: NavController, public navParams: NavParams, public appData: AppData, public API: API, public authentication: Authentication, public modalCtrl: ModalController, public alertCtrl: AlertController, public toastCtrl: ToastController, public loadingCtrl: LoadingController, private formBuilder: FormBuilder) {
    super(appData, modalCtrl, alertCtrl, toastCtrl, loadingCtrl);
    this.auth = this.authentication.getCurrentUser();
    this.myForm = this.formBuilder.group({
      email: [null, Validators.required],
      password: [null, Validators.required]
    });

    console.log("logoImgSrc: ", this.logoImgSrc);
  }
  ionViewDidLoad() {
    const imgName = APP_IMGS[8];
    this.API.stack(ROUTES.getImgName + `/${COMPANY_OID}/${imgName}`, "GET")
      .subscribe(
        (response) => {
          
          console.log("response.data: ", response.data);
          let img = response.data.img;
          let url = `${ROUTES.downloadImg}?img=${img}`;
          /*
          this.loginBackgroundImgSrc =  `linear-gradient(
            rgba(56, 126, 245, 0.80), 
            rgba(56, 126, 245, 0.80)
          ), url(${url}) no-repeat`;
          */
          this.loginBackgroundImgSrc =  `url(${url}) no-repeat`;
        }, (err) => {
          console.log('err: ', err);
         // this.logoImgSrc = this.appData.getDisplayImgSrc(null);
        });
  }

  navForgotPassword() {
    this.navCtrl.push('ForgotPasswordPage');
  }

  navRegister() {
    this.navCtrl.push('RegisterPage');
  }

  submit(myForm, isValid) {
    this.presentLoading();
    let toData = {companyOid: COMPANY_OID, password: myForm.password, email: myForm.email};
    this.API.stack(ROUTES.loginUser, 'POST', toData)
        .subscribe((response) => {
            console.log('response: ', response);
            this.dismissLoading();

            if (response.code === 2) {
              this.showPopup({
                title: this.appData.getPopup().defaultErrorTitle, 
                message: response.message || "No email found.", 
                buttons: [{text: this.appData.getPopup().defaultConfirmButtonText}]
              });
            } else {

              let {token} = response.data;
              this.authentication.saveToken(token);
              this.navCtrl.setRoot('HomePage');
            }
          }, (err) => {
            const shouldPopView = false;
            this.errorHandler.call(this, err, shouldPopView)
          });
  }
}