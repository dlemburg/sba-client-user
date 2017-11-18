import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ForgotPasswordPage } from './forgot-password';

// import { AppHeaderBarComponent} from '../../components/app-header-bar/app-header-bar.component';
// import { ControlMessagesComponent } from '../../components/control-messages/control-messages.component';
import { ComponentsModule } from "../../components/components.module";

 
@NgModule({
  declarations: [
    ForgotPasswordPage,
    // ControlMessagesComponent,
    // AppHeaderBarComponent
  ],
  imports: [
    IonicPageModule.forChild(ForgotPasswordPage),
    ComponentsModule
  ],
  exports: [
    ForgotPasswordPage
  ]
})
export class ForgotPasswordPageModule {}