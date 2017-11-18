import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountPage } from './account';

// import { AppHeaderBarComponent} from '../../components/app-header-bar/app-header-bar.component';
// import { CompanyLogoComponent } from '../../components/company-logo/company-logo.component';
// import { ControlMessagesComponent } from '../../components/control-messages/control-messages.component';
import { ComponentsModule } from "../../components/components.module";


@NgModule({
  declarations: [
    AccountPage,
    // AppHeaderBarComponent,
    // CompanyLogoComponent,
    // ControlMessagesComponent
  ],
  imports: [
    IonicPageModule.forChild(AccountPage),
    ComponentsModule

  ],
  exports: [
    AccountPage,
  ]
})
export class AccountPageModule {}