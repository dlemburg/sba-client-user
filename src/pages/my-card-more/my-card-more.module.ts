import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyCardMorePage } from './my-card-more';

// import { AppHeaderBarComponent} from '../../components/app-header-bar/app-header-bar.component';
// import { ControlMessagesComponent } from '../../components/control-messages/control-messages.component';
import { ComponentsModule } from "../../components/components.module";


 
@NgModule({
  declarations: [
    MyCardMorePage,
    // ControlMessagesComponent,
    // AppHeaderBarComponent
  ],
  imports: [
    IonicPageModule.forChild(MyCardMorePage),
    ComponentsModule
  ],
  exports: [
    MyCardMorePage
  ]
})
export class MyCardMorePageModule {}