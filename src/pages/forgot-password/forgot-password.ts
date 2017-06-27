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

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html'
})
export class ForgotPasswordPage extends BaseViewController {
  myForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, public appData: AppData, public API: API, public authentication: Authentication, public modalCtrl: ModalController, public alertCtrl: AlertController, public toastCtrl: ToastController, public loadingCtrl: LoadingController, private formBuilder: FormBuilder) {
    super(appData, modalCtrl, alertCtrl, toastCtrl, loadingCtrl);
    this.myForm = this.formBuilder.group({
      email: [null, Validators.required]
    });
  }

  submit(myForm, isValid) {
    this.presentLoading();

    this.API.stack(ROUTES.forgotPassword, "POST", {email: myForm.email, companyOid: COMPANY_OID})
        .subscribe(
            (response) => {
              console.log('response ', response);

              this.dismissLoading();
              const confirmHandler = () => {
                this.navCtrl.pop();
              }

              if (response.code === 2) {
                this.showPopup({
                  title: this.appData.getPopup().defaultErrorTitle, 
                  message: response.data.message || "Email not found!", 
                  buttons: [{text: this.appData.getPopup().defaultConfirmButtonText}]
                });
              } else {
                this.showPopup({
                  title: "New Temporary Password", 
                  message: `An temporary password has been sent to ${myForm.email}!`, 
                  buttons: [{text: this.appData.getPopup().defaultConfirmButtonText, handler: confirmHandler}]
                });
              }
            }, (err) => {
              const shouldPopView = false;
              this.errorHandler.call(this, err, shouldPopView)
            });
  }
}

