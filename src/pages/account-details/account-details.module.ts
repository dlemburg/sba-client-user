import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountDetailsPage } from './account-details';

// import { AppHeaderBarComponent} from '../../components/app-header-bar/app-header-bar.component';
// import { CompanyLogoComponent } from '../../components/company-logo/company-logo.component';
// import { ControlMessagesComponent } from '../../components/control-messages/control-messages.component';
import { ComponentsModule } from "../../components/components.module";


@NgModule({
  declarations: [
    AccountDetailsPage,
    // AppHeaderBarComponent,
    // CompanyLogoComponent,
    // ControlMessagesComponent
  ],
  imports: [
    IonicPageModule.forChild(AccountDetailsPage),
    ComponentsModule
  ],
  exports: [
    AccountDetailsPage
  ]
})
export class AccountDetailsPageModule {}