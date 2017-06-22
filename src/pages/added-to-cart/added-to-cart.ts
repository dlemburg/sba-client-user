import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, App } from 'ionic-angular';
import { IPurchaseItem } from '../../models/models';
import { ProductsListPage } from '../products-list/products-list';
import { CheckoutPage } from '../checkout/checkout';
import { CategoriesPage } from '../categories/categories';

@Component({
  selector: 'page-added-to-cart',
  templateUrl: 'added-to-cart.html'
})
export class AddedToCartPage {
  purchaseItem: IPurchaseItem;
  categoryOid: number;
  backgroundImg: string = "";
  img: string = `img/computer.png`;
  title: string = "Boooo YAHHH!";
  subtitle: string = "Added to your cart!"
  productName: string;
  productImg: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public appCtrl: App) {
    this.backgroundImg =  `linear-gradient(
      rgba(56, 126, 245, 0.80), 
      rgba(56, 126, 245, 0.80)
    ), url(../../../${this.img}) no-repeat`;
  }

  ionViewDidLoad() {
    this.productName = this.navParams.data.purchaseItem.selectedProduct.name;
    this.productImg = this.navParams.data.productImg;
    this.categoryOid = this.navParams.data.categoryOid;
  }

  navCheckout() {
    this.viewCtrl.dismiss();
    this.appCtrl.getRootNav().push(CheckoutPage);
  }

  navCategories() {
    this.viewCtrl.dismiss();
  }
}
