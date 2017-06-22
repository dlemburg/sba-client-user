import { Component } from '@angular/core';
import { RewardsDetailsPage } from '../rewards-details/rewards-details';
import { API, ROUTES } from '../../global/api.service';
import { Authentication } from '../../global/authentication.service';
import { ImgService } from '../../global/img.service';
import { HomePage } from "../home/home";
import { NavController, NavParams, AlertController, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { AppDataService } from '../../global/app-data.service';
import { IPopup } from '../../models/models';
import { BaseViewController } from '../base-view-controller/base-view-controller';

@Component({
  selector: 'page-rewards',
  templateUrl: 'rewards.html'
})
export class RewardsPage extends BaseViewController {
  rewards_all: Array<any> = [];
  rewards_individual: Array<any> = [];
  points: number|string = 0;
  pointsNeeded: number|string = 0;
  auth: any;
  rewardTypeIndividualMessage: string = AppDataService.rewards.rewardTypeIndividualMessage;
  REWARDS_TYPE = {
    REWARDS_INDIVIDUAL: "rewards_individual",
    REWARDS_ALL: "rewards_all"
  };
  constructor(public navCtrl: NavController, public navParams: NavParams, public API: API, public authentication: Authentication, public modalCtrl: ModalController, public alertCtrl: AlertController, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
    super(navCtrl, navParams, API, authentication, modalCtrl, alertCtrl, toastCtrl, loadingCtrl);
  }

// rewards: img, rewardOid, description, name, startDate, expiryDate, exclusions
  ionViewDidLoad() {
    this.presentLoading();
    this.auth = this.authentication.getCurrentUser();

    this.API.stack(ROUTES.getPointsAndPointsNeeded + `/${this.auth.companyOid}/${this.auth.userOid}`, "GET")
      .subscribe(
          (response) => {
            console.log('response: ', response);
            this.points = response.data.points;
            this.pointsNeeded = response.data.pointsNeeded;
          }, (err) => {
            const shouldPopView = false;
            console.log("err: ", err);
            this.errorHandler.call(this, err, shouldPopView)
          });

    // calls not related. don't need to be async
    this.API.stack(ROUTES.getRewards + `/${this.auth.companyOid}/${this.auth.userOid}`, "GET")
      .subscribe(
          (response) => {
            this.dismissLoading();
            console.log('response: ', response);

            console.log("this.auth.userOid", this.auth.userOid);

            // rewards_all
            this.rewards_all = response.data.rewards_all;
            if (this.rewards_all.length) this.rewards_all = ImgService.checkImgIsNull(this.rewards_all, "img");

            // rewards_individual
            this.rewards_individual = response.data.rewards_individual;
            if (this.rewards_individual.length) this.rewards_individual = ImgService.checkImgIsNull(this.rewards_individual, "img");

          }, (err) => {
            const shouldPopView = false;
            console.log("err: ", err);
            this.errorHandler.call(this, err, shouldPopView)
          });

  }

  navRewardsDetails(reward): void {
  //  let rewardOid = reward.oid;
    this.navCtrl.push(RewardsDetailsPage, {reward});
  }
}
