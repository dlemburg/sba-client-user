import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddCardValuePage } from './add-card-value';

// import { AppHeaderBarComponent} from '../../components/app-header-bar/app-header-bar.component';
// import { ControlMessagesComponent } from '../../components/control-messages/control-messages.component';
import { ComponentsModule } from "../../components/components.module";

 
@NgModule({
  declarations: [
    AddCardValuePage,
    // AppHeaderBarComponent,
    // ControlMessagesComponent
  ],
  imports: [
    IonicPageModule.forChild(AddCardValuePage),
    ComponentsModule

  ],
  exports: [
    AddCardValuePage
  ]
})
export class AddCardValuePageModule {}