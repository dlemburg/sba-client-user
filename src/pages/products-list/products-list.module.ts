import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductsListPage } from './products-list';

// import { AppHeaderBarComponent} from '../../components/app-header-bar/app-header-bar.component';
// import { EmptyMessagesComponent } from '../../components/empty-messages/empty-messages.component';
import { ComponentsModule } from "../../components/components.module";

 
@NgModule({
  declarations: [
    ProductsListPage,
    // AppHeaderBarComponent,
    // EmptyMessagesComponent
  ],
  imports: [
    IonicPageModule.forChild(ProductsListPage),
    ComponentsModule
  ],
  exports: [
    ProductsListPage
  ]
})
export class ProductsListPageModule {}