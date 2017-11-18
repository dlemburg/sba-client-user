import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyCardPage } from './my-card';

import { ComponentsModule } from "../../components/components.module";


@NgModule({
  declarations: [
    MyCardPage,
  ],
  imports: [
    IonicPageModule.forChild(MyCardPage),
    ComponentsModule
  ],
  exports: [
    MyCardPage
  ]
})
export class MyCardPageModule {}