import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BarcodeRewardPage } from './barcode-reward';
import { QRCodeModule } from 'angular2-qrcode';

// import { AppHeaderBarComponent} from '../../components/app-header-bar/app-header-bar.component';
import { ComponentsModule } from "../../components/components.module";

 
@NgModule({
  declarations: [
    BarcodeRewardPage,
    // AppHeaderBarComponent
  ],
  imports: [
    IonicPageModule.forChild(BarcodeRewardPage),
    ComponentsModule,
    QRCodeModule,    
  ],
  exports: [
    BarcodeRewardPage
  ]
})
export class BarcodeRewardPageModule {}