import { Component } from '@angular/core';
import { API, ROUTES } from '../../global/api';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Authentication } from '../../global/authentication';
import { HomePage } from "../home/home";
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { AppData } from '../../global/app-data.service';
import { IPopup } from '../../models/models';
import { BaseViewController } from '../base-view-controller/base-view-controller';
import { DateUtils } from '../../utils/date-utils';

@IonicPage()
@Component({
  selector: 'page-report',
  templateUrl: 'report.html'
})
export class ReportPage extends BaseViewController {
  myForm: FormGroup;
  isSubmitted: boolean = false;
  auth: any;
  logoImgSrc: string = this.appData.getImg().logoImgSrc; 

  constructor(public navCtrl: NavController, public navParams: NavParams, public dateUtils: DateUtils, public appData: AppData, public API: API, public authentication: Authentication, public modalCtrl: ModalController, public alertCtrl: AlertController, public toastCtrl: ToastController, public loadingCtrl: LoadingController, private formBuilder: FormBuilder) {
    super(appData, modalCtrl, alertCtrl, toastCtrl, loadingCtrl);
    this.myForm = this.formBuilder.group({
      message: [null, Validators.compose([Validators.required, Validators.maxLength(200)])]
    });
  }

  ionViewDidLoad() {
    this.auth = this.authentication.getCurrentUser();
  }

  submit(myForm, isValid) {
      this.isSubmitted = true;

      /*** Package for submit ***/
      this.presentLoading("Sending...")
      const toData = {
        message: myForm.message, 
        date: this.dateUtils.toLocalIsoString(new Date().toString()), 
        name: this.auth.firstName + " " + this.auth.lastName, 
        email: this.auth.email, 
        userOid: this.auth.userOid, 
        companyOid: this.auth.companyOid
      };
      this.API.stack(ROUTES.reportIssue, "POST", toData)
        .subscribe(
            (response) => {
              console.log('response: ', response);
              this.dismissLoading("Sent!");
              this.navCtrl.setRoot('HomePage');
            }, (err) => {
              const shouldPopView = false;
              this.errorHandler.call(this, err, shouldPopView)
            });
    }
}
