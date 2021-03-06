import { Component } from '@angular/core';
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
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html'
})
export class ForgotPasswordPage extends BaseViewController {
  myForm: FormGroup;
  auth: any = this.authentication.getCurrentUser();
  appHeaderBarLogo: string = AppStorage.getImg().logoImgSrc;
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
                  title: AppViewData.getPopup().defaultErrorTitle, 
                  message: response.data.message || "Email not found!", 
                  buttons: [{text: AppViewData.getPopup().defaultConfirmButtonText}]
                });
              } else {
                this.showPopup({
                  title: "New Temporary Password", 
                  message: `An temporary password has been sent to ${myForm.email}!`, 
                  buttons: [{text: AppViewData.getPopup().defaultConfirmButtonText, handler: confirmHandler}]
                });
              }
            }, this.errorHandler(this.ERROR_TYPES.API));
  }
}

