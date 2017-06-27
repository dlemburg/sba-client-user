import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocationsMapPage } from './locations-map';

@NgModule({
  declarations: [
    LocationsMapPage,
  ],
  imports: [
    IonicPageModule.forChild(LocationsMapPage),
  ],
  exports: [
    LocationsMapPage
  ]
})
export class LocationsMapPageModule {}
