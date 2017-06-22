import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { RegisterPage } from '../pages/register/register';
import { MyCardPage } from '../pages/my-card/my-card';
import { MyCardMorePage } from '../pages/my-card-more/my-card-more';
import { AddCardPage } from '../pages/add-card/add-card';
import { AddCardValuePage } from '../pages/add-card-value/add-card-value';
import { TransactionHistoryPage } from '../pages/transaction-history/transaction-history';
import { LocationsPage } from '../pages/locations/locations';
import { ContactPage } from '../pages/contact/contact';
import { ReportPage } from '../pages/report/report';
import { AccountPage } from '../pages/account/account';
import { FAQPage } from '../pages/faq/faq';
import { ProductsListPage } from '../pages/products-list/products-list';
import { ProductsDetailsPage } from '../pages/products-details/products-details';
import { RewardsPage } from '../pages/rewards/rewards';
import { RewardsDetailsPage } from '../pages/rewards-details/rewards-details';
import { CategoriesPage } from '../pages/categories/categories';
import { AccountDetailsPage } from '../pages/account-details/account-details';
import { AccountPasswordsPage } from '../pages/account-passwords/account-passwords';
import { BarcodePayPage } from '../pages/barcode-pay/barcode-pay';
import { BarcodeRewardPage } from '../pages/barcode-reward/barcode-reward';
import { EditPurchaseItemPage } from '../pages/edit-purchase-item/edit-purchase-item';
import { CheckoutPage } from '../pages/checkout/checkout';
import { EditPaymentDetailsPage } from '../pages/edit-payment-details/edit-payment-details';
import { HoursPage } from '../pages/hours/hours';
import { AddedToCartPage } from '../pages/added-to-cart/added-to-cart';
import { OrderCompletePage } from '../pages/order-complete/order-complete';

// services that do not maintain state
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
import { ControlMessagesComponent } from '../components/control-messages/control-messages.component';
import { SearchComponent } from '../components/search/search.component';
import { JsonComponent } from '../components/json/json.component';
import { DollarIconComponent } from '../components/dollar-icon/dollar-icon.component';
import { CustomValidatorComponent } from '../components/custom-validator/custom-validator.component';

// Base-View-Controller - all components inherit from this class
import { BaseViewController } from '../pages/base-view-controller/base-view-controller';

// plugins
//import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    ForgotPasswordPage,
    RegisterPage,
    HomePage,
    MyCardPage,
    MyCardMorePage,
    AddCardPage,
    AddCardValuePage,
    TransactionHistoryPage,
    LocationsPage,
    ContactPage,
    AccountPage,
    AccountDetailsPage,
    AccountPasswordsPage,
    FAQPage,
    ReportPage,
    ProductsListPage,
    ProductsDetailsPage,
    RewardsPage,
    RewardsDetailsPage,
    CategoriesPage,
    BarcodePayPage,
    BarcodeRewardPage,
    EditPurchaseItemPage,
    CheckoutPage,
    EditPaymentDetailsPage,
    HoursPage,
    AddedToCartPage,
    OrderCompletePage,

    // components
    ControlMessagesComponent,
    SearchComponent,
    JsonComponent,
    DollarIconComponent,
    CustomValidatorComponent,

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
    MyApp,
    LoginPage,
    ForgotPasswordPage,
    RegisterPage,
    HomePage,
    MyCardPage,
    MyCardMorePage,
    AddCardPage,
    AddCardValuePage,
    TransactionHistoryPage,
    LocationsPage,
    ContactPage,
    AccountPage,
    AccountDetailsPage,
    AccountPasswordsPage,
    FAQPage,
    ReportPage,
    ProductsListPage,
    ProductsDetailsPage,
    RewardsPage,
    RewardsDetailsPage,
    CategoriesPage,
    BarcodePayPage,
    BarcodeRewardPage,
    EditPurchaseItemPage,
    CheckoutPage,
    EditPaymentDetailsPage,
    HoursPage,
    AddedToCartPage,
    OrderCompletePage,

    // components
    ControlMessagesComponent,
    SearchComponent,
    JsonComponent,
    DollarIconComponent,
    CustomValidatorComponent,

    BaseViewController
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},  // services
    StatusBar,
    SplashScreen,
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
