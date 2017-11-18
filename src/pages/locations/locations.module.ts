import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocationsPage } from './locations';

// import { AppHeaderBarComponent} from '../../components/app-header-bar/app-header-bar.component';
// import { EmptyMessagesComponent } from '../../components/empty-messages/empty-messages.component';

import { ComponentsModule } from "../../components/components.module";

 
@NgModule({
  declarations: [
    LocationsPage,
    // AppHeaderBarComponent,
    // EmptyMessagesComponent
  ],
  imports: [
    IonicPageModule.forChild(LocationsPage),
    ComponentsModule
  ],
  exports: [
    LocationsPage
  ]
})
export class LocationsPageModule {}