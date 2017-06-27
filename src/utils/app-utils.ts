import { Injectable } from '@angular/core';
import { AppData } from '../global/app-data.service';


// app specific utils
@Injectable()
export class AppUtils {
    constructor(public appData: AppData) { }

     public getDollarValues() {
        return [5, 10, 15, 20];
    }

    public getEtas() {
        return [5, 10, 15, 30, 45];
    }

    public getDays() {
        return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    }


    public getStates(): Array<string> {
        return ['Alabama','Alaska','American Samoa','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Federated States of Micronesia','Florida','Georgia','Guam','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Marshall Islands','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Northern Mariana Islands','Ohio','Oklahoma','Oregon','Palau','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virgin Island','Virginia','Washington','West Virginia','Wisconsin','Wyoming']

    }

    /*
    public checkImgIsNull(value: any, key: string = "img") {
        if (Array.isArray(value)) {
            return value.map((x) => {
                if (x.hasOwnProperty("img")) {
                     if (!x[key]) x[key] = this.appData.getImg().defaultImgSrc;
                     return x;
                }  
            });
        } else {
            if (!value) return this.appData.getImg().defaultImgSrc;
            else return value; 
        }
    }
    */
}
