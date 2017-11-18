import { Injectable } from '@angular/core';

/***
 * This service contains View-related notification data. Hard-coded strings, etc.
 */

@Injectable()
export class AppViewData {

constructor() { }

    private static toast = {
        defaultToastDuration: 5000,
        defaultToastPosition: "bottom",
        defaultErrorMessage: "Sorry, there was an unexpected error. We will work hard to get it fixed soon."
    }
    private static loading = {
        default: AppViewData.getLoadingInnerHtml(`Loading...`),
        saving: AppViewData.getLoadingInnerHtml(`Saving...`),
        processing: AppViewData.getLoadingInnerHtml(`Processing...`),
        complete: AppViewData.getLoadingInnerHtml(`Complete!`),
        saved: AppViewData.getLoadingInnerHtml(`Saved!`)
    }
    private static rewards = {
        rewardTypeIndividualMessage: "Just for you!"
    }
    private static popup = {
        defaultMissingInfoMessage: "Looks like you forgot to fill in everything!",
        defaultEditSuccessMessage: "Edit Successful",
        defaultSaveMessage: "Save Successful",
        defaultConfirmButtonText: "OK",
        defaultCancelButtonText: "Cancel",
        defaultSuccessTitle: "Success!",
        defaultErrorTitle: "Uh Oh!",
        defaultSuccessMessage: "Success!"
    }
    
    public static getPopup() {
        return AppViewData.popup;
    }

    public static getToast() {
        return AppViewData.toast;
    }

    public static getLoading() {
        return AppViewData.loading;
    }

    public static getRewards() {
        return AppViewData.rewards;
    }

    private static getLoadingInnerHtml(message) {
        return `<div class="custom-spinner-container">
                  <div class="custom-spinner-box">${message}</div>
                </div>`
    }
}