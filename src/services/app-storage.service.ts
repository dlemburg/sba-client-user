import { Injectable } from '@angular/core';
import { CONSTANT } from "../constants/constants";

/***
 * This service holds any non-local, client-only global storage persistent data 
 * NOTE: checkout-persisted-data is kept in its own service
 */
@Injectable()
export class AppStorage {
    public static img = {
        defaultImgSrc: "",
        logoImgSrc: null
    }
    constructor() { }
    // if img == null, set imgSrc to the default img
    public static getDisplayImgSrc(img: string = null): string {
        const defaultImgSrc = AppStorage.getImg().defaultImgSrc;
        // const imgSrc = img ? `${ROUTES.downloadImg}?img=${img}` : defaultImgSrc;
        const imgSrc = img ? `${CONSTANT.AWS_S3_URL}/imgs/${img}` : defaultImgSrc;
    
        return imgSrc;
    }

    public static getImg() {
        return AppStorage.img;
    }

    public static setImgs(args) {
        AppStorage.img = {
            defaultImgSrc: args.defaultImgSrc,
            logoImgSrc: args.logoImgSrc
        };
    }
}