import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';

import { ControlMessagesComponentModule } from '../../components/control-messages/control-messages.component.module';
import { CompanyLogoComponentModule } from '../../components/company-logo/company-logo.component.module';
import { AppHeaderBarComponentModule } from '../../components/app-header-bar/app-header-bar.component.module';

 
@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
    ControlMessagesComponentModule,
    CompanyLogoComponentModule,
    AppHeaderBarComponentModule
  ],
  exports: [
    LoginPage
  ]
})
export class LoginPageModule {}