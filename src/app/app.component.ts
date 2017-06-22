import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { MyCardPage } from '../pages/my-card/my-card';
import { AddCardPage } from '../pages/add-card/add-card';
import { LocationsPage } from '../pages/locations/locations';
//import { ProductsNewPage } from '../pages/products-new/products-new';
import { ContactPage } from '../pages/contact/contact';
import { ReportPage } from '../pages/report/report';
import { AccountPage } from '../pages/account/account';
//import { AboutOrderAheadPage } from '../pages/about-order-ahead/about-order-ahead';
import { CategoriesPage } from '../pages/categories/categories';
import { AddCardValuePage } from '../pages/add-card-value/add-card-value';

import { RewardsPage } from '../pages/rewards/rewards';
import { RewardsBarcodePage } from '../pages/rewards-barcode/rewards-barcode';
import { ProductsDetailsPage } from '../pages/products-details/products-details';
import { ProductsListPage }  from '../pages/products-list/products-list';
import { AccountDetailsPage } from '../pages/account-details/account-details';
import { AccountPasswordsPage } from '../pages/account-passwords/account-passwords';
import { EditPaymentDetailsPage } from '../pages/edit-payment-details/edit-payment-details';
import { EditPurchaseItemPage } from '../pages/edit-purchase-item/edit-purchase-item';

import { AddedToCartPage } from '../pages/added-to-cart/added-to-cart';

import { Authentication } from '../global/authentication.service';

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
    this.authentication.isLoggedIn() ? this.rootPage = HomePage : this.rootPage = LoginPage;

    this.pages = [
      { title: 'Home', component: HomePage },      
      { title: 'My Card', component: MyCardPage },
      { title: 'Locations', component: LocationsPage },
      { title: 'Menu', component: CategoriesPage },
     // { title: 'New Products', component: ProductsNewPage },
     // { title: 'About Order Ahead', component: AboutOrderAheadPage },
      { title: 'Contact Us', component: ContactPage },
      { title: 'Report Issue', component: ReportPage },
      { title: 'My Account', component: AccountPage },
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