import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactPage } from './contact';

import { ControlMessagesComponentModule } from '../../components/control-messages/control-messages.component.module';
import { CompanyLogoComponentModule } from '../../components/company-logo/company-logo.component.module';
import { AppHeaderBarComponentModule } from '../../components/app-header-bar/app-header-bar.component.module';


@NgModule({
  declarations: [
    ContactPage,
  ],
  imports: [
    IonicPageModule.forChild(ContactPage),
    ControlMessagesComponentModule,
    CompanyLogoComponentModule,
    AppHeaderBarComponentModule
  ],
  exports: [
    ContactPage
  ]
})
export class ContactPageModule {}