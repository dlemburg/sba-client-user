import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AccountDetailsPage } from '../account-details/account-details';
import { AccountPasswordsPage } from '../account-passwords/account-passwords';
import { MyCardPage } from '../my-card/my-card';
import { LoginPage } from '../login/login';
import { IPopup } from '../../models/models';
import { EditPaymentDetailsPage } from '../edit-payment-details/edit-payment-details';
import { UtilityService } from '../../global/utility.service';
import { Authentication } from '../../global/authentication.service';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {
  public items: Array<{component: Component, name: string}>;
  constructor(public navCtrl: NavController, public navParams: NavParams, private authentication: Authentication, private formBuilder: FormBuilder, private alertCtrl: AlertController) {
    
  }

  ionViewDidLoad() {
    this.items = [
      {name: "My Details", component: AccountDetailsPage},
      {name: "Passwords", component: AccountPasswordsPage},
      {name: "Edit Payment Details", component: EditPaymentDetailsPage},
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
      this.navCtrl.setRoot(LoginPage);
    };
    this.showPopup({title: "Sign Out", message: "Are you sure you want to sign out?", buttons: [{text: "Cancel"}, {text: "Sign Out", handler: onConfirmFn}]});
  }

  showPopup(args: IPopup) {
    const alert = this.alertCtrl.create(args);
    alert.present();
  }

}
