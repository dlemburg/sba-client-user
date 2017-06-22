import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-hours',
  templateUrl: 'hours.html'
})
export class HoursPage {
  locationHours = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {}

  ionViewDidLoad() {
    this.locationHours = this.navParams.data.locationHours;
  }

  dismissModal() {
    console.log("trying to dismiss");
    this.viewCtrl.dismiss();
  }

}
