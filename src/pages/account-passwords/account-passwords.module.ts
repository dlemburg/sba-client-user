import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountPasswordsPage } from './account-passwords';

import { ControlMessagesComponentModule } from '../../components/control-messages/control-messages.component.module';
import { CompanyLogoComponentModule } from '../../components/company-logo/company-logo.component.module';
import { AppHeaderBarComponentModule } from '../../components/app-header-bar/app-header-bar.component.module';


@NgModule({
  declarations: [
    AccountPasswordsPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountPasswordsPage),
    ControlMessagesComponentModule,
    CompanyLogoComponentModule,
    AppHeaderBarComponentModule
  ],
  exports: [
    AccountPasswordsPage
  ]
})
export class AccountPasswordsPageModule {}