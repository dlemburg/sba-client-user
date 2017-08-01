import { Component } from '@angular/core';
import { API, ROUTES } from '../../global/api';
import { Authentication } from '../../global/authentication';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { AppViewData } from '../../global/app-data.service';
import { BaseViewController } from '../base-view-controller/base-view-controller';
import { CONST_APP_IMGS } from '../../global/global';
import { Utils } from '../../utils/utils';
import { DateUtils } from '../../utils/date-utils';

@IonicPage()
@Component({
  selector: 'page-rewards',
  templateUrl: 'rewards.html'
})
export class RewardsPage extends BaseViewController {
  rewards_all: Array<any> = [];
  rewards_individual: Array<any> = [];
  points: number|string = 0;
  pointsNeeded: number|string = 0;
  auth: any = this.authentication.getCurrentUser();
  appHeaderBarLogo: string = AppViewData.getImg().logoImgSrc;
  companyName: string = this.auth.companyName;
  rewardTypeIndividualMessage: string = AppViewData.getRewards().rewardTypeIndividualMessage;
  REWARDS_TYPE = {
    REWARDS_INDIVIDUAL: "rewards_individual",
    REWARDS_ALL: "rewards_all"
  };
  logoImgSrc: string = AppViewData.getImg().logoImgSrc;
  rewardImgSrc: string = null; 

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public API: API, 
    public authentication: Authentication, 
    public modalCtrl: ModalController, 
    public alertCtrl: AlertController, 
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController) {
    super(alertCtrl, toastCtrl, loadingCtrl, navCtrl);
  }

// rewards: img, rewardOid, description, name, startDate, expiryDate, exclusions
  ionViewDidLoad() {
    this.presentLoading();
    this.API.stack(ROUTES.getPointsAndPointsNeeded + `/${this.auth.companyOid}/${this.auth.userOid}`, "GET")
      .subscribe(
          (response) => {
            console.log('response: ', response);
            this.points = response.data.points;
            this.pointsNeeded = response.data.pointsNeeded;
          }, this.errorHandler(this.ERROR_TYPES.API, undefined, {shouldDismissLoading: false}));

    // calls not related. don't need to be async
    let toData = {
      userOid: this.auth.userOid,
      companyOid: this.auth.companyOid,
      date: DateUtils.toLocalIsoString(new Date().toString())
    };
    this.API.stack(ROUTES.getRewards, "POST", toData)
      .subscribe(
          (response) => {
            this.dismissLoading();
            console.log('response: ', response);

            this.rewards_all = response.data.rewards_all;
            this.rewards_individual = response.data.rewards_individual;
            this.rewards_all = Utils.getImgs(this.rewards_all);
            this.rewards_individual = Utils.getImgs(this.rewards_individual);
            
          }, this.errorHandler(this.ERROR_TYPES.API));

    const imgName = CONST_APP_IMGS[7];
    this.API.stack(ROUTES.getImgName + `/${this.auth.companyOid}/${imgName}`, "GET")
      .subscribe(
          (response) => {
            console.log('response: ', response);
            const img = response.data.img;
            this.rewardImgSrc = AppViewData.getDisplayImgSrc(img);
          }, (err) => {
            this.rewardImgSrc = AppViewData.getDisplayImgSrc(null);
          });
  }

  navRewardsDetails(reward): void {
  //  let rewardOid = reward.oid;
    this.navCtrl.push('RewardsDetailsPage', {reward});
  }
}
