import { Injectable } from '@angular/core';
import { ICurrentDateInfo } from '../models/models';


// date-utils
@Injectable()
export class DateUtils {

constructor() { }

     // i.e.:  "09:00am" ->  9
    public static convertTimeStringToHours(timeString: string): number {
        let time = DateUtils.sliceZero(timeString);
        let hours = DateUtils.getHours(time);

        return hours;
    }
    
    // i.e.:  "09:30am" -> 30
    public static convertTimeStringToMinutes(timeString: string): number {
        return DateUtils.getMinutes(timeString);
    }

     // i.e.: "18:00pm" -> "6:00pm""
    public static convertMilitaryTimeStringToNormalTimeString(timeString: string): string {
        const str = DateUtils.sliceZero(timeString);
        const timeStringArr = timeString.split(":");
        const militaryHours = +timeStringArr[0];
        
        const amOrPm = DateUtils.getAmOrPm(militaryHours)
        const normalHours = DateUtils.to12Hour(militaryHours);
        const minutes = DateUtils.prependZero(+timeStringArr[1]);

        return `${normalHours}:${minutes}${amOrPm}`
    }

    public static getAmOrPm(hours) {
        if (hours === 0 || hours === 24) return "am";
        else return hours < 12 ? "am" : "pm";
    }

    // i.e.: "09:00am" ->  Date ['2017-07-10T09:00:00.000Z']
    public static convertTimeStringToJavascriptDate(timeString: string): Date {
        const hours = DateUtils.convertTimeStringToHours(timeString);
        const minutes = DateUtils.getMinutes(timeString);

        return new Date(new Date().setHours(hours, minutes, 0, 0));
    }

    // comes in as military hours, keeps as military hours
    public static convertTimeStringToIsoString(timeString: string): string {
        let time = DateUtils.sliceZero(timeString);
        let hours = DateUtils.getHours(time);
        let minutes = DateUtils.getMinutes(time);
        let dateStr = DateUtils.toLocalIsoString(new Date(new Date().setHours(hours, minutes, 0)).toString());
        return dateStr;
    }

    public static millisecondsToMinutes(millis): number {
        return Math.floor(millis / 60000);
    }

    // i.e.: ISOString ->  "09:30am"  
    // keeps in military hours
    public static convertIsoStringToHoursAndMinutesString(IsoString: string): string {
        
        // DateUtils accounts for closed days. should not be apart of re-usable utility fn
        if (IsoString === "closed" || IsoString === "Closed") return IsoString;

        const date = new Date(IsoString);
        const minutes = DateUtils.prependZero(date.getMinutes());
        const militaryHours = date.getHours();
        let amOrPm = "";

        if (militaryHours >= 12) amOrPm = "pm";
        else if (militaryHours === 0 || militaryHours < 12) amOrPm = "am";


        return `${militaryHours}:${minutes}${amOrPm}`
    }

    // gets all relevant date information about client to send to server
    public static getCurrentDateInfo(): ICurrentDateInfo {
        let date = new Date();

        let hours = date.getHours();
        let mins = date.getMinutes();
        let day = date.getDay();

        return {date, hours, mins, day};
    }

    // accounts for timezone offset and converts to ISOString format
    public static toLocalIsoString(dateStr: string) {
        let date = new Date(dateStr);
        let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        let ISOtime = (new Date(date.getTime() - tzoffset)).toISOString().slice(0,-1); // gets rid of trailing Z

        return ISOtime;
    }

    // prepends ISOString type data at beginning
    public static patchStartTime(time: string): string {
        return time + "T00:00:00.000Z";
    }

    // appends ISOString type data to end
    public static patchEndTime(time: string): string {
        return time + "T23:59:59.000Z";
    }

    // gets rid of prefix zero   i.e. "09:00" ->  "9:00"
    public static sliceZero(time: string): string {
        if (time.indexOf("0") === 0) {
            time = time.slice(1, time.length);
        }
        return time;
    }

    public static prependZero(time: number): string {
        if (time < 10) return "0" + time;
        else return time.toString();
    }

    // converts military to 12 hour
    public static to12Hour(time: number): number {
        if (time > 12) time = time - 12;
        if (time === 0) time = 12;

        return time;
    }

    // converts normal time to military time
    public static to24Hour(hours:string, isPm:boolean): number {
        let time = +hours;
        if (!isPm && time === 12) return 0;  // midnight
        else if (isPm && time !== 12) return time + 12;
        else return time;
    }


    public static getTodaysBeginningDate(): Date {
        let date = new Date();

        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(1);

        return new Date(date);
    }


    // converts timeString   "09:00" ->  9
    public static getHours(time:string): number {
        let index = time.indexOf(":");
        let isPm = time.indexOf("a") < 0 ? true : false;

        let hours = time.slice(0, index);
    
        return +hours;
    }

    // gets minutes from timeString   i.e.  "09:30"  ->  30
    public static getMinutes(time:string): number {
        let start = time.indexOf(":") + 1;
        //let amOrPm = time.indexOf("m");
        let minutes = time.slice(start, -2);

        return +minutes;
    }

}