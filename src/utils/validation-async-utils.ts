import { Injectable } from '@angular/core';
// import { FormControl, FormGroup } from '@angular/forms';
import { API } from '../services/api';

@Injectable()
export class AsyncValidation {

constructor(public API: API) { }

    // pattern to follow  (return promise)
/*   
     public isProductNameUniqueAsync(control: FormControl) {
       // insert api call here for promise
       // make generic function that passes in type into oData:  i.e. API.checkUnique('product')
       
        return new Promise(resolve => {
            setTimeout( () => {
                if (control.value.length > 2) {
                    if (control.value.toLowerCase() === "asdfsdf") {
                        resolve({
                            notUnique: true,    // adds this prop onto this.control.someFormName.errors
                            options: this.validatorOptions().product  // i.e. "product"
                        })
                    } else resolve(null);
                } else resolve(null);
            }, 2000);
        })
    }
*/
}