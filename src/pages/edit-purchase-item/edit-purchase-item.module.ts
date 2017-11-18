import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditPurchaseItemPage } from './edit-purchase-item';

// import { AppHeaderBarComponent} from '../../components/app-header-bar/app-header-bar.component';
// import { ControlMessagesComponent } from '../../components/control-messages/control-messages.component';
import { ComponentsModule } from "../../components/components.module";


@NgModule({
  declarations: [
    EditPurchaseItemPage,
    // ControlMessagesComponent,
    // AppHeaderBarComponent
  ],
  imports: [
    IonicPageModule.forChild(EditPurchaseItemPage),
    ComponentsModule
  ],
  exports: [
    EditPurchaseItemPage
  ]
})
export class EditPurchaseItemPageModule {}