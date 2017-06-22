import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController, ToastController, LoadingController } from 'ionic-angular';
import { IOwnerAlert } from '../../models/models';
import { API, ROUTES } from '../../global/api.service';
import { Authentication } from '../../global/authentication.service';
import { MyCardPage } from '../my-card/my-card';
import { PointsPage } from '../points/points';
import { RewardsPage } from '../rewards/rewards';
import { OrderAheadPage } from '../order-ahead/order-ahead';
import { LocationsPage } from '../locations/locations';
import { CategoriesPage } from '../categories/categories';
import { AppDataService } from '../../global/app-data.service';
import { BaseViewController } from '../base-view-controller/base-view-controller';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage extends BaseViewController {
  cards: any;
  initHasRun: boolean = false;
  ownerAlert: IOwnerAlert = {
    type: '',   // reward or product
    description: '',  // on page
    img: '',
    headline: 'New Snow Cone Flavor Alert!!!'  // on home page
  };
  points: number|string;
  auth: any;
  unavailable: "Unavailable";
  constructor(public navCtrl: NavController, public navParams: NavParams, public API: API, public authentication: Authentication, public modalCtrl: ModalController, public alertCtrl: AlertController, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
    super(navCtrl, navParams, API, authentication, modalCtrl, alertCtrl, toastCtrl, loadingCtrl);

    this.cards = [
        {
            img: 'img/family.png',
            title: 'My Card',
            subtitle: 'View card details and Pay',
            component: MyCardPage,
            id: 0
        },
        {
            img: 'img/family.png',
            title: 'Rewards',
            subtitle: 'Discounts and specials you don\'t want to miss out on!',
            component: RewardsPage,
            id: 1
        },
        {
            img: 'img/family.png',
            title: 'Order Ahead',
            subtitle: 'Skip the line!',
            component: LocationsPage,
            id: 2
        },
        {
            img: 'img/family.png',
            title: 'Menu',
            subtitle: 'See what we have to offer!',
            component: CategoriesPage,
            id: 3
        }
    ];
  }

  ionViewDidLoad() {  
    // get owner alert and imgs 
    //this.presentLoading(); 
    this.auth = this.authentication.getCurrentUser();
    this.getPointsAndPointsNeeded();
   
  }

  ionViewDidEnter() {
    if (this.initHasRun) {
      this.getPointsAndPointsNeeded();
    } else this.initHasRun = true;
  }

  getPointsAndPointsNeeded() {
     this.API.stack(ROUTES.getPointsAndPointsNeeded + `/${this.auth.companyOid}/${this.auth.userOid}`, "GET")
      .subscribe(
        (response) => {
          //this.dismissLoading();
          this.points = response.data.points;
        }, (err) => {
            this.points = this.unavailable;
            //const shouldPopView = false;
            //this.errorHandler.call(this, err, shouldPopView)
          });
  }

  nav(obj) {
    this.navCtrl.push(obj.component);
  }
}
