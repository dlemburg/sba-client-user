import { Injectable, ErrorHandler } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import * as global from './global';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { Authentication } from '../global/authentication';
import { Ihttp, AuthUserInfo, ILogError } from '../models/models';
import { DateUtils } from '../utils/date-utils';

@Injectable()
export class API implements ErrorHandler {
    auth: AuthUserInfo = this.authentication.getCurrentUser();
    token;
    headers;
    options;
    logErrorAttempts: number = 0;

    constructor(private http: Http, private authentication: Authentication) {

    }
  
    public stack(route: string, verb: string, body: any = {}): Observable<any> {
        this.auth =  this.authentication.getCurrentUser();
        this.token = this.authentication.getToken();
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${this.token}`);
        let options = new RequestOptions({ headers: headers });


        /*
            .NET server is fine with Authorization being set as a header on GET requests,
            Node.js server is not. So anytime I need to verify token on GET request for node 
            server, i'll have to send it as a query param, and access it on server side as req.query (or params?).
            this means i'll have to add one more layer of abstraction here to account for it, as well as 
            auth middleware on server side to account for GET -> req.query (or params?)  vs  POST req.headers

        */
        let isOnline = window.navigator.onLine;
        let url: string = route.indexOf('/api/node/') > -1 ? global.SERVER_URL_NODE + route : global.SERVER_URL_CSHARP + route;
        const httpVerb = verb.toLowerCase();

        if (httpVerb === "post") {
            return this.http[httpVerb](url, body, options)
                    .map((response: Response) => response.json())
                    .catch((err) => {
                        if (!isOnline) return Observable.throw("NOT_ONLINE")
                        else {
                            this.logError({err, url, httpVerb, type: "API"});
                            return Observable.throw(err);
                        }
                    });
        } else if (httpVerb === "get") {
            return this.http[httpVerb](url, options)
                    .map((response: Response) => response.json())
                    .catch((err) => {
                        if (!isOnline) return Observable.throw("NOT_ONLINE")
                         else {
                             this.logError({err, url, httpVerb, type: "API"});
                             return Observable.throw(err);
                         }
                    });
        }
    }

    public isTokenCredentialsRevoked(err) {
        if (err && err.status && (err.status === 401 || err.status === 403)) {
            return true;
        } else return false;
    }


    /* these error handlers don't interact with the view. when they are done, they forward error to view-error-handler
        in BaseViewController
    */

    public handleError(err: any) {
            console.log(" %c ERROR (app-wide logger): "  + err, "color: red;");

            if (!global.ENV.development) {
                this.logError({type: "Javascript runtime error!", err})
            }
        }

    public logError(args?): any {  
        let err = args.err;
        if (args.type === "API") console.log("%c ERROR (api): " + args.err._body, "color: red;");

        //if (!global.ENV.development) {
        if ((args.err.status === 0 && args.type === "API") || args.type !== "API") {
            err = "ERR_CONNECTION_REFUSED";
            // escape guard
            if (this.logErrorAttempts === 1 && args.type === "API") {
                this.logErrorAttempts = 0;
                return;
            }
            else this.logErrorAttempts++;

            const toData: ILogError = {
                err: err || null,
                url: args.url || null,
                httpVerb: args.httpVerb || null,
                date: DateUtils.toLocalIsoString(new Date().toString()),
                timezoneOffset: new Date().getTimezoneOffset() / 60,
                app: "Client-User",
                type: args.type || null,
                companyOid: this.authentication.isLoggedIn() ? this.auth.companyOid : null,
                userOid: this.authentication.isLoggedIn() ? this.auth.userOid : null
            }      

            this.stack(ROUTES.logClientError, "POST", toData).subscribe((response) => {
                console.log("response: ", response);
                if (args.type === "API") return;
            }, (err) => {
                console.log("error sending client err to server");
            });
        }

    }
}



/////*****************************  ROUTES  ******************************///////


// api | server: cs?node | controller | action
export const ROUTES = {

    // MOST OF THESE ARE 'POSTS' FOR SECURITY
    // auth
    loginUser: '/api/cs/auth/loginUser',
    registerUser: '/api/cs/auth/registerUser',
    confirmPassword: '/api/cs/auth/confirmPassword',
    confirmEmailAndPassword: '/api/cs/auth/confirmEmailAndPasswordUser',
    savePassword: '/api/cs/auth/savePassword',
    getUserTransactionHistory: '/api/cs/user/getUserTransactionHistory',
    getMyCardImg: '/api/cs/user/getMyCardImg',
    getBalance: '/api/cs/user/getBalance',
    getPointsAndPointsNeeded: '/api/cs/user/getPointsAndPointsNeeded',
    // saveContact: '/api/cs/user/saveContact',    // don't know what this is used for
    getUserAccountDetails: '/api/cs/user/getUserAccountDetails',
    editUserAccountDetails: '/api/cs/user/editUserAccountDetails',
    getRewards: '/api/cs/user/getRewards',
    getCategories: '/api/cs/shared/getCategories',
    getProducts: '/api/cs/shared/getProducts',
    getProductDetails: '/api/cs/shared/getProductDetails',
    getLocations: '/api/cs/shared/getLocationsShared',
    getRewardDetails: '/api/cs/user/getRewardDetails',
    getCompanyContactInfo: '/api/cs/shared/getCompanyContactInfo',
    getEmailUnique: '/api/cs/auth/getEmailUnique',
    getCompanyDetailsForTransaction: '/api/cs/shared/getCompanyDetailsForTransaction',
    getCompanyDetails: '/api/cs/shared/getCompanyDetails',
    getEligibleRewardsProcessingTypeAutomaticForTransaction: '/api/cs/rewards/getEligibleRewardsProcessingTypeAutomaticForTransaction',
    processTransaction: '/api/cs/shared/processTransaction',
    forgotPassword: '/api/node/emails/forgotPassword',
    reportIssue: '/api/node/users/reportIssue',
    contactCompany: '/api/node/emails/contactCompany',
    getCompanyDetailsAndSocialMediaLkps: '/api/cs/user/getCompanyDetailsAndSocialMediaLkps',
    editPassword: '/api/cs/auth/editPassword',


    // check these 
    generateRewardOnFirstMobileCardUpload: '/api/cs/user/generateRewardOnFirstMobileCardUpload',
    getUserMobileCardId: '/api/cs/user/getUserMobileCardId',
    getMobileCardIdLastFourDigits : '/api/cs/user/getMobileCardIdLastFourDigits',
    getHomePageImgs: '/api/cs/user/getHomePageImgs',
    downloadImg: `${global.SERVER_URL_NODE}/api/node/download/img`,
    getImgName: `/api/cs/shared/getImgName`,
    getImgsOnAppStartup: `/api/cs/shared/getImgsOnAppStartup`,
    getLocationsFilterByGps: `/api/cs/shared/getLocationsFilterByGps`,
    getBalanceAndHasMobileCard: `/api/cs/user/getBalanceAndHasMobileCard`,


    // node stripe
    getStripePublishableKey: `/api/node/financial/getStripePublishableKey`,
    addCreditCard: '/api/node/financial/addCreditCard',
    deleteCard: '/api/node/financial/deleteCard',
    addMobileCardValue: '/api/node/financial/addMobileCardValue',

    // error logging
    logClientError: '/api/node/errorHandler/logClientError', // cs call built too
    getHomePageInfo: '/api/cs/user/getHomePageInfo',
    getClientUserVersionNumber: '/api/cs/appData/getClientUserVersionNumber',
    getClientUserAppStartupInfo: '/api/cs/user/getClientUserAppStartupInfo',
    testNode: '/api/node/appData/test',
    testDotnet: '/api/cs/appData/test'

}