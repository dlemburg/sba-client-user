import { Injectable } from '@angular/core';
import {AppDataService} from "./app-data.service";

@Injectable()
export class ImgService {

constructor() { }

    public static checkImgIsNull(value: any, key: string = "img") {
        if (Array.isArray(value)) {
            return value.map((x) => {
                if (x.hasOwnProperty("img")) {
                     if (!x[key]) x[key] = AppDataService.getDefaultImg; 
                     return x;
                }  
            });
        } else {
            if (!value) return AppDataService.getDefaultImg;
            else return value; 
        }
    }
}