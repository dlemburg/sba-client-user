import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditPaymentDetailsPage } from './edit-payment-details';
import { ControlMessagesComponentModule } from '../../components/control-messages/control-messages.component.module';
 
@NgModule({
  declarations: [
    EditPaymentDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(EditPaymentDetailsPage),
    ControlMessagesComponentModule
  ],
  exports: [
    EditPaymentDetailsPage
  ]
})
export class EditPaymentDetailsPageModule {}