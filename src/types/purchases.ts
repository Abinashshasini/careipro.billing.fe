export type TDistributor = {
  _id: number;
  distributor_name: string;
  mobile_number: string;
  gst_number: string;
  state: string;
  last_invoice_date?: string | null;
  last_invoice_no?: string | null;
  last_invoice_amount?: string | null;
};
