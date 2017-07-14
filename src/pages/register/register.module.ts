import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterPage } from './register';

import { ControlMessagesComponentModule } from '../../components/control-messages/control-messages.component.module';
import { CompanyLogoComponentModule } from '../../components/company-logo/company-logo.component.module';
import { AppHeaderBarComponentModule } from '../../components/app-header-bar/app-header-bar.component.module';


@NgModule({
  declarations: [
    RegisterPage,
  ],
  imports: [
    IonicPageModule.forChild(RegisterPage),
    ControlMessagesComponentModule,
    CompanyLogoComponentModule,
    AppHeaderBarComponentModule
  ],
  exports: [
    RegisterPage
  ]
})
export class RegisterPageModule {}