import { Component } from '@angular/core';
import { API, ROUTES } from '../../services/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Authentication } from '../../services/authentication';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { AppStorage } from '../../services/app-storage.service';
import { BaseViewController } from '../../components/base-view-controller/base-view-controller';
import { DateUtils } from '../../utils/date-utils';

@IonicPage()
@Component({
  selector: 'page-report',
  templateUrl: 'report.html'
})
export class ReportPage extends BaseViewController {
  myForm: FormGroup;
  isSubmitted: boolean = false;
  auth: any = this.authentication.getCurrentUser();
  appHeaderBarLogo: string = AppStorage.getImg().logoImgSrc;
  companyName: string = this.auth.companyName;
  logoImgSrc: string = AppStorage.getImg().logoImgSrc; 

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public API: API, 
    public authentication: Authentication, 
    public alertCtrl: AlertController, 
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController, 
    private formBuilder: FormBuilder) {

    super(alertCtrl, toastCtrl, loadingCtrl, navCtrl);
    this.myForm = this.formBuilder.group({
      message: [null, Validators.compose([Validators.required, Validators.maxLength(200)])]
    });
  }

  ionViewDidLoad() {
  }

  submit(myForm, isValid) {
      this.isSubmitted = true;

      /*** Package for submit ***/
      this.presentLoading("Sending...")
      const toData = {
        message: myForm.message, 
        date: DateUtils.toLocalIsoString(new Date().toString()), 
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
              setTimeout(() => {
                this.navCtrl.setRoot('HomePage');
              }, 1000)
            }, this.errorHandler(this.ERROR_TYPES.API));
    }
}
