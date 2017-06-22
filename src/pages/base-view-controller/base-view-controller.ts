import { Component } from '@angular/core';
import { RewardsDetailsPage } from '../rewards-details/rewards-details';
import { API, ROUTES } from '../../global/api.service';
import { UtilityService } from '../../global/utility.service';
import { IErrChecks, IReward } from '../../models/models';
import { Authentication } from '../../global/authentication.service';

import { TabsPage } from "../tabs/tabs";
import { NavController, NavParams, AlertController, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { AppDataService } from '../../global/app-data.service';
import { IPopup } from '../../models/models';

import { HomePage } from '../home/home';

@Component({
  selector: 'page-base-view-controller',
  templateUrl: 'base-view-controller.html'
})
export class BaseViewController {
  public loading: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public API: API, public authentication: Authentication, public modalCtrl: ModalController, public alertCtrl: AlertController, public toastCtrl: ToastController, public loadingCtrl: LoadingController ) {
  }

  // app-wide error-handler
  public errorHandler(err, shouldPopView = false) {
    this.presentToast(shouldPopView);
    this.dismissLoading();
  }


  // app-wide toast
  public presentToast(shouldPopView: Boolean, args = {message: AppDataService.defaultErrorMessage, position: AppDataService.defaultToastPosition, duration: AppDataService.defaultToastDuration}) {
    let toast = this.toastCtrl.create({
      message: args.message,
      duration: args.duration,
      position: args.position
    });

    toast.onDidDismiss(() => {
      if (shouldPopView) {
        this.navCtrl.pop();
      } else {
        // do nothing
      }
    });

    toast.present();
  }

  // modal
  presentModal(page: Component, params: any = {}, opts: any = {}) {
    let modal = this.modalCtrl.create(page, params, opts)
    modal.present();
  }
  

  // app-wide popup
  public showPopup(args: IPopup) {
    const alert = this.alertCtrl.create(args);
    alert.present();
  }

  
  // app-wide loading
  public presentLoading(message = AppDataService.loading.default) {
    this.loading = this.loadingCtrl.create({
      content: message,
      //dismissOnPageChange: true   // this is broken
    });
    this.loading.present();

    
    this.loading.onDidDismiss(() => {
      this.loading = null;
    });
    
  }

  public dismissLoading(message = null) {
    if (message) {
      setTimeout(() => {
        this.loading.dismiss();
      }, 800);

      setTimeout(() => {
        this.loading.data.content = message;
        this.loading.data.spinner = 'hide';
      }, 500);
    } else {
      this.loading.dismiss();
    }
  }

}
