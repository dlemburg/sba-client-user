import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BarcodePayPage } from './barcode-pay';
import { QRCodeModule } from 'angular2-qrcode';
 
@NgModule({
  declarations: [
    BarcodePayPage,
  ],
  imports: [
    IonicPageModule.forChild(BarcodePayPage),
    QRCodeModule
  ],
  exports: [
    BarcodePayPage
  ]
})
export class BarcodePayPageModule {}