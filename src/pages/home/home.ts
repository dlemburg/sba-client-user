import { Component } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, AlertController, ModalController, ToastController, LoadingController } from 'ionic-angular';
import { IOwnerAlert } from '../../interfaces/interfaces';
import { API, ROUTES } from '../../services/api';
import { Authentication } from '../../services/authentication';
import { AppStorage } from '../../services/app-storage.service';
import { BaseViewController } from '../../components/base-view-controller/base-view-controller';
import { Transfer } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import { CONSTANT } from '../../constants/constants';

declare var cordova: any;
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage extends BaseViewController {
  cards: any;
  initHasRun: boolean = false;
  ownerAlert = <IOwnerAlert> {};
  points: number|string = "Unavailable";
  unavailable: "Unavailable";
  defaultImgSrc: string = AppStorage.getImg().defaultImgSrc;
  auth: any = this.authentication.getCurrentUser();
  appHeaderBarLogo: string = AppStorage.getImg().logoImgSrc;
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
    super(alertCtrl, toastCtrl, loadingCtrl, navCtrl);

    this.cards = [
        {
            img: null,
            imgSrc: null,
            imgName: CONSTANT.APP_HOME_IMGS[0],
            title: 'My Mobile Card',
            subtitle: 'view card details and pay',
            component: 'MyCardPage',
            id: 0
        },
        {
            img: null,
            imgSrc: null,
            imgName: CONSTANT.APP_HOME_IMGS[1],
            title: 'Rewards',
            subtitle: 'discounts and specials you don\'t want to miss out on!',
            component: 'RewardsPage',
            id: 1, 
            hasFooter: true
        },
        {
            img: null,
            imgSrc: null,
            imgName: CONSTANT.APP_HOME_IMGS[2],
            title: 'Order-Ahead',
            subtitle: 'order-ahead and skip the line!',
            component: 'LocationsPage',
            id: 2
        },
        {
            img: null,
            imgSrc: null,
            imgName: CONSTANT.APP_HOME_IMGS[3],
            title: 'Menu',
            subtitle: 'See what we have to offer!',
            component: 'CategoriesPage',
            id: 3
        }

    ];
  }

  ionViewDidLoad() {  
    this.getHomePageInfo();
  }


  ionViewDidEnter() {
    if (this.initHasRun) {
      console.log("ionViewDidEnter run...");
      this.getHomePageInfo();
    } else this.initHasRun = true;
  }


  /* TODO need to refactor... handling it with ids is terrible  */
  getHomePageInfo() {
    this.presentLoading(); 

    this.API.stack(ROUTES.getHomePageInfo + `/${this.auth.companyOid}/${this.auth.userOid}`, "GET")
      .subscribe(
        (response) => {
         this.dismissLoading();
         console.log("response.data: ", response.data); 
          this.points = response.data.homePageInfo.points;

          // this is unnecessary. the original idea was to make it dynamic, but this doesn't. don't need to fix now
          this.cards.forEach((x, index) => {
            x.img = response.data.homePageInfo[x.imgName];
            x.subtitle = response.data.homePageInfo[CONSTANT.APP_HOME_SUBTITLES[index]] || x.subtitle;
            x.imgSrc = AppStorage.getDisplayImgSrc(x.img);
          });
          
        }, this.errorHandler(this.ERROR_TYPES.API));
  }

  nav(page) {
    this.navCtrl.push(page.component);
  }
}
