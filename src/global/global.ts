// client ops constants
export const env = { development: true };
export const SERVER_URL_NODE = env.development ? 'http://localhost:2800' : '';
export const SERVER_URL_CSHARP = env.development ? 'http://localhost:2345' : '';
export const TOKEN_NAME = "sba-user";


// app constants
export const PASSWORD_TYPES = {
    OWNER: "Owner",
    ADMIN: "Admin",
    PIN: "Pin"
}

export const COMPANY_DETAILS = {
    HAS_DAIRY: false,
    HAS_VARIETY: false,
    HAS_SWEETENER: false,
    HAS_FLAVORS: false,
    HAS_ADDONS: false
  }