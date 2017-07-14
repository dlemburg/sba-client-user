import { Component, } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-confirm-email-and-password',
  templateUrl: 'confirm-email-and-password.html',
})
export class ConfirmEmailAndPasswordPage {
  password: any;
  email: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    
  }

  ionViewDidLoad() {  }

  dismissWithData() {
    this.viewCtrl.dismiss({
      password: this.password,
      email: this.email
    })
  }

  dismiss() {
    this.viewCtrl.dismiss({
      password: null,
      email: null
    })

  }

}
