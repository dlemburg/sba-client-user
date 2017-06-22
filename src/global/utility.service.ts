import { Injectable } from '@angular/core';

@Injectable()
export class UtilityService {
    constructor() { 
    }

    public static getDollarValues() {
        return [5, 10, 15, 20];
    }

    public static getEtas() {
        return [5, 10, 15, 30, 45];
    }

    public static getDays() {
        return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    }

    public static getNumbersList(len: number = 25): Array<number> {
        let arr = [];
        for (let i = 1; i < len + 1; i++) {
            arr.push(i);
        }
        return arr;
    }

    public static getStates(): Array<string> {
        return ['Alabama','Alaska','American Samoa','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Federated States of Micronesia','Florida','Georgia','Guam','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Marshall Islands','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Northern Mariana Islands','Ohio','Oklahoma','Oregon','Palau','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virgin Island','Virginia','Washington','West Virginia','Wisconsin','Wyoming']

    }

    public static toIso(date) {
        return new Date(date).toISOString()
    }

    public static toIsoDate(dateStr: string) {
        let date = new Date(dateStr);
        let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        let ISOtime = (new Date(date.getTime() - tzoffset)).toISOString().slice(0,-1); // gets rid of trailing Z

        return ISOtime;
    }

    public static getTodaysBeginningDate(): Date {
        let date = new Date();

        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(1);

        return new Date(date);
    }

    public static toArray(str: string): Array<any> {
        let arr = str.split(",");

        return arr;
    }

    public static arrayToString(arr: Array<any>): string {
        let str = arr.join(",");

        return str;
    }

    public static percentToString(percent: number, toFixed: number) {
       let str = (percent * 100).toFixed(toFixed).toString();
       let trailingZeroIndex = str.indexOf(".0");
       
       if (trailingZeroIndex > -1) str = str.slice(0, trailingZeroIndex);

       return str + "%";
    }

    public static round(num: number): number {
        return +(Math.round(num * Math.pow(10,2)) / Math.pow(10,2)).toFixed(2);
    }
}