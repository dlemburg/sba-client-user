import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfirmEmailAndPasswordPage } from './confirm-email-and-password';

import { AppHeaderBarComponentModule } from '../../components/app-header-bar/app-header-bar.component.module';


@NgModule({
  declarations: [
    ConfirmEmailAndPasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(ConfirmEmailAndPasswordPage),
    AppHeaderBarComponentModule
  ],
  exports: [
    ConfirmEmailAndPasswordPage
  ]
})
export class ConfirmEmailAndPasswordPageModule {}
