import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FAQPage } from './faq';

 
@NgModule({
  declarations: [
    FAQPage,
  ],
  imports: [
    IonicPageModule.forChild(FAQPage),
  ],
  exports: [
    FAQPage
  ]
})
export class FAQPageModule {}