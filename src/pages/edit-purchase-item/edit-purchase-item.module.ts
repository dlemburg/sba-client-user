import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditPurchaseItemPage } from './edit-purchase-item';
import { ControlMessagesComponentModule } from '../../components/control-messages/control-messages.component.module';
 
@NgModule({
  declarations: [
    EditPurchaseItemPage,
  ],
  imports: [
    IonicPageModule.forChild(EditPurchaseItemPage),
    ControlMessagesComponentModule
  ],
  exports: [
    EditPurchaseItemPage
  ]
})
export class EditPurchaseItemPageModule {}