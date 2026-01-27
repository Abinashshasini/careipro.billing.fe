// ===== BASE TYPES =====
export interface BaseEntity {
  _id: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

// ===== CUSTOMER TYPES =====
export interface TCustomer extends BaseEntity {
  customer_name: string;
  mobile_number: string;
  email_id?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  gst_number?: string | null;
  opening_balance?: number | null;
}

export type CustomerOption = SelectOption;

export interface TCustomerSummary {
  customer: TCustomer;
  sellOrders: Array<SellOrder>;
  sellSummary: {
    last_invoice: string | null;
    last_invoice_date: string | null;
    pending_amount: number;
    total_amount: number;
  };
}

// ===== SELL ORDER TYPES =====
export interface SellMedicine {
  id: string;
  medicine_id: string;
  med_name: string;
  batch: string;
  expiry_mm: string;
  expiry_yy: string;
  pack: string;
  qty: number | '';
  free: number | '';
  mrp: number | '';
  rate: number | '';
  disc: number | '';
  amount: number;
  margin: number;
  available_qty?: number;
}

export interface SellOrder extends BaseEntity {
  clinic_id: string;
  customer_id: string | null;
  customer_name: string;
  customer_mobile?: string | null;
  invoice_no: string;
  invoice_date: string;
  total_amount: number;
  total_item_count: number;
  payment_status: 'paid' | 'pending' | 'partial';
  payment_method: 'cash' | 'card' | 'upi' | 'bank_transfer' | 'other';
  amount_paid: number;
  amount_due: number;
  discount_amount: number;
  created_at?: string;
  updated_at?: string;
}

export interface SellOrderItem extends BaseEntity {
  sell_order_id: string;
  medicine_id: string;
  med_name: string;
  batch: string;
  expiry_mm: string;
  expiry_yy: string;
  pack: string;
  qty: number;
  free: number;
  mrp: number;
  rate: number;
  disc: number;
  amount: number;
  margin: number;
}

export interface SellData {
  customer_id: string | null;
  customer_name: string;
  customer_mobile?: string | null;
  invoice_no: string;
  invoice_date: string;
  payment_method: 'cash' | 'card' | 'upi' | 'bank_transfer' | 'other';
  amount_paid: number;
  discount_amount: number;
  total_amount: number;
  total_item_count: number;
  medicines: TransformedSellMedicine[];
}

export interface TransformedSellMedicine {
  medicine_id: string;
  med_name: string;
  batch: string;
  pack: string;
  expiry_mm: string;
  expiry_yy: string;
  qty: number;
  free: number;
  rate: number;
  mrp: number;
  disc: number;
  margin: number;
  amount: number;
}

export interface TSellInfo {
  customer_id: string | null;
  customer_name: string;
  customer_mobile: string;
  invoiceNo: string;
  invoiceDate: Date | null;
  paymentMethod: 'cash' | 'card' | 'upi' | 'bank_transfer' | 'other';
  discountAmount: number;
  amountPaid: number;
}

export interface SellTotals {
  totalAmount: number;
  totalItems: number;
  totalQuantity: number;
  discountAmount: number;
  amountDue: number;
  amountPaid: number;
}

// ===== PAYMENT TYPES =====
export interface PaymentData {
  payment_method:
    | 'cash'
    | 'card'
    | 'upi'
    | 'bank_transfer'
    | 'cheque'
    | 'other';
  amount: number;
  reference_number?: string;
  notes?: string;
}

// ===== COMPONENT PROPS =====
export interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: TCustomer | null;
  isEditMode?: boolean;
}

export interface CustomerListWrapperProps {
  selectedCustomerId: string | null;
  setSelectedCustomerId: React.Dispatch<React.SetStateAction<string | null>>;
  refreshCustomerList: number;
  openCustomerModal: () => void;
}

export interface SellInvoiceDetailsProps {
  selectedCustomerId?: string | null;
  refreshCustomerDetails?: number;
  onEditCustomer?: (customerData: TCustomer) => void;
  onDeleteSuccess?: () => void;
}

export interface CustomerCardProps {
  title: string;
  description: string;
  selected: boolean;
  address?: string;
  onClick?: () => void;
}

export interface SellMedicineListManagerProps {
  onMedicinesChange: (medicines: SellMedicine[]) => void;
  initialMedicines: SellMedicine[];
  isEditMode?: boolean;
}

export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (paymentData: PaymentData) => void;
  totalAmount: number;
  isLoading?: boolean;
}

// ===== API TYPES =====
export interface CheckDuplicateSellInvoiceParams {
  invoice_no: string;
}

export type DuplicateSellInvoiceResponse = ApiResponse<{
  isInvoiceAvailable: boolean;
}>;

export interface SaveSellResponse extends ApiResponse {
  success: boolean;
}

export type GetSellDetailsResponse = ApiResponse<{
  sell_order: SellOrder;
  sell_order_items: SellOrderItem[];
  total_items: number;
}>;
