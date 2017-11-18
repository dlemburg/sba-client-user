import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddCreditCardPage } from './add-credit-card';

// import { AppHeaderBarComponent} from '../../components/app-header-bar/app-header-bar.component';
// import { ControlMessagesComponent } from '../../components/control-messages/control-messages.component';
import { ComponentsModule } from "../../components/components.module";


@NgModule({
  declarations: [
    AddCreditCardPage,
    // AppHeaderBarComponent,
    // ControlMessagesComponent
  ],
  imports: [
    IonicPageModule.forChild(AddCreditCardPage),
    ComponentsModule
  ],
  exports: [
    AddCreditCardPage
  ]
})
export class AddCreditCardPageModule {}
