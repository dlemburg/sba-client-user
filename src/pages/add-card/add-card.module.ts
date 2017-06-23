import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddCardPage } from './add-card';
import { ControlMessagesComponentModule } from '../../components/control-messages/control-messages.component.module';
 
@NgModule({
  declarations: [
    AddCardPage,
  ],
  imports: [
    IonicPageModule.forChild(AddCardPage),
    ControlMessagesComponentModule
  ],
  exports: [
    AddCardPage
  ]
})
export class AddCardPageModule {}