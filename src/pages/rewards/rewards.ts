import { Component } from '@angular/core';
import { API, ROUTES } from '../../services/api';
import { Authentication } from '../../services/authentication';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { AppViewData } from '../../services/app-data.service';
import { AppStorage } from '../../services/app-storage.service';
import { BaseViewController } from '../../components/base-view-controller/base-view-controller';
import { CONSTANT } from '../../constants/constants';
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
  appHeaderBarLogo: string = AppStorage.getImg().logoImgSrc;
  companyName: string = this.auth.companyName;
  rewardTypeIndividualMessage: string = AppViewData.getRewards().rewardTypeIndividualMessage;
  REWARDS_TYPE = {
    REWARDS_INDIVIDUAL: "rewards_individual",
    REWARDS_ALL: "rewards_all"
  };
  logoImgSrc: string = AppStorage.getImg().logoImgSrc;
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

            this.rewards_all = response.data.rewardsAll || response.data.rewards_all;
            this.rewards_individual = response.data.rewardsIndividual || response.data.rewardsIndividual;
            this.rewards_all = Utils.getImgs(this.rewards_all);
            this.rewards_individual = Utils.getImgs(this.rewards_individual);
            
          }, this.errorHandler(this.ERROR_TYPES.API));

    const imgName = CONSTANT.APP_IMGS[7];
    this.API.stack(ROUTES.getImgName + `/${this.auth.companyOid}/${imgName}`, "GET")
      .subscribe(
          (response) => {
            console.log('response: ', response);
            const img = response.data.img;
            this.rewardImgSrc = AppStorage.getDisplayImgSrc(img);
          }, (err) => {
            this.rewardImgSrc = AppStorage.getDisplayImgSrc(null);
          });
  }

  navRewardsDetails(reward): void {
  //  let rewardOid = reward.oid;
    this.navCtrl.push('RewardsDetailsPage', {reward});
  }
}
