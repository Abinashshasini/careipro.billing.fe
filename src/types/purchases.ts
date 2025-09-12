export type TSupplier = {
  supplier_id: number;
  supplier_name: string;
  mobile_number: string;
  gst_number: string;
  last_invoice_date?: string | null;
  last_invoice_no?: string | null;
  last_invoice_amount?: string | null;
};
