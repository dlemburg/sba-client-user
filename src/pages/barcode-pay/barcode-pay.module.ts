import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BarcodePayPage } from './barcode-pay';

import { QRCodeModule } from 'angular2-qrcode';

// import { AppHeaderBarComponent} from '../../components/app-header-bar/app-header-bar.component';
import { ComponentsModule } from "../../components/components.module";

 
@NgModule({
  declarations: [
    BarcodePayPage,
    // AppHeaderBarComponent
  ],
  imports: [
    IonicPageModule.forChild(BarcodePayPage),
    QRCodeModule,
    ComponentsModule
  ],
  exports: [
    BarcodePayPage
  ]
})
export class BarcodePayPageModule {}