import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RewardsDetailsPage } from './rewards-details';
import { AppHeaderBarComponentModule } from '../../components/app-header-bar/app-header-bar.component.module';

 
@NgModule({
  declarations: [
    RewardsDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(RewardsDetailsPage),
    AppHeaderBarComponentModule
  ],
  exports: [
    RewardsDetailsPage
  ]
})
export class RewardsDetailsPageModule {}