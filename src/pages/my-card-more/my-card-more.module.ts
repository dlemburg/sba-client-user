import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyCardMorePage } from './my-card-more';
import { ControlMessagesComponentModule } from '../../components/control-messages/control-messages.component.module';
 
@NgModule({
  declarations: [
    MyCardMorePage,
  ],
  imports: [
    IonicPageModule.forChild(MyCardMorePage),
    ControlMessagesComponentModule
  ],
  exports: [
    MyCardMorePage
  ]
})
export class MyCardMorePageModule {}