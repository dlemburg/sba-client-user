import { Component } from '@angular/core';
import { Validation } from '../../utils/validation-utils';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { API, ROUTES } from '../../global/api';
import { Authentication } from '../../global/authentication';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { AppViewData } from '../../global/app-data.service';
import { IPopup } from '../../models/models';
import { BaseViewController } from '../base-view-controller/base-view-controller';

@IonicPage()
@Component({
  selector: 'page-account-passwords',
  templateUrl: 'account-passwords.html'
})
export class AccountPasswordsPage extends BaseViewController {
  myForm: FormGroup;
  isSubmitted: boolean = false;
  logoImgSrc: string = AppViewData.getImg().logoImgSrc; 
  auth: any = this.authentication.getCurrentUser();
  appHeaderBarLogo: string = AppViewData.getImg().logoImgSrc;
  companyName: string = this.auth.companyName;


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
      currentPassword: [null, Validators.compose([Validators.required])],
      password:  [null, Validators.compose([Validators.required])],
      password2:  [null, Validators.compose([Validators.required])]
    }, { validator: Validation.isMismatch('password', 'password2')})
  }

  ionViewDidLoad() {
  }

  submit(myForm, isValid) {
    this.isSubmitted = true;

    const onConfirmFn = () => {
      this.navCtrl.setRoot('HomePage');
    }

     /*** Package for submit ***/
    this.presentLoading(AppViewData.getLoading().saving)
    const toData = {toData: myForm, userOid: this.auth.userOid};

    console.log("toData: ", toData);
    this.API.stack(ROUTES.editPassword, "POST", toData)
      .subscribe(
          (response) => {
            console.log('response: ', response);
            this.dismissLoading(AppViewData.getLoading().saved);
            setTimeout(() => {
              this.navCtrl.setRoot("HomePage");
            }, 1000);
          }, this.errorHandler(this.ERROR_TYPES.API));
    }
}
