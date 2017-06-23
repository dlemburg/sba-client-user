import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";

import { Transfer } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';


import { Authentication } from '../global/authentication.service';
import { API } from '../global/api.service';
import { Validation } from '../global/validation';
import { AsyncValidation } from '../global/async-validation.service';
import { UtilityService } from '../global/utility.service';
import { ImgService } from '../global/img.service';

// thought about ngRX but a bit of overkill- only need it for a few things- service does the trick
// services: maintain state
import { AppDataService } from '../global/app-data.service';
import { StoreService } from '../global/store.service';
import { SocketService } from '../global/socket.service';

// components
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
    BaseViewController
  ],
  imports: [   
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),    // for angular and ionic modules... i.e. HTTP
    //TextMaskModule     // for credit cards, phone numbers, etc
  ],
  bootstrap: [IonicApp],
  entryComponents: [    // are these for the root?
    MyApp
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},  // services
    StatusBar,
    SplashScreen,
    Transfer,
    File,
    Authentication,
    API,
    AppDataService,
    StoreService,
    UtilityService,
    ImgService,
    AsyncValidation,
    SocketService
  ]   
})
export class AppModule {}
