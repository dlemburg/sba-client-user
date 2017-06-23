import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransactionHistoryPage } from './transaction-history';
 
@NgModule({
  declarations: [
    TransactionHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(TransactionHistoryPage),
  ],
  exports: [
    TransactionHistoryPage
  ]
})
export class TransactionHistoryPageModule {}