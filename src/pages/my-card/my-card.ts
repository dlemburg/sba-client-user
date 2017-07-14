import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,  AlertController, ModalController, ToastController, LoadingController } from 'ionic-angular';
import { AppViewData } from '../../global/app-data.service';
import { API, ROUTES } from '../../global/api';
import { Authentication } from '../../global/authentication';
import { BaseViewController } from '../base-view-controller/base-view-controller';
import { CONST_APP_IMGS } from '../../global/global';

@IonicPage()
@Component({
  selector: 'page-my-card',
  templateUrl: 'my-card.html'
})
export class MyCardPage extends BaseViewController {
  balance: number|string = 0;
  mobileCardImgSrc: string = "";
  items: Array<{component: Component|null, name: string, showOnInit: boolean, itemDoesNeedMobileCardToShow: boolean, visible: boolean}> = [];
  auth: any = this.authentication.getCurrentUser();
  appHeaderBarLogo: string = AppViewData.getImg().logoImgSrc;
  companyName: string = this.auth.companyName;
  unavailable: string = "Unavailable";
  hasMobileCard: boolean = false;
  hasReturnedMobileCardData: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public API: API, 
    public authentication: Authentication, 
    public modalCtrl: ModalController, 
    public alertCtrl: AlertController, 
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController) {

    super(alertCtrl, toastCtrl, loadingCtrl);
    
    this.items = [
      {component: 'AddCreditCardPage', name: 'Create Mobile Card', showOnInit: false, itemDoesNeedMobileCardToShow: false, visible: false},
      {component: 'AddCardValuePage', name: 'Add Value to Mobile Card', showOnInit: false, itemDoesNeedMobileCardToShow: true, visible: false},
      {component: 'TransactionHistoryPage', name: 'Transaction History', showOnInit: true, itemDoesNeedMobileCardToShow: false, visible: true},
      {component: 'MyCardMorePage', name: 'More...', showOnInit: false, itemDoesNeedMobileCardToShow: true, visible: false},
    ]
  }

  ionViewDidLoad() {
    this.presentLoading();
    this.API.stack(ROUTES.getBalanceAndHasMobileCard, "POST", {userOid: this.auth.userOid})
      .subscribe(
          (response) => {
            this.dismissLoading();
            console.log('response: ', response);
            this.balance = response.data.mobileCardData.balance;
            this.hasMobileCard = response.data.mobileCardData.hasMobileCard;

            this.items.forEach((x) => {
              if (x.itemDoesNeedMobileCardToShow && this.hasMobileCard) x.visible = true;
              else if (!x.itemDoesNeedMobileCardToShow && !this.hasMobileCard) x.visible = true;
            });
            this.hasReturnedMobileCardData = true;

          }, this.errorHandler(this.ERROR_TYPES.API));

    // get myCardImg, doesn't need to be async
    const imgName =CONST_APP_IMGS[11];
    this.API.stack(ROUTES.getImgName + `/${this.auth.companyOid}/${imgName}`, "GET")
      .subscribe(
          (response) => {
            console.log('response: ', response);
            const img = response.data.img;
            this.mobileCardImgSrc = AppViewData.getDisplayImgSrc(img);
          },this.errorHandler(this.ERROR_TYPES.API, undefined, {shouldDismissLoading: false}));
  }

  nav(page) {
    this.navCtrl.push(page.component);
  }

  navBarcodePayPage() {
    this.navCtrl.push('BarcodePayPage');
  }
}
