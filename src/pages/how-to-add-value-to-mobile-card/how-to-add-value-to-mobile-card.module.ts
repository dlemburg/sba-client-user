import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HowToAddValueToMobileCardPage } from './how-to-add-value-to-mobile-card';

@NgModule({
  declarations: [
    HowToAddValueToMobileCardPage,
  ],
  imports: [
    IonicPageModule.forChild(HowToAddValueToMobileCardPage),
  ],
  exports: [
    HowToAddValueToMobileCardPage
  ]
})
export class HowToAddValueToMobileCardPageModule {}
