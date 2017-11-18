import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransactionHistoryPage } from './transaction-history';

// import { AppHeaderBarComponent} from '../../components/app-header-bar/app-header-bar.component';
// import { EmptyMessagesComponent } from '../../components/empty-messages/empty-messages.component';
import { ComponentsModule } from "../../components/components.module";


@NgModule({
  declarations: [
    TransactionHistoryPage,
    // EmptyMessagesComponent,
    // AppHeaderBarComponent
  ],
  imports: [
    IonicPageModule.forChild(TransactionHistoryPage),
    ComponentsModule
  ],
  exports: [
    TransactionHistoryPage
  ]
})
export class TransactionHistoryPageModule {}