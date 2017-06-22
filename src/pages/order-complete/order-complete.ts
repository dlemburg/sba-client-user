import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, App } from 'ionic-angular';
import { IPurchaseItem } from '../../models/models';
import { ProductsListPage } from '../products-list/products-list';
import { CheckoutPage } from '../checkout/checkout';
import { CategoriesPage } from '../categories/categories';
import { HomePage } from '../home/home';


@Component({
  selector: 'page-order-complete',
  templateUrl: 'order-complete.html'
})
export class OrderCompletePage {

  purchaseItem: IPurchaseItem;
  categoryOid: number;
  backgroundImg: string = "";
  backgroundImgSrc: string = `img/computer.png`;
  orderCompleteImgSrc: string = "";
  title: string = "Boooo YAHHH!";
  subtitle: string = "Order Complete!"
  productName: string;
  productImg: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public appCtrl: App) {
    this.backgroundImg =  `linear-gradient(
      rgba(56, 126, 245, 0.80), 
      rgba(56, 126, 245, 0.80)
    ), url(../../../${this.backgroundImgSrc}) no-repeat`;
  }

  ionViewDidLoad() {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
