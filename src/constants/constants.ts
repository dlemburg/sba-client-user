/***
 *  Client constants
 */
export const ENV = { development: true };

// change this for each app deployment
export const COMPANY_OID = 1;

// Constant object
export const CONSTANT = {
    IS_STRIPE_LIVE: false,
    LIVE_SERVER: { NODE_JS: true },
    AWS_S3_URL: "https://s3-us-west-2.amazonaws.com/sba-static-assets",
    SERVER_URL_NODE: ENV.development ? 'http://localhost:2800' : 'http://sba-api-node-ts.vigueqqgxy.us-west-2.elasticbeanstalk.com',
    SERVER_URL_CSHARP: ENV.development ? 'http://localhost:2345' : 'http://sba-api-dotnet.us-west-2.elasticbeanstalk.com',
    TOKEN_NAME: "sba-user",
    PASSWORD_TYPES: {
        OWNER: "Owner",
        ADMIN: "Admin",
        PIN: "Pin"
    },
    REWARDS_PROCESSING_TYPE: {
        AUTOMATIC: "Automatic",
        MANUAL: "Manual"
    },
    REWARDS_DISCOUNT_RULE: {
        DATE_TIME_RANGE: "Date-Time-Range",
        PRODUCT: "Product"
    },
    REWARDS_DISCOUNT_TYPE: {
        MONEY: "Money",
        NEW_PRICE: "New Price",
        PERCENT: "Percent"
    },
    REWARDS_TYPES: {
        REWARDS_INDIVIDUAL: "rewards_individual",
        REWARDS_ALL: "rewards_all"
    },
    SOCIAL_MEDIA_TYPES: {
        TWITTER: "TWITTER",
        FACEBOOK: "FACEBOOK",
        INSTAGRAM: "INSTAGRAM"
    },
    APP_IMGS: {
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
    },
    APP_HOME_SUBTITLES: {
        0: "homeScreenMyMobileCardSubtitle",
        1: "homeScreenRewardsSubtitle",
        2: "homeScreenOrderAheadSubtitle",
        3: "homeScreenMenuSubtitle"
    },
    APP_HOME_IMGS: {
        0: 'homeMyCardImg',
        1: 'homeRewardsImg',
        2: 'homeOrderAheadImg',
        3: 'homeMenuImg',
    },
    SOCKET_EVENTS: {
        subscribe: "subscribe",
        unsubscribe: "unsubscribe",
        userPlacedNewOrder: "user-placed-new-order",
        incomingNewOrder: "incoming-new-order",
        alertUserProcessingOrder: "alert-user-processing-order",
        locationIsProcessingOrder: "location-is-processing-order"
    }
}

/*
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


export const CONST_APP_HOME_SUBTITLES = {
    0: "homeScreenMyMobileCardSubtitle",
    1: "homeScreenRewardsSubtitle",
    2: "homeScreenOrderAheadSubtitle",
    3: "homeScreenMenuSubtitle"
}

export const CONST_APP_HOME_IMGS = {
    0: 'homeMyCardImg',
    1: 'homeRewardsImg',
    2: 'homeOrderAheadImg',
    3: 'homeMenuImg',
}

*/
