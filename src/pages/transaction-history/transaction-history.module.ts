import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransactionHistoryPage } from './transaction-history';

import { EmptyMessageComponentModule } from '../../components/empty-message/empty-message.component.module';
import { AppHeaderBarComponentModule } from '../../components/app-header-bar/app-header-bar.component.module';


@NgModule({
  declarations: [
    TransactionHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(TransactionHistoryPage),
    EmptyMessageComponentModule,
    AppHeaderBarComponentModule
  ],
  exports: [
    TransactionHistoryPage
  ]
})
export class TransactionHistoryPageModule {}