import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CheckoutPage } from './checkout';

// import { ControlMessagesComponent } from '../../components/control-messages/control-messages.component';
// import { AppHeaderBarComponent} from '../../components/app-header-bar/app-header-bar.component';
import { ComponentsModule } from "../../components/components.module";

 
@NgModule({
  declarations: [
    CheckoutPage,
    // ControlMessagesComponent,
    // AppHeaderBarComponent
  ],
  imports: [
    IonicPageModule.forChild(CheckoutPage),
    ComponentsModule

  ],
  exports: [
    CheckoutPage
  ]
})
export class CheckoutPageModule {}