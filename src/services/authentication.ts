import { Injectable } from '@angular/core';
import { CONSTANT } from '../constants/constants';
import { AuthUserInfo } from '../interfaces/interfaces';

/***
 * This service contains all auth-related methods, local storage persistent methods, etc.
 */
@Injectable()
export class Authentication {

    constructor() { }

    getCurrentUser(): AuthUserInfo {
        if (this.isLoggedIn()) {
            let token: any = this.getToken();
            let payload: AuthUserInfo = this.decodeToken(token);
           
            return {
                userOid: payload.userOid,
                pushToken: payload.pushToken || null,
                role: payload.role,
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email,
                companyOid: payload.companyOid || null,
                expiry: payload.expiry,
                companyName: payload.companyName,
                name: payload.firstName + payload.lastName
            };
        };
    }

    decodeToken(token): AuthUserInfo {
        let payload: any = token.split('.')[1];
        payload = window.atob(payload);
        payload = JSON.parse(payload);

        return payload;
    }

    saveToken(token) {
        window.localStorage[CONSTANT.TOKEN_NAME] = token;
    };

    getToken(): string {
        return window.localStorage[CONSTANT.TOKEN_NAME];
    };

    updateToken(token): void {
        window.localStorage.removeItem(CONSTANT.TOKEN_NAME);
        window.localStorage[CONSTANT.TOKEN_NAME] = token;
    };

    deleteToken(): void {
        if (this.getToken()) window.localStorage.removeItem(CONSTANT.TOKEN_NAME);
    };

    logout(): void {
        this.deleteToken();
    }

    isTokenValid(decodedToken) {
        if (decodedToken.expiry) {
            let now: number = new Date().getMilliseconds();
            let expiry: number = new Date(decodedToken.expiry).getMilliseconds();
            let nowSkew = now + 36000000;  // 60 mins

            if (nowSkew > expiry) return false;
            else return true;
        } else return true;
    }

    isLoggedIn() {
        let token: any = this.getToken();

        if (token) {
            // check expiry date
            let decodedToken = this.decodeToken(token);
            if (this.isTokenValid(decodedToken)) return true;
            else return false;
        }
        else return false;
    };
}