import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App } from 'ionic-angular';
import { IPurchaseItem, AuthUserInfo } from '../../interfaces/interfaces';
import { AppStorage } from '../../services/app-storage.service';
import { CONSTANT} from '../../constants/ constants';
import { API, ROUTES } from '../../services/api';
import { Authentication } from '../../services/authentication';

@IonicPage()
@Component({
  selector: 'page-added-to-cart',
  templateUrl: 'added-to-cart.html'
})
export class AddedToCartPage {
  purchaseItem: IPurchaseItem;
  categoryOid: number;
  img: string = `img/computer.png`;
  title: string = ""; //"Boooo YAHHH!";
  subtitle: string = "Added to your cart!"
  productName: string;
  productImg: string = null;
  productImgSrc: string = null;
  backgroundImgSrc: string = null;
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
   // this.categoryOid = this.navParams.data.categoryOid;
    this.productImgSrc = AppStorage.getDisplayImgSrc(this.navParams.data.productImg);
    const imgName = CONSTANT.APP_IMGS[12];
    
    this.API.stack(ROUTES.getImgName + `/${this.auth.companyOid}/${imgName}`, "GET")
      .subscribe(
        (response) => {
          console.log("response.data: ", response.data);
          if (response.data.img) {
            let url = `${ROUTES.downloadImg}?img=${response.data.img}`;
            this.backgroundImgSrc =  `url(${url}) no-repeat`;
          }
        }, (err) => {
         // DO NOTHING
        });
  }


  navCheckout() {
    this.viewCtrl.dismiss({
      checkout: true
    });
  }

  navCategories() {
    this.viewCtrl.dismiss({
      continueOrder: true
    });
  }
}
