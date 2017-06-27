import { Component } from '@angular/core';
import { Validation } from '../../utils/validation-utils';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { API, ROUTES } from '../../global/api';
import { Authentication } from '../../global/authentication';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { AppData } from '../../global/app-data.service';
import { IPopup } from '../../models/models';
import { BaseViewController } from '../base-view-controller/base-view-controller';

@IonicPage()
@Component({
  selector: 'page-account-passwords',
  templateUrl: 'account-passwords.html'
})
export class AccountPasswordsPage extends BaseViewController {
  myForm: FormGroup;
  auth: any;
  isSubmitted: boolean = false;
  logoImgSrc: string = this.appData.getImg().logoImgSrc; 

  constructor(public navCtrl: NavController, public navParams: NavParams, public appData: AppData, private validation: Validation, public API: API, public authentication: Authentication, public modalCtrl: ModalController, public alertCtrl: AlertController, public toastCtrl: ToastController, public loadingCtrl: LoadingController, private formBuilder: FormBuilder ) {
      super(appData, modalCtrl, alertCtrl, toastCtrl, loadingCtrl);

    this.myForm = this.formBuilder.group({
      currentPassword: [null, Validators.compose([Validators.required])],
      password1:  [null, Validators.compose([Validators.required])],
      password2:  [null, Validators.compose([Validators.required])]
    }, { validator: this.validation.isMismatch('password1', 'password2')})
  }

  ionViewDidLoad() {
    this.auth = this.authentication.getCurrentUser();
  }

  submit(myForm, isValid) {
    this.isSubmitted = true;

    const onConfirmFn = () => {
      this.navCtrl.setRoot('HomePage');
    }

     /*** Package for submit ***/
    this.presentLoading(this.appData.getLoading().saving)
    const toData = {toData: myForm, userOid: this.auth.userOid, isEdit: false};
    this.API.stack(ROUTES.savePassword, "POST", toData)
      .subscribe(
          (response) => {
            console.log('response: ', response);
            this.showPopup({
              title: this.appData.getPopup().defaultSuccessTitle, 
              message: response.data.message || this.appData.getPopup().defaultEditSuccessMessage, 
              buttons: [{text: this.appData.getPopup().defaultConfirmButtonText, handler: onConfirmFn}]
            });

          }, (err) => {
            const shouldPopView = true;
            this.errorHandler.call(this, err, shouldPopView)
          });
    }
}
