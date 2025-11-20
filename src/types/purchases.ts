export type TDistributor = {
  _id: string;
  distributor_name: string;
  mobile_number: string;
  gst_number: string;
  state: string;
  last_invoice_date?: string | null;
  last_invoice_no?: string | null;
  last_invoice_amount?: string | null;
  drug_license_number?: string | null;
  opening_balance?: number | null;
};
