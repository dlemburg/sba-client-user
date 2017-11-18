import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoriesPage } from './categories';

// import { AppHeaderBarComponent} from '../../components/app-header-bar/app-header-bar.component';
// import { EmptyMessagesComponent } from '../../components/empty-messages/empty-messages.component';
import { ComponentsModule } from "../../components/components.module";

 
@NgModule({
  declarations: [
    CategoriesPage,
    // AppHeaderBarComponent,
    // EmptyMessagesComponent
  ],
  imports: [
    IonicPageModule.forChild(CategoriesPage),
    ComponentsModule
  ],
  exports: [
    CategoriesPage
  ]
})
export class CategoriesPageModule {}