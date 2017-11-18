import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App } from 'ionic-angular';
import { IPurchaseItem, AuthUserInfo } from '../../interfaces/interfaces';
import { CONSTANT } from '../../constants/constants';
import { API, ROUTES } from '../../services/api';
import { Authentication } from '../../services/authentication';

@IonicPage()
@Component({
  selector: 'page-order-complete',
  templateUrl: 'order-complete.html'
})
export class OrderCompletePage {
  purchaseItem: IPurchaseItem;
  categoryOid: number;
  backgroundImg: string = "";
  backgroundImgSrc: string = null;
  orderCompleteMiddleOfPageImgSrc: string = null;
  title: string = "Order Complete";
  subtitle: string = "Your order is being prepared!"
  productName: string;
  productImg: string;
  auth: AuthUserInfo;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public API: API, 
    public viewCtrl: ViewController, 
    public appCtrl: App,
    public authentication: Authentication) {

  }

  ionViewDidLoad() {
    this.auth = this.authentication.getCurrentUser();
    const imgName = CONSTANT.APP_IMGS[9];
    this.API.stack(ROUTES.getImgName + `/${this.auth.companyOid}/${imgName}`, "GET")
      .subscribe(
        (response) => {
          console.log("response.data: ", response.data);
          let img = response.data.img;
          let url = `${ROUTES.downloadImg}?img=${img}`;
          /*
          this.orderCompleteBackgroundImgSrc =  `linear-gradient(
            rgba(56, 126, 245, 0.80), 
            rgba(56, 126, 245, 0.80)
          ), url(${url}) no-repeat`;
          */
          this.backgroundImgSrc =  `url(${url}) no-repeat`;
        }, (err) => {
         // this.logoImgSrc = AppViewData.getDisplayImgSrc(null);
        });

  /*
    const imgName2 = CONST_APP_IMGS[10];
    this.API.stack(ROUTES.getImgName + `/${this.auth.companyOid}/${imgName2}`, "GET")
      .subscribe(
        (response) => {
          console.log("response.data: ", response.data);
          let url = AppViewData.getDisplayImgSrc(response.data.img);
          
        }, (err) => {
          this.orderCompleteMiddleOfPageImgSrc = AppViewData.getDisplayImgSrc(null);
        });
    */
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
