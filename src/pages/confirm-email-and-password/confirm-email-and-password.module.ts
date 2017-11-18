import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfirmEmailAndPasswordPage } from './confirm-email-and-password';

// import { AppHeaderBarComponent} from '../../components/app-header-bar/app-header-bar.component';
import { ComponentsModule } from "../../components/components.module";


@NgModule({
  declarations: [
    ConfirmEmailAndPasswordPage,
    // AppHeaderBarComponent
  ],
  imports: [
    IonicPageModule.forChild(ConfirmEmailAndPasswordPage),
    ComponentsModule
  ],
  exports: [
    ConfirmEmailAndPasswordPage
  ]
})
export class ConfirmEmailAndPasswordPageModule {}
