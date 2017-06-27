import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-rewards-details',
  templateUrl: 'rewards-details.html'
})
export class RewardsDetailsPage {
  reward: any;
  rewardOid: any;
  REWARDS_TYPE = {
    REWARDS_INDIVIDUAL: "rewards_individual",
    REWARDS_ALL: "rewards_all"
  };
  REWARDS_PROCESSING_TYPE = {
    AUTOMATIC: "Automatic",
    MANUAL: "Manual"
  };
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.reward = {
      name: '',
      startDate: null,
      expiryDate: null,
      description: '',
      img: '',
      exclusions: ''
    }
  }

 /* gets all reward details from navParams */
  ionViewDidLoad() {
    this.reward = this.navParams.data.reward;
    console.log(this.reward);
  }


  /* gonna have to think about this: if automatic, won't need this.

    if manual, scan

    i think this is correct
   */
  navBarcodeReward() {
    this.navCtrl.push('BarcodeRewardPage', {reward: this.reward});
  }

}
