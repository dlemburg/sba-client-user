import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddedToCartPage } from './added-to-cart';

// import { ControlMessagesComponent } from '../../components/control-messages/control-messages.component';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [
    AddedToCartPage,
    // ControlMessagesComponent
  ],
  imports: [
    IonicPageModule.forChild(AddedToCartPage),
    ComponentsModule
  ],
  exports: [
    AddedToCartPage
  ]
})
export class AddedToCartPageModule {}