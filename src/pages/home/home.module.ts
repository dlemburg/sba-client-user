import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';

// import { AppHeaderBarComponent} from '../../components/app-header-bar/app-header-bar.component';

import { ComponentsModule } from "../../components/components.module";

 
@NgModule({
  declarations: [
    HomePage,
    //AppHeaderBarComponent
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    ComponentsModule
  ],
  exports: [
    HomePage,
  ]
})
export class HomePageModule {}