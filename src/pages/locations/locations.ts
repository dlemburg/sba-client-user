import { Component } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams, AlertController, ModalController, ToastController, LoadingController } from 'ionic-angular';
import { CheckoutStore } from '../../global/checkout-store.service';
import { API, ROUTES } from '../../global/api';
import { Authentication } from '../../global/authentication';
import { BaseViewController  } from '../base-view-controller/base-view-controller';
import { Utils } from '../../utils/utils';
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
  auth: any = this.authentication.getCurrentUser();
  appHeaderBarLogo: string = AppViewData.getImg().logoImgSrc;
  companyName: string = this.auth.companyName;
  initHasRun: boolean = false;
  lat: number;
  long: number;
  distanceFilter: number = 25;
  showMap = true;
  isLoading: boolean = true;
  currentDay: string = Utils.getDays()[new Date().getDay()].toLowerCase(); 

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

    super(alertCtrl, toastCtrl, loadingCtrl, navCtrl);
  }

  // address, city, state, zipcode, lat, long, hours
  ionViewDidLoad() {
    this.presentLoading();
    this.auth = this.authentication.getCurrentUser();

    this.getCurrentPosition().then((data) => {
      if (data.lat && data.long) this.getLocationsFilterByGpsAPI(data.lat, data.long);
    })
    .catch((err) => {
      console.log("location err: ", err);
      this.isLoading = false;
      if (err.code === 2)  {
        this.presentToast(false, "We're having trouble accessing your current location to find locations near your. Are you sure you're online and your location is on?");
        this.dismissLoading();
      } else this.errorHandler(this.ERROR_TYPES.PLUGIN.GEOLOCATION)(err);
    });
  }

  // deletes order and orderInProgress on enter
  ionViewDidEnter() {
    if (this.initHasRun) {
      this.checkoutStore.setOrderInProgress(false);
      this.checkoutStore.deleteOrder();
    } else this.initHasRun = true;
  }

  ionViewDidLeave() {
    // nothing for now
  }

  getCurrentPosition(): Promise<{lat: number, long: number}> {
    return new Promise((resolve, reject) => {
      this.geolocation.getCurrentPosition().then((data) => {
        this.lat = +data.coords.latitude.toFixed(7);
        this.long = +data.coords.longitude.toFixed(7);
        resolve({lat: this.lat, long: this.long});
      }).catch((err) => reject(err));
    })
  }


  getLocationsFilterByGpsAPI(lat, long) {
    this.API.stack(ROUTES.getLocationsFilterByGps + `/${this.auth.companyOid}/${lat}/${long}/${this.distanceFilter}`, "GET")
      .subscribe(
          (response) => {
            console.log('response: ', response);
            this.locations = this.doLocationBusinessLogic(response.data.locations);
            this.dismissLoading();
          }, (err) => {
            // handled this differently because api call needs a little extra time for loading
            this.isLoading = false;
            this.errorHandler(this.ERROR_TYPES.API, "Sorry, there was an error retrieving the locations near you. We will work hard to resolve this issue as soon as possible.")(err);
          });
  }

  doLocationBusinessLogic(locations) {
    let currentDay =  Utils.getDays()[new Date().getDay()].toLowerCase(); 
    locations.forEach((x) => {
      x.imgSrc = AppViewData.getDisplayImgSrc(x.img);
      
      if (x[currentDay + "Open"] === "closed") {
        x.isOpen = false;
        x.closedMessage = "Sorry, this location is closed today.";
      } else {
        let openMinutes = DateUtils.convertTimeStringToMinutes(x[currentDay + "Open"]);
        let openHours = DateUtils.convertTimeStringToHours(x[currentDay + "Open"]);
        let closeMinutes = DateUtils.convertTimeStringToMinutes(x[currentDay + "Close"]);
        let closeHours = DateUtils.convertTimeStringToHours(x[currentDay + "Close"]);
        let isLocationOpen: {isOpen: boolean, closedMessage: string} = this.isLocationOpen(openHours, openMinutes, closeHours, closeMinutes);

        x.isOpen = isLocationOpen.isOpen; 
        x.closedMessage = isLocationOpen.closedMessage;
      }
    });

    return locations;
  }

  isLocationOpen(openHours, openMinutes, closeHours, closeMinutes): {isOpen: boolean, closedMessage: string} {
    let now = new Date(); 
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let closeMidnight = false;
    let closedMessage = "";

  
    // this algorithm can be improved and refactored. i just kept adding to it. works well for now.
    if (openHours === 24) openHours = 0;  // midnight open to zero
    if (closeHours === 0) closeMidnight = true;

    if (hours > openHours && hours < closeHours) return { isOpen: true, closedMessage: null };
    else if (hours > openHours && closeMidnight) return { isOpen: true, closedMessage: null };
    else if (hours === openHours) {
      if (minutes > openMinutes) return { isOpen: true, closedMessage: null };
      else return {isOpen: false, closedMessage: `This location opens in ${openMinutes - minutes} minutes`};
    } 
    else if ((openHours - hours) === 1 && openMinutes === 0) return { isOpen: false, closedMessage: `This location opens in ${60 - minutes} minutes`};    
    else if (hours === closeHours) {
      if (minutes < closeMinutes) return {isOpen: true, closedMessage: null };
      else return { isOpen: false, closedMessage: `Sorry, this location just closed for the night.`};
    } 
    else if (hours < openHours) {
      let isSoon = (openHours - hours) < 2 ? true : false;
      closedMessage = isSoon ? `This location opens soon.` : `Closed right now.`;

      return { isOpen: false, closedMessage};
    } 
    else {
      if (hours > closeHours) return { isOpen: false, closedMessage: `Closed for the day`};
      else return { isOpen: false, closedMessage: `Closed right now`};
    }
  }

  updateActive(i) { 
    this.isActive = i; 
  }

  navLocationMap(selectedLocation) {
    this.navCtrl.push('LocationsMapPage', {selectedLocation, locations: this.locations})
  }
  
  viewHours(location) {
    let days = Utils.getDays();
    let locationHours: Array<{day: string, hours: string|Array<string>}> = [];

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
    const days = Utils.getDays();
    const today = days[new Date().getDay()].toLowerCase();
    const closeTime = location[today + "Close"];

    return DateUtils.convertTimeStringToJavascriptDate(closeTime);
 }

  proceedToOrder(location) {
    console.log("trying to change pages")
    this.checkoutStore.setOrderInProgress(true);
    this.checkoutStore.setLocationOid(location.oid); 
    this.checkoutStore.setLocationCloseTime(this.createLocationCloseTime(location));
    this.navCtrl.push('CategoriesPage');
  }
}
