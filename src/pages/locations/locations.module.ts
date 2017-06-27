import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocationsPage } from './locations';
import { EmptyMessageComponentModule } from '../../components/empty-message/empty-message.component.module';

 
@NgModule({
  declarations: [
    LocationsPage,
  ],
  imports: [
    IonicPageModule.forChild(LocationsPage),
    EmptyMessageComponentModule
  ],
  exports: [
    LocationsPage
  ]
})
export class LocationsPageModule {}