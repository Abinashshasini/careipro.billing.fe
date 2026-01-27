const BILLING_DASHBOARD_URL = 'distributor';
const BILLING_PURCHASE_URL = 'purchase';
const BILLING_MEDICINE_URL = 'medicine';
const BILLING_STOCK_URL = 'stock';
const BILLING_CUSTOMER_URL = 'customer';
const BILLING_SELL_URL = 'sell';

export const LOGIN_API = '/authentication/login';

// Distributor APIs
export const GET_DISTRIBUTORS = `${BILLING_DASHBOARD_URL}/get-distributors`;
export const GET_DISTRIBUTOR_BYID = `${BILLING_DASHBOARD_URL}/get-distributor`;
export const ADD_DISTRIBUTOR = `${BILLING_DASHBOARD_URL}/add-distributor`;
export const UPDATE_DISTRIBUTOR = `${BILLING_DASHBOARD_URL}/update-distributor`;
export const DELETE_DISTRIBUTOR = `${BILLING_DASHBOARD_URL}/delete-distributor`;

// Purchase APIs
export const CHECK_DUPLICATE_INVOICE = `${BILLING_PURCHASE_URL}/check-duplicate-invoice`;
export const CREATE_PURCHASE_ORDER = `${BILLING_PURCHASE_URL}/create-purchase-order`;
export const DELETE_PURCHASE_ORDER = `${BILLING_PURCHASE_URL}/delete-purchase-order`;
export const GET_PURCHASE_DETAILS_BY_ID = `${BILLING_PURCHASE_URL}/get-purchase-order`;
export const UPDATE_PURCHASE_ORDER = `${BILLING_PURCHASE_URL}/update-purchase-order`;

// Medicine APIs
export const SEARCH_MEDICINES = `${BILLING_MEDICINE_URL}/search-medicine`;
export const SEARCH_MEDICINES_STOCK = `${BILLING_STOCK_URL}/search-medicine-in-stock`;

// Customer APIs
export const GET_CUSTOMERS = `${BILLING_CUSTOMER_URL}/get-customers`;
export const GET_CUSTOMER_BYID = `${BILLING_CUSTOMER_URL}/get-customer`;
export const ADD_CUSTOMER = `${BILLING_CUSTOMER_URL}/add-customer`;
export const UPDATE_CUSTOMER = `${BILLING_CUSTOMER_URL}/update-customer`;
export const DELETE_CUSTOMER = `${BILLING_CUSTOMER_URL}/delete-customer`;

// Sell APIs
export const CHECK_DUPLICATE_SELL_INVOICE = `${BILLING_SELL_URL}/check-duplicate-invoice`;
export const CREATE_SELL_ORDER = `${BILLING_SELL_URL}/create-sell-order`;
export const DELETE_SELL_ORDER = `${BILLING_SELL_URL}/delete-sell-order`;
export const GET_SELL_DETAILS_BY_ID = `${BILLING_SELL_URL}/get-sell-order`;
export const UPDATE_SELL_ORDER = `${BILLING_SELL_URL}/update-sell-order`;
