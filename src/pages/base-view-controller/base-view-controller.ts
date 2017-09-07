import { Component } from '@angular/core';
import { API, ROUTES } from '../../global/api';
import { ENV } from '../../global/global';
import { Utils } from '../../global/utils/utils';
import { Authentication } from '../../global/authentication';
import { IErrorHandlerOpts } from '../../models/models';
import { NavController, NavParams, AlertController, ToastController, LoadingController, ModalController, AlertOptions } from 'ionic-angular';
import { AppViewData } from '../../global/app-data.service';
import { IPopup } from '../../models/models';


@Component({
  selector: 'page-base-view-controller',
  templateUrl: 'base-view-controller.html'
})

export class BaseViewController {
  public loading: any;
  public ERROR_TYPES = {
    PLUGIN: {
      CAMERA: "CAMERA",
      BARCODE: "BARCODE",
      PRINTER: "PRINTER",
      SOCIAL_MEDIA: "SOCIAL_MEDIA",
      GEOLOCATION: "GEOLOCATION"
    },
    API: "API",
    UNHANDLED_EXCEPTION: "UNHANDLED EXCEPTION",
    NOT_ONLINE: "NOT_ONLINE"

  }
  //public APPEND_DEFAULT: string = "We will work hard to ensure that this is not a problem on our end."

  public ERROR_MESSAGES = {
    CAMERA: `Sorry, there was an error retrieving your photo.  We will work hard to ensure that this is not a problem on our end.`,
    BARCODE: `sorry, there was an error accessing the scanner. We will work hard to ensure that this is not a problem on our end.`,
    PRINTER: `Sorry, there was an error either finding a printer or printing. We will work hard to ensure that this is not a problem on our end.`,
    SOCIAL_MEDIA: `Sorry, there was an error posting. We will work hard to ensure that this is not a problem on our end.`,
    GEOLOCATION: `Sorry, there was an error calculating your position. We will work hard to ensure that this is not a problem on our end.`,
    NOT_ONLINE: `Uh oh, looks like you're not online. Data is expensive these days!`
  }
  constructor(
    public alertCtrl: AlertController, 
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController,
    public navCtrl: NavController) {
  }

  // app-wide error-handler
  public errorHandler(errorType = "No type given", message = AppViewData.getToast().defaultErrorMessage, opts: IErrorHandlerOpts = {}) {
    return (err) => {
      let url, title, subTitle;
      let toastOpts = {duration: 5000, position: "bottom", cssClass: ''};
      if (opts.shouldDismissLoading === undefined) opts.shouldDismissLoading = true;
      if (opts.shouldPopView === undefined) opts.shouldPopView = false;

      if (err === this.ERROR_TYPES.NOT_ONLINE) {
        message = this.ERROR_MESSAGES.NOT_ONLINE;
      } else {
        toastOpts.duration = 5000;
        toastOpts.cssClass = 'dl-custom-toast-container';
        if (errorType === this.ERROR_TYPES.API && parseInt(err.status) === 401) {
          message = `Sorry, there was an issue validating your current session. If the issue persists, try logging out and then logging back in; then fill out an issue report. Sorry for the inconvenience`;
        } else {
          switch(errorType) {
            case this.ERROR_TYPES.API:
            case this.ERROR_TYPES.UNHANDLED_EXCEPTION:
              message = message;
              break;
            case this.ERROR_TYPES.PLUGIN[errorType]:
              message = this.ERROR_MESSAGES[errorType];
            default: 
              message = message;
          }
        }
      }

      // everything hits this
      this.presentToast(opts.shouldPopView, message, toastOpts.position, toastOpts.duration, toastOpts.cssClass);
      opts.shouldDismissLoading && this.dismissLoading();

      console.log("err: ", err);

      if (ENV.development) {
        url = err.url !== undefined ? err.url === null ? "ERR_CONNECTION_REFUSED" : err.url : "No url given"; 
        title = `Error type: ${errorType}`;
        subTitle = `Route: ${url}`;
        this.presentErrorAlert(title, subTitle, err);
      }
    }
  }

  presentErrorAlert(title = "ERROR!", subTitle = "ERROR!", err = {_body: "No stacktrace given"}) {
    const alert = this.alertCtrl.create({title, subTitle, message: err._body});
    alert.present();
  }

  // app-wide toast
 public presentToast(shouldPopView: Boolean, message = AppViewData.getToast().defaultErrorMessage, position = AppViewData.getToast().defaultToastPosition, duration = AppViewData.getToast().defaultToastDuration, cssClass = '') {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: position,
      cssClass: cssClass
    });

    toast.onDidDismiss(() => {
      if (shouldPopView) {
        //this.navCtrl.pop();
      } else {
        // do nothing
      }
    });

    toast.present();
  }

  // app-wide popup
  public showPopup(args: AlertOptions) {
    const alert = this.alertCtrl.create(args);
    alert.present();
  }

  // app-wide loading
  public presentLoading(message = AppViewData.getLoading().default) {
    this.loading = this.loadingCtrl.create({
      content: message,
    });
    this.loading.present();

    this.loading.onDidDismiss(() => {
      this.loading = null;
    });
    
  }

  public dismissLoading(message = null) {
    if (message) {
      setTimeout(() => {
        this.loading.dismiss();
      }, 800);

      setTimeout(() => {
        this.loading.data.content = message;
        this.loading.data.spinner = 'hide';
      }, 500);
    } else {
      this.loading.dismiss();
    }
  }

}
