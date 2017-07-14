import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RewardsPage } from './rewards';

import { CompanyLogoComponentModule } from '../../components/company-logo/company-logo.component.module';
import { EmptyMessageComponentModule } from '../../components/empty-message/empty-message.component.module';
import { AppHeaderBarComponentModule } from '../../components/app-header-bar/app-header-bar.component.module';

 
@NgModule({
  declarations: [
    RewardsPage,
  ],
  imports: [
    IonicPageModule.forChild(RewardsPage),
    CompanyLogoComponentModule,
    EmptyMessageComponentModule,
    AppHeaderBarComponentModule
  ],
  exports: [
    RewardsPage
  ]
})
export class RewardsPageModule {}