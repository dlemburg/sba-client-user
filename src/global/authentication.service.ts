import { Injectable } from '@angular/core';
import { TOKEN_NAME } from './global';

import { IPayload, AuthUserInfo } from '../models/models';

@Injectable()
export class Authentication {

    constructor() { }

    getCurrentUser(): AuthUserInfo {
        if (this.isLoggedIn()) {
            let token: any = this.getToken();
            let payload: any = token.split('.')[1];
            payload = window.atob(payload);
            payload = JSON.parse(payload);

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

    saveToken(token): void {
        window.localStorage[TOKEN_NAME] = token;
    };

    getToken(): any {
        return window.localStorage[TOKEN_NAME];
    };

    updateToken(token): void {
        window.localStorage.removeItem(TOKEN_NAME);
        window.localStorage[TOKEN_NAME] = token;
    };

    deleteToken(): void {
        window.localStorage.removeItem(TOKEN_NAME);
    };

    logout(): void {
        this.deleteToken();
    }

    isLoggedIn() {
        let token: any = this.getToken();

        // if token is true, user is logged in -> then check date
        if (token) {
            // check expiry date
            return true;
        }
        else return false;
    };
}