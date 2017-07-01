import { Injectable } from '@angular/core';


// general utils
@Injectable()
export class Utils {
    constructor() { 
    }

    public static getNumbersList(len: number = 25): Array<number> {
        let arr = [];
        for (let i = 1; i < len + 1; i++) {
            arr.push(i);
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
}