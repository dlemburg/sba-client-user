import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductsDetailsPage } from './products-details';
import { ControlMessagesComponentModule } from '../../components/control-messages/control-messages.component.module';
 
@NgModule({
  declarations: [
    ProductsDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductsDetailsPage),
    ControlMessagesComponentModule
  ],
  exports: [
    ProductsDetailsPage
  ]
})
export class ProductsDetailsPageModule {}