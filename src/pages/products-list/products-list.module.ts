import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductsListPage } from './products-list';

import { EmptyMessageComponentModule } from '../../components/empty-message/empty-message.component.module';
import { AppHeaderBarComponentModule } from '../../components/app-header-bar/app-header-bar.component.module';


 
@NgModule({
  declarations: [
    ProductsListPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductsListPage),
    EmptyMessageComponentModule,
    AppHeaderBarComponentModule
  ],
  exports: [
    ProductsListPage
  ]
})
export class ProductsListPageModule {}