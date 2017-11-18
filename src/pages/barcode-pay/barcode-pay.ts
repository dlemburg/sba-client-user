import { Component } from '@angular/core';
import { API, ROUTES } from '../../services/api';
import { Authentication } from '../../services/authentication';
// import { Utils } from '../../utils/utils';
import { ICompanyDetails } from '../../interfaces/interfaces';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { BaseViewController } from '../../components/base-view-controller/base-view-controller';
import { AppStorage } from '../../services/app-storage.service';
import { SocialSharing } from '@ionic-native/social-sharing';
import { CONSTANT } from '../../constants/constants';
import { Clipboard } from '@ionic-native/clipboard';

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
  auth: any = this.authentication.getCurrentUser();
  appHeaderBarLogo: string = AppStorage.getImg().logoImgSrc;
  companyName: string = this.auth.companyName;
  mobileCardId: string = null;
  barcodeData: string = `${this.auth.userOid}$${this.auth.companyOid}$0$0`;
  shareVia = {
    TWITTER: () => {
      this.twitter();   // avoided having to use .bind()
    },
    FACEBOOK: () => {
      this.facebook();
    },
    INSTAGRAM: () => {
       this.instagram();
    }
  };
  SOCIAL_MEDIA_TYPES = CONSTANT.SOCIAL_MEDIA_TYPES;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public socialSharing: SocialSharing,
    public clipboard: Clipboard,
    public API: API, 
    public authentication: Authentication, 
    public modalCtrl: ModalController, 
    public alertCtrl: AlertController, 
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController) {
      super(alertCtrl, toastCtrl, loadingCtrl, navCtrl);
  }

  ionViewDidLoad() {
    this.presentLoading();
    this.API.stack(ROUTES.getCompanyDetails, "POST", {companyOid: this.auth.companyOid})
      .subscribe(
          (response) => {
            console.log('response: ', response);
            this.companyDetails = response.data.companyDetails;
            this.companyDetails.socialMediaImg = `${ROUTES.downloadImg}?img=${response.data.companyDetails.socialMediaImg}`;

            this.getUserMobileCardId();
            
          }, this.errorHandler(this.ERROR_TYPES.API, undefined, {shouldDismissLoading: false}));
  }

  getUserMobileCardId() {
     this.API.stack(ROUTES.getUserMobileCardId, "POST", {userOid: this.auth.userOid, companyOid: this.auth.companyOid})
      .subscribe(
          (response) => {
            console.log('response: ', response);
            this.mobileCardId = response.data.mobileCardId;
            this.dismissLoading();
          }, this.errorHandler(this.ERROR_TYPES.API));
  }


  // barcode data will have  userOid, companyOid, isSocialMediaUsed, socialMediaType separated by $
  // i.e.:  148$12$0$TWITTER

  generateBarcodeData(isSocialMediaUsed: boolean|number, socialMediaType: string) {
    isSocialMediaUsed = isSocialMediaUsed ? 1 : 0;
    this.barcodeData =`${this.auth.userOid}$${this.auth.companyOid}$${isSocialMediaUsed}$${socialMediaType}`;

    console.log("this.barcodeData: ", this.barcodeData);
  }

  finishProcessSocialMedia(socialMediaType) {
    this.generateBarcodeData(true, socialMediaType);
    this.dismissLoading();
  }

  onShare(socialMediaType:string) {
    this.presentLoading("Posting...");
    this.shareVia[socialMediaType]();
  }

  getMessageToCopy(outlet) {
    return new Promise((resolve, reject) => {
      this.showPopup({
        title: "Copy to Clipboard",
        subTitle: `Paste this into your ${outlet} post`,
        message: outlet === "Facebook" ? this.companyDetails.socialMediaMessageFacebook : this.companyDetails.socialMediaMessageInstagram,
        buttons: [{text: "Copy to Clipboard", handler: () => {
          this.clipboard.copy(this.companyDetails.socialMediaMessageFacebook);
          resolve();
        }}]
      })
    })
  }

  twitter() {
    this.socialSharing.shareViaTwitter(this.companyDetails.socialMediaMessageTwitter, this.companyDetails.socialMediaImg).then((data) => {
      console.log("data: ", data);
      this.finishProcessSocialMedia(this.SOCIAL_MEDIA_TYPES.TWITTER);
    })
    .catch(this.errorHandler(this.ERROR_TYPES.PLUGIN.SOCIAL_MEDIA))
  }

  facebook() {
    console.log("this.companyDetails.socialMediaMessageFacebook: ", this.companyDetails.socialMediaMessageFacebook);
    
    // get facebook message
    this.getMessageToCopy("Facebook").then(() => {
      this.socialSharing.shareViaFacebook(this.companyDetails.socialMediaMessageFacebook).then(() => {
        this.finishProcessSocialMedia(this.SOCIAL_MEDIA_TYPES.FACEBOOK);
      })
    })
    .catch(this.errorHandler(this.ERROR_TYPES.PLUGIN.SOCIAL_MEDIA))
  }

  instagram() {
    console.log("this.companyDetails.socialMediaImg: ", this.companyDetails.socialMediaImg);
    
    this.getMessageToCopy("Instagram").then(() => {
      this.socialSharing.shareViaInstagram(this.companyDetails.socialMediaMessageInstagram, this.companyDetails.socialMediaImg).then(() => {
        this.finishProcessSocialMedia(this.SOCIAL_MEDIA_TYPES.INSTAGRAM);
      })
    })
    .catch(this.errorHandler(this.ERROR_TYPES.PLUGIN.SOCIAL_MEDIA))

  }

  submit() {
    this.navCtrl.setRoot('HomePage');
  }

}
