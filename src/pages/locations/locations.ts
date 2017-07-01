import { Component } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams, AlertController, ModalController, ToastController, LoadingController } from 'ionic-angular';
import { CheckoutStore } from '../../global/checkout-store.service';
import { API, ROUTES } from '../../global/api';
import { Authentication } from '../../global/authentication';
import { BaseViewController  } from '../base-view-controller/base-view-controller';
import { Utils } from '../../utils/utils';
import { AppUtils } from '../../utils/app-utils';
import { DateUtils } from '../../utils/date-utils';
import { AppViewData } from '../../global/app-data.service';
import { Geolocation } from '@ionic-native/geolocation';
import { SocialSharing } from '@ionic-native/social-sharing';

@IonicPage()
@Component({
  selector: 'page-locations',
  templateUrl: 'locations.html'
})
export class LocationsPage extends BaseViewController {
  closedMessage: string;
  category: string;
  locations: Array<any> = [];
  isActive: number = 0;
  isProceedingToOrder: boolean = false;
  auth: any;
  initHasRun: boolean = false;
  lat: number;
  long: number;
  distanceFilter: number = 25;
  showMap = true;
  zero: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public geolocation: Geolocation,
    public platform: Platform, 
    public API: API, 
    public authentication: Authentication, 
    public modalCtrl: ModalController, 
    public alertCtrl: AlertController, 
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController,
    public checkoutStore: CheckoutStore) {
    super(alertCtrl, toastCtrl, loadingCtrl);
  }

  // address, city, state, zipcode, lat, long, hours
  ionViewDidLoad() {
    this.presentLoading();
    this.auth = this.authentication.getCurrentUser();

    this.geolocation.getCurrentPosition().then((data) => {
      this.lat = +data.coords.latitude.toFixed(7);
      this.long = +data.coords.longitude.toFixed(7);

      console.log("this.lat: ", this.lat, "/n this.long: ", this.long);

      this.getLocationsFilterByGpsAPI(this.lat, this.long);
    })
    .catch(this.errorHandler(this.ERROR_TYPES.PLUGIN.GEOLOCATION));
  }

  ionViewDidEnter() {
    if (this.initHasRun) {
      this.checkoutStore.setOrderInProgress(false);
      this.checkoutStore.deleteOrder();
    } else this.initHasRun = true;
  }

  ionViewDidLeave() {
   
  }

  getLocationsFilterByGpsAPI(lat, long) {
    this.API.stack(ROUTES.getLocationsFilterByGps + `/${this.auth.companyOid}/${lat}/${long}/${this.distanceFilter}`, "GET")
      .subscribe(
          (response) => {
            console.log('response: ', response);
            this.locations = response.data.locations;
            if (!this.locations.length) this.zero = true;
            this.dismissLoading();
          }, this.errorHandler(this.ERROR_TYPES.API));
  }

  isOpen(location): boolean {
    let now = new Date(); 
    let day = AppUtils.getDays()[now.getDay()].toLowerCase(); 
    let hours = now.getHours();
    let minutes = now.getMinutes();

    let todayOpen = location[day + "Open"];
    let todayClose = location[day + "Close"];

    if (todayOpen === "closed") {
      this.closedMessage = "Sorry, this location is closed today."
      return false;
    }
    else {
      let openMinutes = DateUtils.convertTimeStringToMinutes(todayOpen);
      let openHours = DateUtils.convertTimeStringToHours(todayOpen);
      let closeMinutes = DateUtils.convertTimeStringToMinutes(todayClose);
      let closeHours = DateUtils.convertTimeStringToHours(todayClose);
      let closeMidnight = false;


      // this algorithm can be improved and refactored. i just kept adding to it. works well for now.
      if (openHours === 24) openHours = 0;  // midnight open to zero
      if (closeHours === 0) closeMidnight = true;
      if (hours > openHours && hours < closeHours) return true;
      else if (hours > openHours && closeMidnight) return true;
      else if (hours === openHours) {
        if (minutes > openMinutes) return true;
        else {
          this.closedMessage = `This location opens in ${openMinutes - minutes} minutes`;
          return false;
        }
      } else if ((openHours - hours) === 1 && openMinutes === 0) {
          this.closedMessage = `This location opens in ${60 - minutes} minutes`; 
          return false;
      } else if (hours === closeHours) {
        if (minutes < closeMinutes) return true;
        else {
          this.closedMessage = `Sorry, this location just closed for the night.`
          return false;
        }
      } else if (hours < openHours) {
        let isSoon = (openHours - hours) < 2 ? true : false;
        this.closedMessage = isSoon ? `This location opens soon.` : `Closed right now.`;
        return false;
      } else {
        if (hours > closeHours) {
          this.closedMessage = `Closed for the day.`
          return false;
        } else {
          this.closedMessage = `Closed right now.`;
          return false;
        }
      }
    }
  }

  updateActive(i) { 
    this.isActive = i; 
  }

  navLocationMap(selectedLocation) {
    /*
    let locations = this.locations.filter((x) => {
      return x.oid !== selectedLocation.oid;
    });
    */

    this.navCtrl.push('LocationsMapPage', {selectedLocation, locations: this.locations})
  }
  
  viewHours(location) {
    let days = AppUtils.getDays();
    let locationHours = [];

    /* package for modal */
    days.forEach((x, index) => {
      let dayOpen = location[x.toLowerCase() + "Open"];
      let dayClose = location[x.toLowerCase() + "Close"];

      locationHours[index] = {day: null, hours: null};

      locationHours[index].day = x;
      if (dayOpen === "closed") {
        locationHours[index].hours = "closed";
      } else {
        dayOpen = DateUtils.convertMilitaryTimeStringToNormalTimeString(dayOpen);
        dayClose = DateUtils.convertMilitaryTimeStringToNormalTimeString(dayClose);
        locationHours[index].hours = [dayOpen, dayClose];
      }
    });

    this.modalCtrl.create('HoursPage', {locationHours}).present();
  }

 createLocationCloseTime(location): Date {
    const days = AppUtils.getDays();
    const today = new Date().getDay();
    const closeTime = location[days[today].toLowerCase() + "Close"];

    return DateUtils.convertTimeStringToJavascriptDate(closeTime);
 }

  proceedToOrder(location) {
    this.checkoutStore.setOrderInProgress(true);
    this.checkoutStore.setLocationOid(location.oid); 
    this.checkoutStore.setLocationCloseTime(this.createLocationCloseTime(location));
    this.navCtrl.push('CategoriesPage');
  }
}
