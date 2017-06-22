import { Component } from '@angular/core';
import { RegisterPage } from '../register/register';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { Validation } from '../../global/validation';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { API, ROUTES } from '../../global/api.service';
import { Authentication } from '../../global/authentication.service';
import { HomePage } from "../home/home";
import { NavController, NavParams, AlertController, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { AppDataService } from '../../global/app-data.service';
import { IPopup } from '../../models/models';
import { BaseViewController } from '../base-view-controller/base-view-controller';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage extends BaseViewController {
  bgroundImg: string;
  myForm: FormGroup;
  img: 'img/family.png';
  backgroundImg;
  constructor(public navCtrl: NavController, public navParams: NavParams, public API: API, public authentication: Authentication, public modalCtrl: ModalController, public alertCtrl: AlertController, public toastCtrl: ToastController, public loadingCtrl: LoadingController, private formBuilder: FormBuilder) {
    super(navCtrl, navParams, API, authentication, modalCtrl, alertCtrl, toastCtrl, loadingCtrl);
  
    this.backgroundImg =  this.img;

    this.myForm = this.formBuilder.group({
      email: [null, Validators.required],
      password: [null, Validators.required]
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  navForgotPassword() {
    this.navCtrl.push(ForgotPasswordPage);
  }

  navRegister() {
    this.navCtrl.push(RegisterPage);
  }

  submit(myForm, isValid) {
    this.presentLoading();
    let toData = {companyOid: AppDataService.getCompanyOid, password: myForm.password, email: myForm.email};
    this.API.stack(ROUTES.loginUser, 'POST', toData)
        .subscribe((response) => {
            console.log('response: ', response);
            this.dismissLoading();

            if (response.code === 2) {
              this.showPopup({
                title: AppDataService.defaultErrorTitle, 
                message: response.data.message || "No email found.", 
                buttons: [{text: AppDataService.defaultConfirmButtonText}]
              });
            } else {

              let {token} = response.data;
              this.authentication.saveToken(token);
              this.navCtrl.setRoot(HomePage);
            }
          }, (err) => {
            const shouldPopView = false;
            this.errorHandler.call(this, err, shouldPopView)
          });
  }
}