import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountPage } from './account';
import { ControlMessagesComponentModule } from '../../components/control-messages/control-messages.component.module';
 
@NgModule({
  declarations: [
    AccountPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountPage),
    ControlMessagesComponentModule
  ],
  exports: [
    AccountPage
  ]
})
export class AccountPageModule {}