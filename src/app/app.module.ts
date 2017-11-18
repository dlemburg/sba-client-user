// ionic plugins
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { Transfer } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import { Geolocation } from '@ionic-native/geolocation';
import { SocialSharing } from '@ionic-native/social-sharing';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Stripe } from '@ionic-native/stripe';
import { AppVersion } from '@ionic-native/app-version';
import { Clipboard } from '@ionic-native/clipboard';

// angular components
import { QRCodeModule } from 'angular2-qrcode';


// MyApp
import { MyApp } from './app.component';

// my providers
import { Authentication } from '../services/authentication';
import { API } from '../services/api';
import { CheckoutStore } from '../pages/checkout/checkout-store.service';
import { SocketIO } from '../services/socket-io';
import { AppStorage } from '../services/app-storage.service'


// components/classes
// note: html inline- drop `component`
import { AppHeaderBarComponent } from '../components/app-header-bar/app-header-bar.component';
import { CompanyLogoComponent } from '../components/company-logo/company-logo.component';
import { ControlMessagesComponent } from '../components/control-messages/control-messages.component';
import { CustomValidatorComponent } from '../components/custom-validator/custom-validator.component';
import { DollarIconComponent } from '../components/dollar-icon/dollar-icon.component';
import { EmptyMessageComponent } from '../components/empty-message/empty-message.component';
import { MyJsonComponent } from '../components/json/json.component';
import { SearchComponent } from '../components/search/search.component';
import { MenuCardComponent } from '../components/menu-card/menu-card.component';


// Base-View-Controller - all components inherit from this class
import { BaseViewController } from '../components/base-view-controller/base-view-controller';

import { ComponentsModule } from "../components/components.module";


@NgModule({
  declarations: [
    MyApp,
    BaseViewController,
        
    // AppHeaderBarComponent,
    // CompanyLogoComponent,
    // ControlMessagesComponent,
    // CustomValidatorComponent,
    // DollarIconComponent,
    // EmptyMessageComponent,
    // MyJsonComponent,
    // SearchComponent,
    // MyJsonComponent,
    // MenuCardComponent
    

  ],
  imports: [   
    BrowserModule,
    HttpModule,
    QRCodeModule,
    IonicModule.forRoot(MyApp),    // for angular and ionic modules... i.e. HTTP
    //TextMaskModule     // for credit cards, phone numbers, etc
   // ComponentsModule

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    // AppHeaderBarComponent,
    // CompanyLogoComponent,
    // ControlMessagesComponent,
    // CustomValidatorComponent,
    // DollarIconComponent,
    // EmptyMessageComponent,
    // MyJsonComponent,
    // SearchComponent,
    // MyJsonComponent,
    // MenuCardComponent

  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler}, 
    //{provide: ErrorHandler, useClass: API}, 
    StatusBar,
    SplashScreen,
    Transfer,
    File,
    Geolocation,
    Clipboard,
    GoogleMaps,
    SocialSharing,
    Stripe,
    AppVersion,
    
    // my providers
    Authentication,
    API,
    CheckoutStore,
    SocketIO,
    AppStorage
  ]   
})
export class AppModule {}
