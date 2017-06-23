import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, ToastController, LoadingController } from 'ionic-angular';
import { StoreService } from '../../global/store.service';
import { API, ROUTES } from '../../global/api.service';
import { Authentication } from '../../global/authentication.service';
import { BaseViewController  } from '../base-view-controller/base-view-controller';
import { UtilityService } from '../../global/utility.service';
import { Dates } from '../../global/dates.service';

@IonicPage()
@Component({
  selector: 'page-locations',
  templateUrl: 'locations.html'
})
export class LocationsPage extends BaseViewController {
  closedMessage: string;
  category: string;
  locations: Array<any> = [];
  isActive: number;
  isProceedingToOrder: boolean = false;
  auth: any;
  initHasRun: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public API: API, public authentication: Authentication, public modalCtrl: ModalController, public alertCtrl: AlertController, public toastCtrl: ToastController, public loadingCtrl: LoadingController, private storeService: StoreService) {
    super(navCtrl, navParams, API, authentication, modalCtrl, alertCtrl, toastCtrl, loadingCtrl);
  }

  // address, city, state, zipcode, lat, long, hours
  ionViewDidLoad() {
    this.isActive = 0;
    this.category = "list";
    // google maps plugin
    // get locations
    // get user location
    // determine mileage
    // determine open/closed

    this.presentLoading();
    this.auth = this.authentication.getCurrentUser();
    this.API.stack(ROUTES.getLocations + `/${this.auth.companyOid}`, "GET")
      .subscribe(
          (response) => {
            console.log('response: ', response);
            this.locations = response.data.locations;
            
            // isOpen
            this.locations.forEach((x, index) => {
              x.isOpen = this.determineIsOpen(x);
            });
            this.dismissLoading();
          }, (err) => {
            const shouldPopView = false;
            this.errorHandler.call(this, err, shouldPopView)
          });
  }

  ionViewDidEnter() {
    if (this.initHasRun) {
      this.locations.forEach((x, index) => {
        x.isOpen = this.determineIsOpen(x);
      });
      this.storeService.setOrderInProgress(false);
      this.storeService.deleteOrder();
    } else this.initHasRun = true;
  }

  ionViewDidLeave() {
   
  }

  determineIsOpen(location): boolean {
    let now = new Date(); 
    let day = UtilityService.getDays()[now.getDay()].toLowerCase(); 
    let hours = now.getHours();
    let minutes = now.getMinutes();

    let todayOpen = location[day + "Open"];
    let todayClose = location[day + "Close"];

    if (todayOpen === "closed") {
      this.closedMessage = "Sorry, this location is closed today."
      return false;
    }
    else {
      let openMinutes = Dates.convertTimeStringToMinutes(todayOpen);
      let openHours = Dates.convertTimeStringToHours(todayOpen);
      let closeMinutes = Dates.convertTimeStringToMinutes(todayClose);
      let closeHours = Dates.convertTimeStringToHours(todayClose);
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
  
  viewHours(location) {
    let days = UtilityService.getDays();
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
        dayOpen = Dates.convertMilitaryTimeStringToNormalTimeString(dayOpen);
        dayClose = Dates.convertMilitaryTimeStringToNormalTimeString(dayClose);
        locationHours[index].hours = [dayOpen, dayClose];
      }
    });

    this.presentModal('HoursPage', {locationHours});
  }

 createLocationCloseTime(location): Date {
    const days = UtilityService.getDays();
    const today = new Date().getDay();
    const closeTime = location[days[today].toLowerCase() + "Close"];

    return Dates.convertTimeStringToJavascriptDate(closeTime);
 }

  proceedToOrder(location) {
    this.storeService.setOrderInProgress(true);
    this.storeService.setLocationOid(location.oid); 
    this.storeService.setLocationCloseTime(this.createLocationCloseTime(location));
    this.navCtrl.push('CategoriesPage');
  }
}
