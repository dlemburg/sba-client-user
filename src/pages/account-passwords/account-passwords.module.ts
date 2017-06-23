import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountPasswordsPage } from './account-passwords';
import { ControlMessagesComponentModule } from '../../components/control-messages/control-messages.component.module';
 
@NgModule({
  declarations: [
    AccountPasswordsPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountPasswordsPage),
    ControlMessagesComponentModule
  ],
  exports: [
    AccountPasswordsPage
  ]
})
export class AccountPasswordsPageModule {}