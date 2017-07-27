import { Component } from '@angular/core';
import { API, ROUTES } from '../../global/api';
import { Authentication } from '../../global/authentication';
import { IonicPage, NavController, NavParams, AlertController, ToastController, ModalController, LoadingController } from 'ionic-angular';
import { AppViewData } from '../../global/app-data.service';
import { IPopup, AuthUserInfo } from '../../models/models';
import { BaseViewController } from '../base-view-controller/base-view-controller';

@IonicPage()
@Component({
  selector: 'page-my-card-more',
  templateUrl: 'my-card-more.html'
})
export class MyCardMorePage extends BaseViewController {
  auth: any = this.authentication.getCurrentUser();
  appHeaderBarLogo: string = AppViewData.getImg().logoImgSrc;
  companyName: string = this.auth.companyName;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public API: API, 
    public authentication: Authentication, 
    public modalCtrl: ModalController, 
    public alertCtrl: AlertController, 
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController) {
    super(alertCtrl, toastCtrl, loadingCtrl, navCtrl);
  }

  ionViewDidLoad() {}

  delete() {

    /*********************** LATER ****************************
      // API generate redeem code???
      // popup with code or stripe refund if under $10 ???
    *********************************************************/

    /* ACTIONS */
    // balance = 0
    // stripeCustomerId = null
    // hasMobileCard = false

    this.showPopup({title: "Are you sure?", message: "Are you sure you want to delete your mobile card?", buttons: [
      {text: "Cancel"},
      {text: "Yes, delete", handler: () => { this.submit() }}
    ]})
  }


  submit() {
    /*** Package for submit ***/
    this.presentLoading("Deleting...");
    this.API.stack(ROUTES.deleteCard, "POST", {userOid: this.auth.userOid, companyOid: this.auth.companyOid, email: this.auth.email})
      .subscribe(
        (response) => {
          console.log('response: ', response);
          this.dismissLoading("Deleted!");
        },this.errorHandler(this.ERROR_TYPES.API));
  }
}
