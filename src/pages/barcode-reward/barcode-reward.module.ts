import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BarcodeRewardPage } from './barcode-reward';

import { AppHeaderBarComponentModule } from '../../components/app-header-bar/app-header-bar.component.module';

 
@NgModule({
  declarations: [
    BarcodeRewardPage,
  ],
  imports: [
    IonicPageModule.forChild(BarcodeRewardPage),
    AppHeaderBarComponentModule
  ],
  exports: [
    BarcodeRewardPage
  ]
})
export class BarcodeRewardPageModule {}