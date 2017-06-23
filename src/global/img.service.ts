import { Injectable } from '@angular/core';
import {AppDataService} from "./app-data.service";

@Injectable()
export class ImgService {

constructor() { }

    // sets img to be default img or the img
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



/*
   // CORDOVA download from node server
   // x.imgSrc = x.img ? this.downloadImg(x.img) : null;

  downloadImg(obj, img, imgSrc) {
    console.log("ABOUT TO DOWNLOAD IMG"); 
    const fileTransfer: TransferObject = this.transfer.create();
    const imgName = obj[img];
    const url = ROUTES.downloadImg + `?img=${imgName}`;
    const dir = cordova.file.dataDirectory + `/${imgName}`;

    fileTransfer.download(url, dir).then((entry) => {
      console.log('download complete: ' + entry.toURL());
      obj[imgSrc] = entry.toURL();
      // return entry.toURL();
    }, (err) => {
      console.log("err: ", err);
     // const shouldPopView = false;
     // this.errorHandler.call(this, err, shouldPopView);
    });
  }
*/
