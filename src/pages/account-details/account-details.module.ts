import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountDetailsPage } from './account-details';
import { ControlMessagesComponentModule } from '../../components/control-messages/control-messages.component.module';
 
@NgModule({
  declarations: [
    AccountDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountDetailsPage),
    ControlMessagesComponentModule
  ],
  exports: [
    AccountDetailsPage
  ]
})
export class AccountDetailsPageModule {}