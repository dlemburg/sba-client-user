import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocationsMapPage } from './locations-map';
import { AppHeaderBarComponentModule } from '../../components/app-header-bar/app-header-bar.component.module';


@NgModule({
  declarations: [
    LocationsMapPage,
  ],
  imports: [
    IonicPageModule.forChild(LocationsMapPage),
    AppHeaderBarComponentModule
  ],
  exports: [
    LocationsMapPage
  ]
})
export class LocationsMapPageModule {}
