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
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html'
})
export class ForgotPasswordPage extends BaseViewController {
  myForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, public API: API, public authentication: Authentication, public modalCtrl: ModalController, public alertCtrl: AlertController, public toastCtrl: ToastController, public loadingCtrl: LoadingController, private AsyncValidation: AsyncValidation, private formBuilder: FormBuilder) {
    super(navCtrl, navParams, API, authentication, modalCtrl, alertCtrl, toastCtrl, loadingCtrl);
    this.myForm = this.formBuilder.group({
      email: [null, Validators.required]
    });
  }

  submit(myForm, isValid) {
    this.presentLoading();

    this.API.stack(ROUTES.forgotPassword, "POST", {email: myForm.email, companyOid: AppDataService.getCompanyOid})
        .subscribe(
            (response) => {
              console.log('response ', response);

              this.dismissLoading();
              const confirmHandler = () => {
                this.navCtrl.pop();
              }

              if (response.code === 2) {
                this.showPopup({
                  title: AppDataService.defaultErrorTitle, 
                  message: response.data.message || "Email not found!", 
                  buttons: [{text: AppDataService.defaultConfirmButtonText}]
                });
              } else {
                this.showPopup({
                  title: "New Temporary Password", 
                  message: `An temporary password has been sent to ${myForm.email}!`, 
                  buttons: [{text: AppDataService.defaultConfirmButtonText, handler: confirmHandler}]
                });
              }
            }, (err) => {
              const shouldPopView = false;
              this.errorHandler.call(this, err, shouldPopView)
            });
  }
}

