import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ApplyRewardPage } from './apply-reward';

@NgModule({
  declarations: [
    ApplyRewardPage,
  ],
  imports: [
    IonicPageModule.forChild(ApplyRewardPage),
  ],
  exports: [
    ApplyRewardPage
  ]
})
export class ApplyRewardPageModule {}
