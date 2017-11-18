import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';

// import { AppHeaderBarComponent} from '../../components/app-header-bar/app-header-bar.component';
// import { CompanyLogoComponent } from '../../components/company-logo/company-logo.component';
// import { ControlMessagesComponent } from '../../components/control-messages/control-messages.component';

import { ComponentsModule } from "../../components/components.module";

 
@NgModule({
  declarations: [
    LoginPage,
    // ControlMessagesComponent,
    // CompanyLogoComponent,
    // AppHeaderBarComponent
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
    ComponentsModule
  ],
  exports: [
    LoginPage
  ]
})
export class LoginPageModule {}