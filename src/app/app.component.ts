import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { Authentication } from '../global/authentication';
import { AppViewData } from '../global/app-data.service';
import { API, ROUTES } from '../global/api';
import { COMPANY_OID } from '../global/companyOid';

declare var cordova: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any; 
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform, 
    public API: API, 
    private authentication: Authentication, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen) {

      this.platform.ready().then(() => {
        this.initializeApp();
      });
  }

  initializeApp() {
    this.API.stack(ROUTES.getImgsOnAppStartup + `/${COMPANY_OID}`, "GET")
      .subscribe(
        (response) => {
          const defaultImg = response.data.imgs.defaultImg;
          AppViewData.setImgs({
            logoImgSrc: `${ROUTES.downloadImg}?img=${response.data.imgs.logoImg}`,
            defaultImgSrc: defaultImg ? `${ROUTES.downloadImg}?img=${defaultImg}` : "img/default.png"
          });
          this.finishInitialization();
        }, (err) => {
          this.finishInitialization();
          console.log("Problem downloading images on app startup");
        });

  }

  finishInitialization() {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.authentication.isLoggedIn() ? this.rootPage = 'HomePage' : this.rootPage = 'LoginPage';
      
      this.pages = [
        { title: 'Home', component: 'HomePage' },      
        { title: 'My Mobile Card', component: 'MyCardPage' },
        { title: 'Locations', component: 'LocationsPage' },
        { title: 'Menu', component: 'CategoriesPage' },
      // { title: 'New Products', component: ProductsNewPage },
      // { title: 'About Order Ahead', component: AboutOrderAheadPage },
        { title: 'Contact Us', component: 'ContactPage' },
        { title: 'Report Issue', component: 'ReportPage' },
        { title: 'My Account', component: 'AccountPage' },
      // { title: 'FAQs', component: FAQPage },
      // { title: 'Login', component: LoginPage},      // this won't be here
        // { title: 'Register', component: RegisterPage}  // this won't be here
      ];
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  } 
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