import { Component, Directive } from '@angular/core';
import { API, ROUTES } from '../../global/api';
import { Authentication } from '../../global/authentication';
import { Utils } from '../../utils/utils';
import { AuthUserInfo, ICompanyDetails } from '../../models/models';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { BaseViewController } from '../base-view-controller/base-view-controller';
import { AppViewData } from '../../global/app-data.service';
import { SocialSharing } from '@ionic-native/social-sharing';
import { CONST_SOCIAL_MEDIA_TYPES } from '../../global/global';

@IonicPage()
@Component({
  selector: 'page-barcode-pay',
  templateUrl: 'barcode-pay.html',
})
export class BarcodePayPage extends BaseViewController {
  companyDetails: ICompanyDetails = {};
  socialMediaDiscountString: string;
  socialMediaType: string = "";
  isSocialMediaUsed: boolean = false;
  paymentID: string = null;
  auth: AuthUserInfo = this.authentication.getCurrentUser();
  barcodeData: string = `${this.auth.userOid}$${this.auth.companyOid}$0$0`;
  shareVia = {
    TWITTER: () => {
      this.twitter();
    },
    FACEBOOK: () => {
      this.facebook();
    },
    INSTAGRAM: () => {
       this.instagram();
    }
  };
  SOCIAL_MEDIA_TYPES = CONST_SOCIAL_MEDIA_TYPES;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public socialSharing: SocialSharing,
    public API: API, 
    public authentication: Authentication, 
    public modalCtrl: ModalController, 
    public alertCtrl: AlertController, 
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController) {
      super(alertCtrl, toastCtrl, loadingCtrl);
  }

  ionViewDidLoad() {
    this.presentLoading();
    this.auth = this.authentication.getCurrentUser();
    this.API.stack(ROUTES.getCompanyDetails, "POST", {companyOid: this.auth.companyOid})
      .subscribe(
          (response) => {
            console.log('response: ', response);
            this.companyDetails = response.data.companyDetails;
            this.companyDetails.socialMediaImg = `${ROUTES.downloadImg}?img=${response.data.companyDetails.socialMediaImg}`;

            console.log("this.companyDetails: ", this.companyDetails);   
            this.getUserPaymentID();
            
          }, this.errorHandler(this.ERROR_TYPES.API, undefined, {shouldDismissLoading: false}));
  }

  getUserPaymentID() {
     this.API.stack(ROUTES.getUserPaymentID, "POST", {userOid: this.auth.userOid, companyOid: this.auth.companyOid})
      .subscribe(
          (response) => {
            console.log('response: ', response);
            this.paymentID = response.data.paymentID;
            this.dismissLoading();
          }, this.errorHandler(this.ERROR_TYPES.API));
  }


  // barcode data will have  userOid, companyOid, isSocialMediaUsed, socialMediaType separated by $
  // i.e.:  148$12$0$TWITTER

  generateBarcodeData(isSocialMediaUsed: boolean|number, socialMediaType: string) {
    isSocialMediaUsed = isSocialMediaUsed ? 1 : 0;
    this.barcodeData =`${this.auth.userOid}$${this.auth.companyOid}${isSocialMediaUsed}$${socialMediaType}`;
  }

  finishProcessSocialMedia(socialMediaType) {
    this.generateBarcodeData(true, socialMediaType);
  }

  onShare(socialMediaType:string) {
    this.presentLoading("Posting...");
    this.shareVia[socialMediaType]();
  }

  twitter() {
    this.socialSharing.shareViaTwitter(this.companyDetails.socialMediaMessage, this.companyDetails.socialMediaImg).then(() => {
      this.finishProcessSocialMedia(this.SOCIAL_MEDIA_TYPES.TWITTER);
    })
    .catch(this.errorHandler(this.ERROR_TYPES.PLUGIN.SOCIAL_MEDIA))
  }

  facebook() {
    this.socialSharing.shareViaFacebook(this.companyDetails.socialMediaMessage, this.companyDetails.socialMediaImg).then(() => {
      this.finishProcessSocialMedia(this.SOCIAL_MEDIA_TYPES.FACEBOOK);

    })
    .catch(this.errorHandler(this.ERROR_TYPES.PLUGIN.SOCIAL_MEDIA))
  }

  instagram() {
    this.socialSharing.shareViaInstagram(this.companyDetails.socialMediaMessage, this.companyDetails.socialMediaImg).then(() => {
      this.finishProcessSocialMedia(this.SOCIAL_MEDIA_TYPES.INSTAGRAM);
    })
    .catch(this.errorHandler(this.ERROR_TYPES.PLUGIN.SOCIAL_MEDIA))

  }


  submit() {
    this.navCtrl.setRoot('HomePage');
  }

}
