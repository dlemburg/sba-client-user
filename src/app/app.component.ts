import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { Authentication } from '../global/authentication.service';
import { AppDataService } from '../global/app-data.service';

declare var cordova: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;   // sets the root page to be the page we want to start on
  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, private authentication: Authentication, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.authentication.isLoggedIn() ? this.rootPage = 'HomePage' : this.rootPage = 'LoginPage';

    this.pages = [
      { title: 'Home', component: 'HomePage' },      
      { title: 'My Card', component: 'MyCardPage' },
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

  initializeApp() {
    //this.presentLoading();  loader

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      console.log("is Android: ", this.platform.is('android'));
       //cordova.file.cacheDirectory ??
      if (this.platform.is('ios')) {
        AppDataService.setStorageDirectory(cordova.file.documentsDirectory);
      }
      else if(this.platform.is('android')) {
         AppDataService.setStorageDirectory(cordova.file.dataDirectory);
      }
    });

   // this.loader.dismiss();
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  /*
  presentLoading() {
 
    this.loader = this.loadingCtrl.create({
      content: "Authenticating..."
    });
    this.loader.present();
 
  }
  */
 
}




/* lifecycle events

  // runs on every page load
  ionViewDidEnter() {

  }

  // auth guard enter
  ionViewCanEnter() {
     if('valid function from Auth here'){
      return true;
    } else {
      return false;
    }
  }

  // auth guard leave
  ionViewCanLeave() {

  }

  //tear down page
  ionViewDidLeave() {

  }





*/