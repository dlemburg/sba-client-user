import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditPurchaseItemPage } from './edit-purchase-item';

import { ControlMessagesComponentModule } from '../../components/control-messages/control-messages.component.module';
import { AppHeaderBarComponentModule } from '../../components/app-header-bar/app-header-bar.component.module';

 
@NgModule({
  declarations: [
    EditPurchaseItemPage,
  ],
  imports: [
    IonicPageModule.forChild(EditPurchaseItemPage),
    ControlMessagesComponentModule,
    AppHeaderBarComponentModule
  ],
  exports: [
    EditPurchaseItemPage
  ]
})
export class EditPurchaseItemPageModule {}