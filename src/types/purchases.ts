// ===== BASE TYPES =====
export interface BaseEntity {
  _id: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

// ===== DISTRIBUTOR TYPES =====
export interface TDistributor extends BaseEntity {
  distributor_name: string;
  mobile_number: string;
  gst_number: string;
  state: string;
  email_id?: string | null;
  address?: string | null;
  district?: string | null;
  drug_license_number?: string | null;
  last_invoice_date?: Date | null;
  last_invoice_no?: number | null;
  current_balance?: number | null;
  opening_balance?: number | null;
}

export type DistributorOption = SelectOption;

export interface TDistributorSummary {
  distributor: TDistributor;
  purchaseOrders: Array<PurchaseOrder>;
  purchaseSummary: {
    last_invoice: string | null;
    last_invoice_date: string | null;
    pending_amount: number;
    total_amount: number;
    pending_amount_color?: string;
  };
}

// ===== MEDICINE TYPES =====
export interface BaseMedicine {
  med_name: string;
  batch: string;
  expiryMM: string;
  expiryYY: string;
  pack: string;
  qty: number | '';
  free: number | '';
  mrp: number | '';
  rate: number | '';
  disc: number | '';
}

export interface TMedicine extends BaseMedicine {
  id: string;
  amount: number;
  margin: number;
}

export type TMedicineFormData = BaseMedicine;

export interface TransformedMedicine {
  med_name: string;
  batch: string;
  pack: string;
  expiry_mm: string | null;
  expiry_yy: string | null;
  qty: number;
  free: number;
  rate: number;
  mrp: number;
  disc: number;
  margin: number;
  amount: number;
}

// ===== PURCHASE ORDER TYPES =====
export interface BasePurchaseOrder {
  distributor_id: string;
  invoice_no: string;
  invoice_date: string;
  payment_due_date: string;
  total_amount: number;
  total_item_count: number;
}

export interface PurchaseOrder extends BaseEntity, BasePurchaseOrder {
  clinic_id: string;
  payment_status: string;
  payment_summary: {
    status: string;
    color: string;
  };
}

export interface PurchaseOrderDetails extends BaseEntity, BasePurchaseOrder {
  clinic_id: string;
  payment_status: string;
  status: string;
}

export interface PurchaseOrderItem extends BaseEntity {
  purchase_order_id: string;
  batch: string;
  medicine_id: string;
  med_name: string;
  expiry_mm: string;
  expiry_yy: string;
  qty: number;
  pack: string;
  free: number;
  rate: number;
  mrp: number;
  amount: number;
  disc: number;
  margin: number;
}

export interface PurchaseData extends BasePurchaseOrder {
  medicines: TransformedMedicine[];
}

export interface TPurchaseInfo {
  selectedDistributor: string;
  distributorName: string;
  invoiceNo: string;
  invoiceDate: Date | null;
  paymentDueDate: Date | null;
}

export interface PurchaseTotals {
  totalAmount: number;
  totalItems: number;
  totalQuantity: number;
}

// ===== API TYPES =====
export interface DuplicateInvoiceCheckParams {
  invoice_no: string;
  distributor_id: string;
}

export type DuplicateInvoiceResponse = ApiResponse<{
  isInvoiceAvailable: boolean;
}>;

export interface SavePurchaseResponse extends ApiResponse {
  success: boolean;
}

export type GetPurchaseDetailsResponse = ApiResponse<{
  purchase_order: PurchaseOrderDetails;
  purchase_order_items: PurchaseOrderItem[];
  total_items: number;
}>;

// ===== COMPONENT PROPS =====
export interface MedicineListManagerProps {
  onMedicinesChange: (medicines: TMedicine[]) => void;
  initialMedicines: TMedicine[];
}

export interface AddMedicineRowProps {
  medicine: TMedicine;
  onUpdate: (id: string, data: TMedicineFormData) => void;
  onDelete: (id: string) => void;
  isLast: boolean;
  onAddNew: () => void;
}

export interface ImportMedicinesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (medicines: TMedicine[]) => void;
}

export interface AddDistributorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: TDistributor | null;
  isEditMode?: boolean;
}

export interface DistributorListWraperProps {
  selectedDistributorId: string | null;
  setSelectedDistributorId: React.Dispatch<React.SetStateAction<string | null>>;
  refreshDistributorList: number;
  openDistributorModal: () => void;
}

export interface DistributorOrInvoiceListProps {
  title: string;
  description: string;
  seleceted: boolean;
  amount?: number | string;
  onClick?: () => void;
}

// ===== HOOK TYPES =====
export interface UseAddPurchaseReturn {
  purchaseInfo: TPurchaseInfo;
  setPurchaseInfo: React.Dispatch<React.SetStateAction<TPurchaseInfo>>;
  medicines: TMedicine[];
  setMedicines: React.Dispatch<React.SetStateAction<TMedicine[]>>;
  showImportModal: boolean;
  setShowImportModal: React.Dispatch<React.SetStateAction<boolean>>;
  distributors: TDistributor[];
  distributorsLoading: boolean;
  isLoadingPurchaseDetails?: boolean;
  isCheckingInvoice: boolean;
  isSubmitting: boolean;
  invoiceError: string | null;
  handleMedicinesChange: (updatedMedicines: TMedicine[]) => void;
  handleImportMedicines: (importedMedicines: TMedicine[]) => void;
  handleSubmit: (e: React.FormEvent) => void;
  validateDateOrder: (
    invoiceDate: Date | null,
    dueDate: Date | null,
  ) => boolean;
  calculateTotals: (medicineList: TMedicine[]) => PurchaseTotals;
}

export interface UseMedicineFormOptions {
  initialMedicines?: TMedicine[];
  onMedicinesChange?: (medicines: TMedicine[]) => void;
}
