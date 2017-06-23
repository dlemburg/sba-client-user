import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddCardValuePage } from './add-card-value';
import { ControlMessagesComponentModule } from '../../components/control-messages/control-messages.component.module';
 
@NgModule({
  declarations: [
    AddCardValuePage,
  ],
  imports: [
    IonicPageModule.forChild(AddCardValuePage),
    ControlMessagesComponentModule
  ],
  exports: [
    AddCardValuePage
  ]
})
export class AddCardValuePageModule {}