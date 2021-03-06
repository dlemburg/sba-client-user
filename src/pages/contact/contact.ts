import { Component } from '@angular/core';
// import { Validation } from '../../services/validation';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { API, ROUTES } from '../../services/api';
import { Authentication } from '../../services/authentication';
import { IContactInfo } from '../../interfaces/interfaces';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { AppStorage } from '../../services/app-storage.service';
import { BaseViewController } from '../../components/base-view-controller/base-view-controller';
import { DateUtils } from '../../utils/date-utils';

@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage extends BaseViewController {
  myForm: FormGroup;
  auth: any = this.authentication.getCurrentUser();
  appHeaderBarLogo: string = AppStorage.getImg().logoImgSrc;
  companyName: string = this.auth.companyName;
  contactInfo = <IContactInfo>{};
  showContactInfo: boolean = false;
  doCallGetCompanyContactInfo: boolean = true;
  isSubmitted: boolean;
  
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
      message: [null, Validators.compose([Validators.required, Validators.maxLength(200)])]
    });
  }

  ionViewDidLoad() {
    this.auth = this.authentication.getCurrentUser();
  }

  facebook() {

  }

  twitter() {

  }

  instagram() {

  }

  getContactInfo() {
     this.showContactInfo = !this.showContactInfo;

     if (this.doCallGetCompanyContactInfo) {
        this.doCallGetCompanyContactInfo = false;
        this.presentLoading();

        this.API.stack(ROUTES.getCompanyContactInfo + `/${this.auth.companyOid}`, "GET")
          .subscribe(
            (response) => {
              this.dismissLoading();
              console.log('response: ', response);
              this.contactInfo = response.data.contactInfo;         
            }, this.errorHandler(this.ERROR_TYPES.API));
     }
  }

  submit(myForm, isValid) {
    this.isSubmitted = true;

    // const onConfirmFn = () => {
    //   this.navCtrl.setRoot('HomePage');
    // }

    /*** Package for submit ***/
    this.presentLoading("Sending...");
    const toData = {
      message: myForm.message, 
      date: DateUtils.toLocalIsoString(new Date().toString()), 
      name: this.auth.firstName + " " + this.auth.lastName, 
      email: this.auth.email, 
      userOid: this.auth.userOid, 
      companyOid: this.auth.companyOid
    };
    this.API.stack(ROUTES.contactCompany, "POST", toData)
      .subscribe(
          (response) => {
            console.log('response: ', response);
            this.dismissLoading("Sent!");
            this.navCtrl.setRoot('HomePage');
          }, this.errorHandler(this.ERROR_TYPES.API));
    }
}
