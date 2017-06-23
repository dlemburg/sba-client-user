import { Component } from '@angular/core';
import { Validation } from '../../global/validation';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { API, ROUTES } from '../../global/api.service';
import { Authentication } from '../../global/authentication.service';
import { IContactInfo } from '../../models/models';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { AppDataService } from '../../global/app-data.service';
import { IPopup } from '../../models/models';
import { BaseViewController } from '../base-view-controller/base-view-controller';
import { Dates } from '../../global/dates.service';

@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage extends BaseViewController {
  myForm: FormGroup;
  auth: any;
  contactInfo: IContactInfo = {phoneNumber: "", email: "", address: "", city: "", state: "", zipcode: null};
  showContactInfo: boolean = false;
  doCallGetCompanyContactInfo: boolean = true;
  isSubmitted: boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams, public API: API, public authentication: Authentication, public modalCtrl: ModalController, public alertCtrl: AlertController, public toastCtrl: ToastController, public loadingCtrl: LoadingController, private formBuilder: FormBuilder) {
    super(navCtrl, navParams, API, authentication, modalCtrl, alertCtrl, toastCtrl, loadingCtrl);

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
              }, (err) => {
                const shouldPopView = false;
                this.errorHandler.call(this, err, shouldPopView)
              });
     }
  }

  submit(myForm, isValid) {
    this.isSubmitted = true;

    const onConfirmFn = () => {
      this.navCtrl.setRoot('HomePage');
    }

    /*** Package for submit ***/
    this.presentLoading("Sending...");
    const toData = {
      message: myForm.message, 
      date: Dates.toLocalIsoString(new Date().toString()), 
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
          },  (err) => {
            const shouldPopView = false;
            this.errorHandler.call(this, err, shouldPopView)
          });
    }
}
