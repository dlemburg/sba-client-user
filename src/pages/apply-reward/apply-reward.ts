import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-apply-reward',
  templateUrl: 'apply-reward.html',
})
export class ApplyRewardPage {
  rewardsIndividual: Array<any> = [];
  showApplyBtn: boolean = false;
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.rewardsIndividual = this.navParams.data.rewardsIndividual;
  }

  dismiss() {
    this.viewCtrl.dismiss({
      reward: null
    })
  }

  dismissWithData(reward) {
    this.viewCtrl.dismiss({
      reward
    })
  }

}
