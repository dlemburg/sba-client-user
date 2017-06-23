import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BarcodeRewardPage } from './barcode-reward';
 
@NgModule({
  declarations: [
    BarcodeRewardPage,
  ],
  imports: [
    IonicPageModule.forChild(BarcodeRewardPage),
  ],
  exports: [
    BarcodeRewardPage
  ]
})
export class BarcodeRewardPageModule {}