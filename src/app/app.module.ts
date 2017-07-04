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
import { QRCodeModule } from 'angular2-qrcode';


// MyApp
import { MyApp } from './app.component';

// my providers
import { Authentication } from '../global/authentication';
import { API } from '../global/api';
import { CheckoutStore } from '../global/checkout-store.service';
import { SocketIO } from '../global/socket-io';

// components w/ no module yet
import { SearchComponent } from '../components/search/search.component';
import { MyJsonComponent } from '../components/json/json.component';

// Base-View-Controller - all components inherit from this class
import { BaseViewController } from '../pages/base-view-controller/base-view-controller';

// plugins
//import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  declarations: [
    MyApp,
    // components
    SearchComponent,
    MyJsonComponent,
    BaseViewController,
  ],
  imports: [   
    BrowserModule,
    HttpModule,
    QRCodeModule,
    IonicModule.forRoot(MyApp),    // for angular and ionic modules... i.e. HTTP
    //TextMaskModule     // for credit cards, phone numbers, etc

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, 
    StatusBar,
    SplashScreen,
    Transfer,
    File,
    Geolocation,
    GoogleMaps,
    SocialSharing,
    Stripe,
    // my providers
    Authentication,
    API,
    CheckoutStore,
    SocketIO
  ]   
})
export class AppModule {}
