import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyCardPage } from './my-card';

import { ControlMessagesComponentModule } from '../../components/control-messages/control-messages.component.module';
import { AppHeaderBarComponentModule } from '../../components/app-header-bar/app-header-bar.component.module';


@NgModule({
  declarations: [
    MyCardPage,
  ],
  imports: [
    IonicPageModule.forChild(MyCardPage),
    ControlMessagesComponentModule,
    AppHeaderBarComponentModule
  ],
  exports: [
    MyCardPage
  ]
})
export class MyCardPageModule {}