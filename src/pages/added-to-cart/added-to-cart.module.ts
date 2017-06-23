import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddedToCartPage } from './added-to-cart';
import { ControlMessagesComponentModule } from '../../components/control-messages/control-messages.component.module';
 
@NgModule({
  declarations: [
    AddedToCartPage,
  ],
  imports: [
    IonicPageModule.forChild(AddedToCartPage),
    ControlMessagesComponentModule
  ],
  exports: [
    AddedToCartPage
  ]
})
export class AddedToCartPageModule {}