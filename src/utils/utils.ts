import { Injectable } from '@angular/core';
import { AppViewData } from '../global/app-data.service';

// general utils
@Injectable()
export class Utils {
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


    public static getStates(): Array<string> {
        return ['Alabama','Alaska','American Samoa','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Federated States of Micronesia','Florida','Georgia','Guam','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Marshall Islands','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Northern Mariana Islands','Ohio','Oklahoma','Oregon','Palau','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virgin Island','Virginia','Washington','West Virginia','Wisconsin','Wyoming']

    }

    public static getNumbersList(len: number = 25): Array<number> {
        let arr = [];
        for (let i = 1; i < len + 1; i++) {
            arr.push(i);
        }
        return arr;
    }

    public static getMonths(): Array<{num: number, displayNum: string, str: string}> {
        return [
            {num: 0, displayNum: "01", str: "January"},
            {num: 1, displayNum: "02", str: "February"},
            {num: 2, displayNum: "03", str: "March"},
            {num: 3, displayNum: "04", str: "April"},
            {num: 4, displayNum: "05", str: "May"},
            {num: 5, displayNum: "06", str: "June"},
            {num: 6, displayNum: "07", str: "July"},
            {num: 7, displayNum: "08", str: "August"},
            {num: 8, displayNum: "09", str: "September"},
            {num: 9, displayNum: "10", str: "October"},
            {num: 10, displayNum: "11", str: "November"},
            {num: 11, displayNum: "12", str: "December"},
        ];
    }

    public static getYears(start?: number, end?: number): Array<number> {
        start = start || new Date().getFullYear();
        end = end || start + 10;
        let arr = [];

        for (let x = start; x < end; x++) {
            arr = [...arr, x];
        }

        return arr;
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

    public static getImgs(arr) {
        if (arr.length) {
            arr.forEach((x) => {
                x.imgSrc = AppViewData.getDisplayImgSrc(x.img);
            });
            return arr;
        } else return [];
    }
}