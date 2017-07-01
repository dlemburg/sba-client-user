import { Component } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams } from 'ionic-angular';
import {
 GoogleMaps,
 GoogleMap,
 GoogleMapsEvent,
 LatLng,
 CameraPosition,
 MarkerOptions,
 Marker
} from '@ionic-native/google-maps';


@IonicPage()
@Component({
  selector: 'page-locations-map',
  templateUrl: 'locations-map.html',
})
export class LocationsMapPage {
  selectedLocation: any;
  locations: Array<any>;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public platform: Platform,     
    public googleMaps: GoogleMaps) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationsMapPage');
    this.selectedLocation = this.navParams.data.selectedLocation; // used for zoom
    this.locations = this.navParams.data.locations; // used for pinning all others


    console.log("location: ", this.selectedLocation);
    console.log("locations: ", this.locations);

  }

  ngAfterViewInit() {
    this.platform.ready().then(() => {
      this.loadMap();
    });
  }

  loadMap() {
    let element: HTMLElement = document.getElementById('map');
    let map: GoogleMap = this.googleMaps.create(element);

   // const isAvailable = this.googleMaps.isAvailable();
    map.one(GoogleMapsEvent.MAP_READY).then(() => {
        console.log('Map is ready!');
         
        let initialZoomLatAndLong: LatLng = new LatLng(this.selectedLocation.coordsLat, this.selectedLocation.coordsLong);
        let position: CameraPosition = {
          target: initialZoomLatAndLong,
          zoom: 18,
          tilt: 30
        };
        map.moveCamera(position);


        this.locations.forEach((x) => {
          let locationLatAndLong: LatLng = new LatLng(x.coordsLat, x.coordsLong);

          let markerOptions: MarkerOptions = {
            position: locationLatAndLong,
          // title: this.location.name.
          };

          map.addMarker(markerOptions).then((marker: Marker) => {
            console.log("marker: ", marker);
              marker.showInfoWindow();
            });
          });
        });
 }
}
