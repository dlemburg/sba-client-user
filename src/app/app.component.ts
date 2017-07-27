import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { Authentication } from '../global/authentication';
import { AppViewData } from '../global/app-data.service';
import { API, ROUTES } from '../global/api';
import { COMPANY_OID } from '../global/companyOid';
import { AuthUserInfo } from '../models/models';
import { AppVersion } from '@ionic-native/app-version';

declare var cordova: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any; 
  pages: Array<{title: string, component: any}>;
  auth: AuthUserInfo;
  pauseSubscription;
  resumeSubscription;

  constructor(
    public platform: Platform, 
    public API: API, 
    private authentication: Authentication, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private appVersion: AppVersion) {

    this.platform.ready().then(() => {
      this.getAppStartupInfo().then((data: IClientUserAppStartupInfoResponse) => {
        this.initializeApp(data);
      });
    });
  }

  getAppStartupInfo() {
    return new Promise((resolve, reject) => {
      this.API.stack(ROUTES.getClientUserAppStartupInfo + `/${COMPANY_OID}`, "GET")
        .subscribe(
          (response) => {
            const res: IClientUserAppStartupInfoResponse = response.data.clientUserAppStartupInfo;
            const defaultImg = res.defaultImg;
            const logoImg = res.logoImg;
            const clientUserVersionNumber = res.currentClientUserVersionNumber;
            const minClientUserVersionNumber = res.minClientUserVersionNumber;
            const mustUpdateClientUserApp = res.mustUpdateClientUserApp;

            console.log("response.data: ", response.data);

            resolve({
              defaultImg, 
              logoImg, 
              clientUserVersionNumber, 
              minClientUserVersionNumber,
              mustUpdateClientUserApp,
            });
          }, (err) => {
            resolve({
              defaultImg: null,
              logoImg: null,
              clientUserVersionNumber: null,
              minClientUserVersionNumber: null,
              mustUpdateClientUserApp: null
            });
            console.log("Problem downloading images on app startup");
          });
    });
  }

  initializeApp(data: IClientUserAppStartupInfoResponse) {
    const { currentClientUserVersionNumber, minClientUserVersionNumber, mustUpdateClientUserApp, logoImg, defaultImg } = data;
    AppViewData.setImgs({
      logoImgSrc: logoImg ? `${ROUTES.downloadImg}?img=${logoImg}` : "img/default.png",
      defaultImgSrc: defaultImg ? `${ROUTES.downloadImg}?img=${defaultImg}` : "img/default.png"
    });
    this.doNativeThingsOnAppStartup(currentClientUserVersionNumber, minClientUserVersionNumber, mustUpdateClientUserApp);
    
    this.pages = [
      { title: 'Home', component: 'HomePage' },      
      { title: 'My Mobile Card', component: 'MyCardPage' },
      { title: 'Locations', component: 'LocationsPage' },
      { title: 'Menu', component: 'CategoriesPage' },
      { title: 'Contact Us', component: 'ContactPage' },
      { title: 'Report Issue', component: 'ReportPage' },
      { title: 'My Account', component: 'AccountPage' },
      // { title: 'New Products', component: ProductsNewPage },
      // { title: 'About Order Ahead', component: AboutOrderAheadPage },  
      // { title: 'FAQs', component: FAQPage },
    ];
    this.authentication.isLoggedIn() ? this.rootPage = 'HomePage' : this.rootPage = 'LoginPage';
  }

  doNativeThingsOnAppStartup(currentClientUserVersionNumber = 0, minClientUserVersionNumber = 0, mustUpdateClientUserVersion = false) {
    this.invokePlatformListeners();
    this.statusBar.styleDefault();
    this.splashScreen.hide();

    // TODO version check popups here
    this.appVersion.getVersionNumber().then((appVersion) => {
      console.log("appVersion: ", appVersion);
      if (appVersion < minClientUserVersionNumber) {
        // FORCE update modal or popup
      }
      else if (currentClientUserVersionNumber < appVersion) {
        // OPTIONAL update modal or popup
      }
    });
  }

  invokePlatformListeners() {
    this.platform.pause.subscribe(() => {
      
    });

    this.platform.resume.subscribe(() => {
      if (!this.authentication.isLoggedIn()) {
        this.nav.setRoot("LoginPage");
      }
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  } 
}

interface IClientUserAppStartupInfoResponse {
  logoImg: string;
  defaultImg: string;
  currentClientUserVersionNumber: number;
  minClientUserVersionNumber: number;
  mustUpdateClientUserApp: boolean;
}




//  console.log("is Android: ", this.platform.is('android'));
    /*
    if (this.platform.is('ios')) {
      AppViewData.setStorageDirectory(cordova.file.documentsDirectory);
    }
    else if(this.platform.is('android')) {
        AppViewData.setStorageDirectory(cordova.file.dataDirectory);
    }
    */