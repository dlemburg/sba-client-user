import { Component } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, AlertController, ModalController, ToastController, LoadingController } from 'ionic-angular';
import { IOwnerAlert } from '../../models/models';
import { API, ROUTES } from '../../global/api.service';
import { Authentication } from '../../global/authentication.service';
import { AppDataService } from '../../global/app-data.service';
import { BaseViewController } from '../base-view-controller/base-view-controller';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
declare var cordova: any;
@IonicPage()
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
    headline: ''  // on home page
  };
  points: number|string;
  auth: any;
  unavailable: "Unavailable";
  defaultImgSrc: string = AppDataService.getDefaultImg;


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public API: API, 
    public authentication: Authentication, 
    public modalCtrl: ModalController, 
    public alertCtrl: AlertController, 
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController,
    private transfer: Transfer, 
    private file: File,
    private platform: Platform,

    ) {
    super(navCtrl, navParams, API, authentication, modalCtrl, alertCtrl, toastCtrl, loadingCtrl);

    this.cards = [
        {
            img: null,
            imgSrc: null,
            name: 'homeMyCardImg',
            title: 'My Mobile Card',
            subtitle: 'View card details and Pay',
            component: 'MyCardPage',
            id: 0
        },
        {
            img: null,
            imgSrc: null,
            name: 'homeRewardsImg',
            title: 'Rewards',
            subtitle: 'Discounts and specials you don\'t want to miss out on!',
            component: 'RewardsPage',
            id: 1
        },
        {
            img: null,
            imgSrc: null,
            name: 'homeOrderAheadImg',
            title: 'Order Ahead',
            subtitle: 'Skip the line!',
            component: 'LocationsPage',
            id: 2
        },
        {
            img: null,
            imgSrc: null,
            name: 'homeMenuImg',
            title: 'Menu',
            subtitle: 'See what we have to offer!',
            component: 'CategoriesPage',
            id: 3
        }

    ];
  }

  ionViewDidLoad() {  
    // get owner alert and imgs 
    //this.presentLoading(); 
    this.auth = this.authentication.getCurrentUser();
    this.getPointsAndPointsNeeded();
    this.getHomePageImgs();
   
  }

  ionViewDidEnter() {
    if (this.initHasRun) {
      this.getPointsAndPointsNeeded();
    } else this.initHasRun = true;
  }

  getHomePageImgs() {
    this.API.stack(ROUTES.getHomePageImgs + `/${this.auth.companyOid}`, "GET")
      .subscribe(
        (response) => {
          console.log("response.data: ", response.data);
          this.cards.forEach((x) => {
            x.img = response.data.homePageImgs[x.name];
            x.imgSrc = x.img ? ROUTES.downloadImg + `?img=${x.img}` : AppDataService.getDefaultImg;     // this.downloadImg(x, "img", "imgSrc");
          });
        }, (err) => {
            this.points = this.unavailable;
           // const shouldPopView = false;
           // this.errorHandler.call(this, err, shouldPopView);
        });
  }

  getPointsAndPointsNeeded() {
     //this.presentLoading();
     this.API.stack(ROUTES.getPointsAndPointsNeeded + `/${this.auth.companyOid}/${this.auth.userOid}`, "GET")
      .subscribe(
        (response) => {
         // this.dismissLoading();
          this.points = response.data.points;
        }, (err) => {
            this.points = this.unavailable;
           // const shouldPopView = false;
           // this.errorHandler.call(this, err, shouldPopView);
          });
  }

  nav(obj) {
    this.navCtrl.push(obj.component);
  }
}
