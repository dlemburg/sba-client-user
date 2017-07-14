import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductsDetailsPage } from './products-details';

import { ControlMessagesComponentModule } from '../../components/control-messages/control-messages.component.module';
import { AppHeaderBarComponentModule } from '../../components/app-header-bar/app-header-bar.component.module';

 
@NgModule({
  declarations: [
    ProductsDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductsDetailsPage),
    ControlMessagesComponentModule,
    AppHeaderBarComponentModule
  ],
  exports: [
    ProductsDetailsPage
  ]
})
export class ProductsDetailsPageModule {}