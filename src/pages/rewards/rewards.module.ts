import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RewardsPage } from './rewards';

// import { AppHeaderBarComponent} from '../../components/app-header-bar/app-header-bar.component';
// import { CompanyLogoComponent } from '../../components/company-logo/company-logo.component';
// import { EmptyMessagesComponent } from '../../components/empty-messages/empty-messages.component';
import { ComponentsModule } from "../../components/components.module";

 
@NgModule({
  declarations: [
    RewardsPage,
    // AppHeaderBarComponent,
    // CompanyLogoComponent,
    // EmptyMessagesComponent
  ],
  imports: [
    IonicPageModule.forChild(RewardsPage),
    ComponentsModule
  ],
  exports: [
    RewardsPage
  ]
})
export class RewardsPageModule {}