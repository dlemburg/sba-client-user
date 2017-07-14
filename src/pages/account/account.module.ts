import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountPage } from './account';
import { ControlMessagesComponentModule } from '../../components/control-messages/control-messages.component.module';
import { CompanyLogoComponentModule } from '../../components/company-logo/company-logo.component.module';
import { AppHeaderBarComponentModule } from '../../components/app-header-bar/app-header-bar.component.module';

@NgModule({
  declarations: [
    AccountPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountPage),
    ControlMessagesComponentModule,
    CompanyLogoComponentModule,
    AppHeaderBarComponentModule
  ],
  exports: [
    AccountPage
  ]
})
export class AccountPageModule {}