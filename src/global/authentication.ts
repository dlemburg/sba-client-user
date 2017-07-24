import { Injectable } from '@angular/core';
import { CONST_TOKEN_NAME } from './global';
import { AuthUserInfo } from '../models/models';

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
                companyName: payload.companyName
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
        window.localStorage[CONST_TOKEN_NAME] = token;
    };

    getToken(): string {
        return window.localStorage[CONST_TOKEN_NAME];
    };

    updateToken(token): void {
        window.localStorage.removeItem(CONST_TOKEN_NAME);
        window.localStorage[CONST_TOKEN_NAME] = token;
    };

    deleteToken(): void {
        if (this.getToken()) window.localStorage.removeItem(CONST_TOKEN_NAME);
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