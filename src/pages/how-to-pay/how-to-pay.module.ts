import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HowToPayPage } from './how-to-pay';

@NgModule({
  declarations: [
    HowToPayPage,
  ],
  imports: [
    IonicPageModule.forChild(HowToPayPage),
  ],
  exports: [
    HowToPayPage
  ]
})
export class HowToPayPageModule {}
