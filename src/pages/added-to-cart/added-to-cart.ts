import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App } from 'ionic-angular';
import { IPurchaseItem, AuthUserInfo } from '../../models/models';
import { AppViewData } from '../../global/app-data.service';
import { CONST_APP_IMGS } from '../../global/global';
import { API, ROUTES } from '../../global/api';
import { Authentication } from '../../global/authentication';

@IonicPage()
@Component({
  selector: 'page-added-to-cart',
  templateUrl: 'added-to-cart.html'
})
export class AddedToCartPage {
  purchaseItem: IPurchaseItem;
  categoryOid: number;
  img: string = `img/computer.png`;
  title: string = "Boooo YAHHH!";
  subtitle: string = "Added to your cart!"
  productName: string;
  productImg: string = null;
  productImgSrc: string = null;
  addedToCartBackgroundImgSrc: string = null;
  auth: AuthUserInfo;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public API: API, 
    public authentication: Authentication, 
    public viewCtrl: ViewController, 
    public appCtrl: App) {
  }

  ionViewDidLoad() {
    this.auth = this.authentication.getCurrentUser();
    this.productName = this.navParams.data.purchaseItem.selectedProduct.name;
    this.categoryOid = this.navParams.data.categoryOid;
    this.productImgSrc = AppViewData.getDisplayImgSrc(this.navParams.data.productImg);
    
    const imgName = CONST_APP_IMGS[12];
    this.API.stack(ROUTES.getImgName + `/${this.auth.companyOid}/${imgName}`, "GET")
      .subscribe(
        (response) => {
          console.log("response.data: ", response.data);

          if (response.data.img) {
            let url = `${ROUTES.downloadImg}?img=${response.data.img}`;
            this.addedToCartBackgroundImgSrc =  `linear-gradient(
              rgba(56, 126, 245, 0.80), 
              rgba(56, 126, 245, 0.80)
            ), url(${url}) no-repeat`;
          }
        }, (err) => {
         // this.logoImgSrc = AppViewData.getDisplayImgSrc(null);
        });
  }


  navCheckout() {
    this.viewCtrl.dismiss({
      checkout: true
    });
    //this.appCtrl.getRootNav().push('CheckoutPage');
  }

  navCategories() {
    this.viewCtrl.dismiss({
      continueOrder: true
    });
  }
}
