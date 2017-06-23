import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BarcodePayPage } from './barcode-pay';
 
@NgModule({
  declarations: [
    BarcodePayPage,
  ],
  imports: [
    IonicPageModule.forChild(BarcodePayPage),
  ],
  exports: [
    BarcodePayPage
  ]
})
export class BarcodePayPageModule {}