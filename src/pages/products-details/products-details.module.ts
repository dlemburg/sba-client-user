import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductsDetailsPage } from './products-details';

// import { AppHeaderBarComponent} from '../../components/app-header-bar/app-header-bar.component';
// import { ControlMessagesComponent } from '../../components/control-messages/control-messages.component';
import { ComponentsModule } from "../../components/components.module";


@NgModule({
  declarations: [
    ProductsDetailsPage,
    // AppHeaderBarComponent,
    // ControlMessagesComponent
  ],
  imports: [
    IonicPageModule.forChild(ProductsDetailsPage),
    ComponentsModule
  ],
  exports: [
    ProductsDetailsPage
  ]
})
export class ProductsDetailsPageModule {}