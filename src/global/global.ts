// client ops constants
export const ENV = { development: true };
export const SERVER_URL_NODE = ENV.development ? 'http://localhost:2800' : '';
export const SERVER_URL_CSHARP = ENV.development ? 'http://localhost:2345' : '';
export const CONST_TOKEN_NAME = "sba-user";


// app constants
export const CONST_PASSWORD_TYPES = {
    OWNER: "Owner",
    ADMIN: "Admin",
    PIN: "Pin"
}

export const CONST_REWARDS_PROCESSING_TYPE = {
    AUTOMATIC: "Automatic",
    MANUAL: "Manual"
};
export const CONST_REWARDS_DISCOUNT_RULE = {
    DATE_TIME_RANGE: "Date-Time-Range",
    PRODUCT: "Product"
};
export const CONST_REWARDS_DISCOUNT_TYPE = {
    MONEY: "Money",
    NEW_PRICE: "New Price",
    PERCENT: "Percent"
}
export const CONST_REWARDS_TYPES = {
    REWARDS_INDIVIDUAL: "rewards_individual",
    REWARDS_ALL: "rewards_all"
}

export const CONST_SOCIAL_MEDIA_TYPES = {
    TWITTER: "TWITTER",
    FACEBOOK: "FACEBOOK",
    INSTAGRAM: "INSTAGRAM"
};


// should use enum for this
export const CONST_APP_IMGS = {
    0: 'homeMyCardImg',
    1: 'homeRewardsImg',
    2: 'homeOrderAheadImg',
    3: 'homeMenuImg',
    4: 'logoImg',
    5: 'appHeaderBarImg',
    6: 'defaultImg',
    7: 'rewardsPageImg',
    8: 'loginPageBackgroundImg',
    9: 'orderCompleteBackgroundImg',
    10: 'orderCompleteMiddleOfPageImg',
    11: 'mobileCardImg',
    12: 'addedToCartBackgroundImg'
}

