import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import * as global from './global';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Authentication } from '../global/authentication.service';
import { Ihttp } from '../models/models';

@Injectable()
export class API {
    /*  might need this for c# auth???
    contentHeaders.append('Accept', 'application/json');
    contentHeaders.append("Authorization", "Bearer " + token));
    contentHeaders.append('X-Requested-With',	'XMLHttpRequest');
            // this.headers.append( 'Content-Type', 'application/json' )

    */

    headers = new Headers({ 'Content-Type': 'application/json' }); 
    options = new RequestOptions({ headers: this.headers });
    
    constructor(private http: Http) {}

  
    public stack(route: string, verb: string, body: any = {}): Observable<any> {
      //  let {toData, method, route} = args;

        let url: string = route.indexOf('/api/node/') > -1 ? global.SERVER_URL_NODE : global.SERVER_URL_CSHARP;
            url += route;
        const httpVerb = verb.toLowerCase();
        const options = this.options;

        if (httpVerb === "post") {
            return this.http[httpVerb](url, body, options)
                    .map((response: Response) => response.json())
                    .catch(this.errorHandler);
        } else if (httpVerb === "get") {
            return this.http[httpVerb](url, options)
                    .map((response: Response) => response.json())
                    .catch(this.errorHandler);
        }
    }

    private errorHandler(err = 'ERROR! No stack trace given'): any {        
        //console.error('Documenting the error from the http service!');
        throw err;
    }
}



/////*****************************  ROUTES  ******************************///////

// all API routes

// api | server: cs?node | controller | action
export const ROUTES = {

    // MOST OF THESE ARE 'POSTS' FOR SECURITY
    // auth
    loginUser: '/api/cs/auth/loginUser',
    registerUser: '/api/cs/auth/registerUser',
    confirmPassword: '/api/cs/auth/confirmPassword',
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
    getLocations: '/api/cs/shared/getLocations',
    getRewardDetails: '/api/cs/user/getRewardDetails',
    getCompanyContactInfo: '/api/cs/shared/getCompanyContactInfo',
    getEmailUnique: '/api/cs/auth/getEmailUnique',


    getCompanyDetailsForTransaction: '/api/cs/shared/getCompanyDetailsForTransaction',
    getCompanyDetails: '/api/cs/shared/getCompanyDetails',
    getEligibleRewardsProcessingTypeAutomaticForTransaction: '/api/cs/rewards/getEligibleRewardsProcessingTypeAutomaticForTransaction',
    processTransaction: '/api/cs/shared/processTransaction',


    generateRewardOnFirstMobileCardUpload: '/api/cs/user/generateRewardOnFirstMobileCardUpload',
    forgotPassword: '/api/node/emails/forgotPassword',

    // TODO
    getUserPaymentID: '/api/cs/user/getUserPaymentID',

    // node (do last)
    reportIssue: '/api/node/users/reportIssue',
    contactCompany: '/api/node/emails/contactCompany',
    deleteCard: '/api/cs/stripe/deleteCard',
    submitPaymentDetails: '/api/node/stripe/submitPaymentDetails',
    addCard: '/api/node/stripe/addCard',
    addCardValue: '/api/node/stripe/addCardValue',
    getCardNumberLastFourDigits : '/api/node/stripe/getCardNumberLastFourDigits',
    deleteCreditCard: '/api/node/stripe/deleteCreditCard',
    

}