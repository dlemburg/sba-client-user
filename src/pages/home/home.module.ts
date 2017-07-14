import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { AppHeaderBarComponentModule } from '../../components/app-header-bar/app-header-bar.component.module';

 
@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    AppHeaderBarComponentModule
  ],
  exports: [
    HomePage
  ]
})
export class HomePageModule {}