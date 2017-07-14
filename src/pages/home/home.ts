import { Component } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, AlertController, ModalController, ToastController, LoadingController } from 'ionic-angular';
import { IOwnerAlert } from '../../models/models';
import { API, ROUTES } from '../../global/api';
import { Authentication } from '../../global/authentication';
import { AppViewData } from '../../global/app-data.service';
import { BaseViewController } from '../base-view-controller/base-view-controller';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import { CONST_APP_IMGS } from '../../global/global';

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
  points: number|string = "Unavailable";
  unavailable: "Unavailable";
  defaultImgSrc: string = AppViewData.getImg().defaultImgSrc;
  auth: any = this.authentication.getCurrentUser();
  appHeaderBarLogo: string = AppViewData.getImg().logoImgSrc;
  companyName: string = this.auth.companyName;
  blur: boolean = false;

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
    super(alertCtrl, toastCtrl, loadingCtrl);

    this.cards = [
        {
            img: null,
            imgSrc: this.defaultImgSrc,
            name: CONST_APP_IMGS[0],
            title: 'My Mobile Card',
            subtitle: 'view card details and pay',
            component: 'MyCardPage',
            id: 0
        },
        {
            img: null,
            imgSrc: this.defaultImgSrc,
            name: CONST_APP_IMGS[1],
            title: 'Rewards',
            subtitle: 'discounts and specials you don\'t want to miss out on!',
            component: 'RewardsPage',
            id: 1
        },
        {
            img: null,
            imgSrc: this.defaultImgSrc,
            name: CONST_APP_IMGS[2],
            title: 'Order-Ahead',
            subtitle: 'skip the line!',
            component: 'LocationsPage',
            id: 2
        },
        {
            img: null,
            imgSrc: this.defaultImgSrc,
            name: CONST_APP_IMGS[3],
            title: 'Menu',
            subtitle: 'see what we have to offer!',
            component: 'CategoriesPage',
            id: 3
        }

    ];
  }

  ionViewDidLoad() {  
    // get owner alert and imgs 
    //this.presentLoading(); 
    this.getPointsAndPointsNeeded();
    this.getHomePageImgs();
  }


  ionViewDidEnter() {
    if (this.initHasRun) {
      console.log("ionViewDidEnter run...")
      this.getPointsAndPointsNeeded();
      this.getHomePageImgs();
    } else this.initHasRun = true;
  }


  getHomePageImgs() {
    this.API.stack(ROUTES.getHomePageImgs + `/${this.auth.companyOid}`, "GET")
      .subscribe(
        (response) => {
          console.log("response.data: ", response.data);
          this.cards.forEach((x) => {
            x.img = response.data.homePageImgs[x.name];
            x.imgSrc = AppViewData.getDisplayImgSrc(x.img);

            console.log("x.imgSrc: ", x.imgSrc);
          });
        }, this.errorHandler(this.ERROR_TYPES.API, undefined, {shouldDismissLoading: false}));
  }
  
  getPointsAndPointsNeeded() {
     //this.presentLoading();
     this.API.stack(ROUTES.getPointsAndPointsNeeded + `/${this.auth.companyOid}/${this.auth.userOid}`, "GET")
      .subscribe(
        (response) => {
         // this.dismissLoading();
         console.log("response.data: ", response.data); 
          this.points = response.data.points;
        }, this.errorHandler(this.ERROR_TYPES.API, undefined, {shouldDismissLoading: false}));
  }

  nav(page) {
    this.navCtrl.push(page.component);
  }
}
