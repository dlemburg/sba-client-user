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
    UNHANDLED_EXCEPTION: "UNHANDLED EXCEPTION"
  }
  public APPEND_DEFAULT: string = "We will work hard to ensure that this is not a problem on our end."

  public ERROR_MESSAGES = {
    CAMERA: `Sorry, there was an error retrieving your photo.  ${this.APPEND_DEFAULT}`,
    BARCODE: `sorry, there was an error accessing the scanner. ${this.APPEND_DEFAULT}`,
    PRINTER: `Sorry, there was an error either finding a printer or printing. ${this.APPEND_DEFAULT}`,
    SOCIAL_MEDIA: `Sorry, there was an error posting. ${this.APPEND_DEFAULT}`,
    GEOLOCATION: `Sorry, there was an error calculating your position. ${this.APPEND_DEFAULT}`
  }
  constructor(public alertCtrl: AlertController, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
  }

  // app-wide error-handler
  public errorHandler(errorType = "No type given", message = AppViewData.getToast().defaultErrorMessage, opts: IErrorHandlerOpts = {}) {
    return (err) => {
      if (opts.shouldDismissLoading === undefined) opts.shouldDismissLoading = true;
      if (opts.shouldPopView === undefined) opts.shouldPopView = false;

      switch(errorType) {
        case this.ERROR_TYPES.API:
        case this.ERROR_TYPES.UNHANDLED_EXCEPTION:
          message = message;
          break;
        default: 
          message = this.ERROR_MESSAGES[errorType];
      }
      this.presentToast(opts.shouldPopView, message);
      opts.shouldDismissLoading && this.dismissLoading();

      console.log("err: ", err);

      if (ENV.development) {
        let url = err.url !== undefined ? err.url === null ? "ERR_CONNECTION_REFUSED" : err.url : "No url given"; 
        const title = `Error type: ${errorType}`;
        const subTitle = `Route: ${url}`;
        this.presentErrorAlert(title, subTitle, err);
      } else {
          // http analytics call here
      }
    }
  }

  presentErrorAlert(title = "ERROR!", subTitle = "ERROR!", err = {_body: "No stacktrace given"}) {
    const alert = this.alertCtrl.create({title, subTitle, message: err._body});
    alert.present();
  }



  // app-wide toast
  public presentToast(shouldPopView: Boolean, message = AppViewData.getToast().defaultErrorMessage, position = AppViewData.getToast().defaultToastPosition, duration = AppViewData.getToast().defaultToastDuration) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration || 2500,
      position: position || "bottom"
    });

    toast.onDidDismiss(() => {
      if (shouldPopView) {
       // this.navCtrl.pop();
      } else {
        // do nothing
      }
    });

    toast.present();
  }

  // modal
  /*
  presentModal(page: Component, params: any = {}, opts: any = {}) {
    let modal = this.modalCtrl.create(page, params, opts)
    modal.present();
  }  
  */

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
