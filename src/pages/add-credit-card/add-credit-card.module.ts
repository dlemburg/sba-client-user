import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddCreditCardPage } from './add-credit-card';

import { ControlMessagesComponentModule } from '../../components/control-messages/control-messages.component.module';
import { AppHeaderBarComponentModule } from '../../components/app-header-bar/app-header-bar.component.module';


@NgModule({
  declarations: [
    AddCreditCardPage,
  ],
  imports: [
    IonicPageModule.forChild(AddCreditCardPage),
    ControlMessagesComponentModule,
    AppHeaderBarComponentModule
  ],
  exports: [
    AddCreditCardPage
  ]
})
export class AddCreditCardPageModule {}
