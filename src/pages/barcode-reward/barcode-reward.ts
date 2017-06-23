import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-barcode-reward',
  templateUrl: 'barcode-reward.html'
})
export class BarcodeRewardPage {
 reward: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.reward = {
      title: '',
      description: '',
      img: '',
      expiry: ''
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RewardsBarcodePage');

    this.reward = this.navParams.data.reward;
  }
}
