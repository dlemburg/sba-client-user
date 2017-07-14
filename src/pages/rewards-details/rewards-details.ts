import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CONST_REWARDS_TYPES, CONST_REWARDS_PROCESSING_TYPE } from '../../global/global';
import { Authentication } from '../../global/authentication';
import { AppViewData } from '../../global/app-data.service';

@IonicPage()
@Component({
  selector: 'page-rewards-details',
  templateUrl: 'rewards-details.html'
})
export class RewardsDetailsPage {
  auth: any = this.authentication.getCurrentUser();
  appHeaderBarLogo: string = AppViewData.getImg().logoImgSrc;
  companyName: string = this.auth.companyName;

  reward: any;
  rewardOid: any;
  REWARDS_TYPE = CONST_REWARDS_TYPES
  REWARDS_PROCESSING_TYPE = CONST_REWARDS_PROCESSING_TYPE;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public authentication: Authentication) {
    this.reward = {
      name: '',
      startDate: null,
      expiryDate: null,
      description: '',
      img: '',
      exclusions: '',
      processingType: null,
      oid: null,
      isFreePurchaseItem: null
    }
  }

 /* gets all reward details from navParams */
  ionViewDidLoad() {
    this.reward = this.navParams.data.reward;
    console.log(this.reward);
  }


  navBarcodeReward() {
    if (this.reward.processingType === this.REWARDS_PROCESSING_TYPE.MANUAL || this.reward.rewardType === this.REWARDS_TYPE.REWARDS_INDIVIDUAL)
    this.navCtrl.push('BarcodeRewardPage', {reward: this.reward});
  }

}
