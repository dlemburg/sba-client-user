import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocationsPage } from './locations';
import { EmptyMessageComponentModule } from '../../components/empty-message/empty-message.component.module';
import { AppHeaderBarComponentModule } from '../../components/app-header-bar/app-header-bar.component.module';

 
@NgModule({
  declarations: [
    LocationsPage,
  ],
  imports: [
    IonicPageModule.forChild(LocationsPage),
    EmptyMessageComponentModule,
    AppHeaderBarComponentModule
  ],
  exports: [
    LocationsPage
  ]
})
export class LocationsPageModule {}