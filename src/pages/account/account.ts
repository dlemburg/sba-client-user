import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IPopup, AuthUserInfo } from '../../models/models';
import { Authentication } from '../../global/authentication';
import { API, ROUTES } from '../../global/api';
import { CONST_APP_IMGS } from '../../global/global';
import { AppViewData } from '../../global/app-data.service';

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {
  public items: Array<any>;
  public logoImgSrc: string = AppViewData.getImg().logoImgSrc; 
  
  auth: any = this.authentication.getCurrentUser();
  appHeaderBarLogo: string = AppViewData.getImg().logoImgSrc;
  companyName: string = this.auth.companyName;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public API: API, 
    private authentication: Authentication, 
    private formBuilder: FormBuilder, 
    private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    /*
        const img = CONST_APP_IMGS[0];

    this.API.stack(ROUTES.getImgName + `/${this.auth.companyOid}/${img}`, "GET")
      .subscribe(
        (response) => {
          console.log("response.data: ", response.data);
          this.logoImgSrc = AppViewData.getDisplayImgSrc(response.data.img);
        }, (err) => {
         // this.logoImgSrc = AppViewData.getDisplayImgSrc(null);
        });
        */

    this.items = [
      {name: "My Details", component: 'AccountDetailsPage'},
      {name: "Passwords", component: 'AccountPasswordsPage'},
     // {name: "Edit Payment Details", component: 'EditPaymentDetailsPage'},
      {name: "Sign Out", component: null}
    ]
  }
  
  nav(item) {
    if (item.name === "Sign Out") {
      this.signOut();
    } else this.navCtrl.push(item.component); 
  }

  signOut() {
    const onConfirmFn = () => {
      this.authentication.logout();
      this.navCtrl.setRoot('LoginPage');
    };
    this.showPopup({
      title: "Sign Out", 
      message: "Are you sure you want to sign out?", 
      buttons: [{text: "Cancel"}, {text: "Sign Out", handler: onConfirmFn}]
    });
  }

  showPopup(args: IPopup) {
    const alert = this.alertCtrl.create(args);
    alert.present();
  }

}
