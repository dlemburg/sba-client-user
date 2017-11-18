export interface ILocation {

}

export interface ICard {

}

export interface IPayload {
    userOid: number;
    pushToken: string;
    role: string;
    name: string;
    email: string;
    companyOid: number;
}

export interface IOwnerAlert {
    type: string;
    headline: string;
    description: string;
    img: string;
}

export interface IOrder {
    purchaseItems: Array<IPurchaseItem>;
    transactionDetails: ITransactionDetails;
}

export interface ITransactionDetails {
    purchaseDate?: string|Date;
    location?: string;
    isRewardUsed: boolean;
    isRewardAllUsed: boolean;
    isRewardIndividualUsed: boolean;
    isOrderAhead?: boolean;
    rewards: Array<any>;   // just give them brief description here -> can click on it
    subtotal: number;
    total: number;
    taxes: number;
    rewardsSavings: number;
    isSocialMediaUsed: boolean;
    lkpSocialMediaTypeOid: number;
    socialMediaDiscountAmount: number;
    isEdited: boolean;
    editAmount: number;
    reasonsForEdit: Array<string>;
    oldPrice: number;
    newPrice: number;
}

export interface ICompanyDetailsForProcessOrder {
    HAS_SOCIAL_MEDIA: boolean;
    ACCEPTS_PARTIAL_PAYMENTS: boolean;
    SOCIAL_MEDIA_DISCOUNT_AMOUNT: number;
    TAX_RATE: number;
    DOES_CHARGE_FOR_ADDONS: boolean;
    ALLOWS_COMMENTS_ON_ORDER_AHEAD: boolean;
}


export interface ProductDetails {
    name: string;
    oid: number;
    categoryOid: number;
    caloriesLow: number,
    caloriesHigh: number,
    sizesAndPrices: Array<any>,
    fixedPrice: number,
    addons: Array<any>,
    flavors: Array<any>,
    dairy: Array<any>;
    sweetener: Array<any>;
    variety: Array<any>;
    img: string,
    imgSrc?: string;
    numberOfFreeAddonsUntilCharged: number;
    addonsPriceAboveLimit: number;
  };

export interface IPurchaseItem {
    selectedProduct: {oid: number, name: string};
    sizeAndOrPrice: {oid?: number, name?: string, price: number};
    quantity: number;
    addons?: Array<any>;
    flavors?: Array<any>;
    dairy?: Array<any>;
    sweetener?: Array<any>;
    variety?: Array<any>;
    addonsCost?: number;
    dairyCost?: number;
    discounts?: number;
    displayPriceWithoutDiscounts?: number;
}

export interface AuthUserInfo {
    userOid: number;
    pushToken?: string;
    role: string;
    firstName: string;
    lastName: string;
    email: string;
    expiry: string;
    companyOid?: number;
    companyName: string;
    name?: string;
}

export interface IReward {
    isAllowedOnOrderAhead: boolean;
}

export interface IContactInfo {
    phoneNumber: string;
    address: string;
    city: string;
    state: string;
    zipcode: number;
    email: string;
}

export interface Ihttp {
    route: string;
    method: string;
    oData?: Object;
}

export interface IValidatorInfo {
    validatorProp: string
    validatorValue?: any;   // will be object
    validatorOptions?: string;
}

export interface IErrChecks {
    errs: Array<any>;
    isValid: boolean;
}

export interface ITotals { 
    subtotal: number;
    rewardsDiscounts: number;
    taxes: number;
    total: number;
}

export interface IPopup {
    title: string;
    subTitle?: string;
    message: string;
    inputs?: any;
    buttons: Array<any>;
    enableBackdropDismiss?: boolean
}

export interface ICurrentDateInfo {
    date: Date;
    hours: number;
    mins: number;
    day: number;
}



export interface SocketEvents {
    subscribe: string;
    unsubscribe: string;
    userPlacedNewOrder: string;  // user emit
    incomingNewOrder: string;    // location listener
    alertUserProcessingOrder: string;  // user listener
    locationIsProcessingOrder: string;  // location emit
}



export interface IErrorHandlerOpts {
  shouldPopView?: boolean
  shouldDismissLoading?: boolean
}

export interface ICompanyDetails {
    doesChargeForDairy?: boolean;
    doesChargeForAddons?: boolean;
    hasDairy?: boolean;
    hasVariety?: boolean;
    hasSweetener?: boolean;
    hasAddons?: boolean;
    hasFlavors?: boolean;
    acceptsPartialPayments?: boolean;
    taxRate?: number;
    hasPrinter?: boolean;
    hasSocialMediaRewards?: boolean;
    hasFacebook?: boolean;
    hasTwitter?: boolean;
    hasInstagram?: boolean;
    socialMediaPointsBonus?: boolean;
    socialMediaMessageFacebook?: string;
    socialMediaMessageTwitter?: string;
    socialMediaMessageInstagram?: string;
    socialMediaImg?: string;
    allowsCommentsOnOrderAhead?: boolean; 
}


export interface ILogError {
    date: string;
    timezoneOffset: number;
    app: string;
    type: string;
    companyOid: number;
    userOid: number;
    err: string;
    url: string;
    httpVerb: string;
}

export interface IClientUserAppStartupInfoResponse {
    logoImg: string;
    defaultImg: string;
    currentClientUserVersionNumber: number;
    minClientUserVersionNumber: number;
    mustUpdateClientUserApp: boolean;
  }
  