import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthUserInfo } from '../../models/models';
import { Authentication } from '../../global/authentication';

@IonicPage()
@Component({
  selector: 'page-barcode-reward',
  templateUrl: 'barcode-reward.html'
})
export class BarcodeRewardPage {
  reward: any;
  auth: AuthUserInfo = this.authentication.getCurrentUser();
  barcodeData: string = null;
  isFreePurchaseItem: number = 1;
  constructor(public navCtrl: NavController, public navParams: NavParams, public authentication: Authentication) {
    this.reward = {
      title: '',
      description: '',
      img: '',
      expiry: ''
    }
    this.reward = this.navParams.data.reward;
    this.isFreePurchaseItem = this.isFreePurchaseItem ? 1 : 0;
    this.barcodeData = `${this.reward.oid}$${this.isFreePurchaseItem}$${this.auth.companyOid}`;

  }

      // barcode data will only have rewardOid, isFreePurchaseItem, userOid
      // i.e.: 139$1$28

  ionViewDidLoad() {
  }

  submit() {
    this.navCtrl.pop();
  }
}
