import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BarcodePayPage } from './barcode-pay';
import { QRCodeModule } from 'angular2-qrcode';

import { AppHeaderBarComponentModule } from '../../components/app-header-bar/app-header-bar.component.module';

 
@NgModule({
  declarations: [
    BarcodePayPage,
  ],
  imports: [
    IonicPageModule.forChild(BarcodePayPage),
    QRCodeModule,
    AppHeaderBarComponentModule
  ],
  exports: [
    BarcodePayPage
  ]
})
export class BarcodePayPageModule {}