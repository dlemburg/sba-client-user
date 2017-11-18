import { FormControl, FormGroup } from '@angular/forms';
import { IValidatorInfo } from '../interfaces/interfaces';

export class Validation {

    /* CONTROL MESSAGES IN VIEW */
    public static getValidatorErrorMessage(args: IValidatorInfo) {

        let len = args.validatorValue ? args.validatorValue.requiredLength : '';
        let options = args.validatorOptions ? args.validatorOptions : '';

        let props = {

            // general
            required: 'Required field',
            minlength: `Required length is ${len}`,
            maxlength: `Required length is ${len}`,
            isNumbersOnly: 'Numbers only',
            isLettersOnly: 'Letters only',
            isAboveZero: 'Must be higher than zero',
            isMoney: 'Please enter a valid money price',
            isInvalidCreditCard: 'Please enter a valid credit card number.',
            isInvalidEmailAddress: 'Please enter a valid email address',
            isInvalidPassword: 'Please enter a valid password',
            isNotUnique: `Sorry, this ${options} is not unique`,
            isCity: `Please enter a valid city`,
            isState: `Please enter a valid state`,
            isZipcode: `Please enter a valid zip code`,
            isPhoneNumber: `Please enter a valid phone number`,
            isStreetAddress: `Please enter a valid street address. Hint: special characters like  "."  and "#"  are not needed.`,
            isCreditCard: `Please enter a valid credit card`,
            isCreditCardCVC: `Invalid`,
            isCreditCardExpiryDate: `Please enter a valid credit card expiration date`,
            isEmail: `Please enter a valid email`,
            isYear: `Please enter a valid year`,
            isMonth: `Please enter a valid month`,

            // group
            isDiscountAmountInvalid: `This amount is invalid. Make sure your discount type aligns with the value you are entering. `,
            isMismatch: `${options} must match`,
            isLowerMustBeHigher: `${options} must be higher`,
            isInvalidDate: `${options} must be later than starting date`,
            isInvalidTime: `${options} must be later than starting time`,

            // async
            isEmailNotUnique: `Sorry, this email is already taken`,
            isNameNotUnique: `You already have a ${options} with this name`

        };
        return props[args.validatorProp];
    }


    private static validatorOptions(): any {
        return {
            email: 'email',
            product: 'product',
            calories: 'Calories High'
        }
    } 

    /* REGEX FOR VALIDATION.TEST() */
    private static regex(): any {
        return {
            isNumbersOnly: /^[0-9]+$/,
            isLettersOnly: /[a-zA-Z ]*/,
            isCreditCard: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
            isEmail: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/,
            isPhoneNumber: /^(([0-9]{1})*[- .(]*([0-9]{3})[- .)]*[0-9]{3}[- .]*[0-9]{4})+$/,
            isMoney: /^\d+(?:\.\d{0,2})?$/g,
            isCreditCardCVC: /^[0-9]{3,4}$/,
            isCreditCardExpiryDate: /^(0[1-9]|1[0-2])\/?(([0-9]{4}|[0-9]{2})$)/,
            isState: /^(?:A[KLRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|PA|RI|S[CD]|T[NX]|UT|V[AT]|W[AIVY])*$/,
            isZipcode: /^[0-9]{5}(?:-[0-9]{4})?$/,
            isCity: /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/,
            isMonth: /^(0?[1-9]|1[0-2])$/,
            isYear: /\d{4}/
        }
    }

    /* EXTRA VALIDATION CONTROL FOR DISPLAYING IN VIEW, BUT NOT SETTING ERRORS */
    public static doDisplayErrorsInView: any = {
        isCreditCardCVC: (value) => {
            if (value.length > 2 || isNaN(value)) return true;
            else return false;
        }
    }

    /* SOURCE OF TRUTH FOR ALMOST ALL VALIDATION */
    public static test(testType): any {
        return (control: FormControl) => {
            if (!control.value) return null;

            const test = Validation.regex()[testType];
            const str = control.value.toString();

            if (str.match(test)) return null;
            else return {[testType]: true};
        }
    }


    /*************************
     *                        *
     * SPECIALIZED VALIDATORS *
     *                        *
     *                        *
     ******************** *****/

    public static aboveZero(control: FormControl):any {
        if (control.value === 0 || control.value === "0") return {aboveZero: true};
        else return null;
    }

    public static isDiscountAmountInvalid(discountType, discountAmount): any {
        return (group: FormGroup) => {
            let amountCtrl = group.controls[discountAmount];
            let typeCtrl = group.controls[discountType];
            let err: any = true;

            if (amountCtrl.value === null) return null;

            switch(typeCtrl.value) {
                case 'Money':
                case 'New Price':
                    if (amountCtrl.value.match(/^\d+(?:\.\d{0,2})?$/)) err = null;
                    else err = { isDiscountAmountInvalid: true};
                    break;
                case 'Percent':
                    if (amountCtrl.value < 100 && amountCtrl.value.match(/^[0-9]+$/)) err = null;
                    else err = { isDiscountAmountInvalid: true};
                    break;
                case 'Points':
                    if (amountCtrl.value.match(/^[0-9]+$/)) err = null;
                    else err = { isDiscountAmountInvalid: true};
                    break;
                default:
                    err = null
                    break;
            }

            return amountCtrl.setErrors(err)
        }
    }


    /********************
     *                  *
     * GROUP VALIDATORS *
     *                  *
     *                  *
     ********************/

    // control1 === control2
    public static isMismatch(control1, control2): any {
        return (group: FormGroup) => {
            if (!group.controls[control1].value) return null;

            let a = group.controls[control1];
            let b = group.controls[control2];

            if (b.value !== a.value) b.setErrors({isMismatch: true, options: 'Passwords'}); 
            else return null;
        }
    }

    // control2 must be greater than control1
    public static isLowerMustBeHigher(control1, control2): any {
        return (group: FormGroup) => {
            if (!group.controls[control1].value) return null;

            let a = group.controls[control1];
            let b = group.controls[control2];
            let options = Validation.validatorOptions();
            let key = 'calories';   
                                        // sets errors on individual control b/c Validation is a group validator fn
                                        // calories high hardcoded for now
            if (Number(b.value) < Number(a.value)) return b.setErrors({isLowerMustBeHigher: true, options: options[key]});  //  return {isLowerMustBeHigher: true};
            else return null;
        }
    }

    // control2 must be a later date than control1
    public static isInvalidDate(control1, control2): any {
         return (group: FormGroup) => {
            if (!group.controls[control1].value) return null;

            let a = group.controls[control1];
            let b = group.controls[control2];
            //let date1 = new Date(a.value).getMilliseconds();  // start date
            //let date2 = new Date(b.value).getMilliseconds();  // end date

            if (b.value < a.value) return b.setErrors({isInvalidDate: true, options: "End Date"});  //  return {isLowerMustBeHigher: true};
            else return null;
        }
    }

    // control2 must be a later time than control1   (in string conver to number)
    public static isInvalidTime(control1, control2): any {
        return (group: FormGroup) => {
            if (!group.controls[control1].value) return null;

            let a = group.controls[control1];
            let b = group.controls[control2];

            let indexA: number = a.value.indexOf(":");
            let indexB: number = b.value.indexOf(":");

            let strA: string = a.value.slice(0, indexA);
            let strB: string = b.value.slice(0, indexB);

            if (+strB < +strA) return b.setErrors({isInvalidTime: true, options: "End time"});
            else return null;


        }
    }
}
