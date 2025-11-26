const BILLING_DASHBOARD_URL = 'billing-dashboard';
const BILLING_PURCHASE_URL = 'billing-purchase';

export const LOGIN_API = '/authentication/login';
export const GET_DISTRIBUTORS = `${BILLING_DASHBOARD_URL}/get-distributors`;
export const GET_DISTRIBUTOR_BYID = `${BILLING_DASHBOARD_URL}/get-distributor`;
export const ADD_DISTRIBUTOR = `${BILLING_DASHBOARD_URL}/add-distributor`;
export const UPDATE_DISTRIBUTOR = `${BILLING_DASHBOARD_URL}/update-distributor`;
export const DELETE_DISTRIBUTOR = `${BILLING_DASHBOARD_URL}/delete-distributor`;

export const CHECK_DUPLICATE_INVOICE = `${BILLING_PURCHASE_URL}/check-duplicate-invoice`;
export const CREATE_PURCHASE_ORDER = `${BILLING_PURCHASE_URL}/create-purchase-order`;
export const DELETE_PURCHASE_ORDER = `${BILLING_PURCHASE_URL}/delete-purchase-order`;
export const GET_PURCHASE_DETAILS_BY_ID = `${BILLING_PURCHASE_URL}/get-purchase-order`;
