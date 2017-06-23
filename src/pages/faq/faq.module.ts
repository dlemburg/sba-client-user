import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FAQPage } from './faq';
import { ControlMessagesComponentModule } from '../../components/control-messages/control-messages.component.module';
 
@NgModule({
  declarations: [
    FAQPage,
  ],
  imports: [
    IonicPageModule.forChild(FAQPage),
    ControlMessagesComponentModule
  ],
  exports: [
    FAQPage
  ]
})
export class FAQPageModule {}