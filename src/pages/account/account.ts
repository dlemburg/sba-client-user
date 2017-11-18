import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder } from '@angular/forms';
import { IPopup } from '../../interfaces/interfaces';
import { Authentication } from '../../services/authentication';
import { API } from '../../services/api';
import { AppStorage } from '../../services/app-storage.service';

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {
  items: Array<any>;
  logoImgSrc: string = AppStorage.getImg().logoImgSrc; 
  auth: any = this.authentication.getCurrentUser();
  appHeaderBarLogo: string = AppStorage.getImg().logoImgSrc;
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
    
    this.items = [
      {name: "My Details", component: 'AccountDetailsPage'},
      {name: "Passwords", component: 'AccountPasswordsPage'},
     // {name: "Edit Payment Details", component: 'EditPaymentDetailsPage'},
      {name: "Sign Out", component: null}
    ]
  }
  
  nav(page) {
    if (page.name === "Sign Out") {
      this.signOut();
    } else this.navCtrl.push(page.component); 
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
