import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoriesPage } from './categories';

import { EmptyMessageComponentModule } from '../../components/empty-message/empty-message.component.module';
import { AppHeaderBarComponentModule } from '../../components/app-header-bar/app-header-bar.component.module';

 
@NgModule({
  declarations: [
    CategoriesPage,
  ],
  imports: [
    IonicPageModule.forChild(CategoriesPage),
    AppHeaderBarComponentModule,
    EmptyMessageComponentModule
  ],
  exports: [
    CategoriesPage
  ]
})
export class CategoriesPageModule {}