import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { Authentication } from '../services/authentication';
import { AppStorage } from '../services/app-storage.service';
import { API, ROUTES } from '../services/api';
import { COMPANY_OID, CONSTANT } from '../constants/constants';
import { IClientUserAppStartupInfoResponse } from "../interfaces/interfaces";
import { AuthUserInfo } from '../interfaces/interfaces';
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
      this.API.stack(ROUTES.getClientUserAppStartupInfo, "POST", { companyOid: COMPANY_OID})
        .subscribe(
          (response) => {
            const res: IClientUserAppStartupInfoResponse = response.data.clientUserAppStartupInfo;
            const { currentClientUserVersionNumber, minClientUserVersionNumber, mustUpdateClientUserApp, logoImg, defaultImg }  = res;

            resolve({ defaultImg, logoImg, currentClientUserVersionNumber, minClientUserVersionNumber, mustUpdateClientUserApp});
          }, (err) => {
            resolve({ defaultImg: null, logoImg: null, clientUserVersionNumber: null, minClientUserVersionNumber: null, mustUpdateClientUserApp: null});
            console.log("Problem downloading images on app startup");
          });
    });
  }

  initializeApp(data: IClientUserAppStartupInfoResponse) {
    const { currentClientUserVersionNumber, minClientUserVersionNumber, mustUpdateClientUserApp, logoImg, defaultImg } = data;
    AppStorage.setImgs({
      logoImgSrc: logoImg ? `${CONSTANT.AWS_S3_URL}/imgs/${logoImg}` : "img/default.png",
      defaultImgSrc: defaultImg ? `${CONSTANT.AWS_S3_URL}/imgs/${defaultImg}` : "img/default.png"
    });

    this.initNativePlugins(currentClientUserVersionNumber, minClientUserVersionNumber, mustUpdateClientUserApp);
    
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
    
    this.rootPage = this.authentication.isLoggedIn() ? 'HomePage' : 'LoginPage';
  }

  initNativePlugins = (currentClientUserVersionNumber = 0, minClientUserVersionNumber = 0, mustUpdateClientUserVersion = false) => {
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
    this.nav.setRoot(page.component);
  } 
}