import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyCardPage } from './my-card';
import { ControlMessagesComponentModule } from '../../components/control-messages/control-messages.component.module';
 
@NgModule({
  declarations: [
    MyCardPage,
  ],
  imports: [
    IonicPageModule.forChild(MyCardPage),
    ControlMessagesComponentModule
  ],
  exports: [
    MyCardPage
  ]
})
export class MyCardPageModule {}