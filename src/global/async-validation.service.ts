import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { API, ROUTES } from './api.service';

@Injectable()
export class AsyncValidation {

constructor(public API: API) { }

    /*
    public isEmailNotUniqueAsync(control: FormControl): any {
        
        const email = control.value;

        if (email) {
            debugger;
            return this.API.stack(ROUTES.getEmailUnique + `/${email}`, "GET")
                .subscribe(
                    (response) => {
                        if (response.data.isUnique) {
                            return null;
                        } else return {isEmailNotUnique: true, options: "Email"}
                    }, (err) => {
                        console.log(err);
                        return null;
                    });
        }
    }
    */
}