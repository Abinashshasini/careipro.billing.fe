export type TSupplier = {
  supplier_id: number;
  supplier_name: string;
  mobile_number: string;
  gst_number: string;
  last_invoice_date: string;
  last_invoice_no: string;
  last_invoice_amount: string;
};

export type TDistributorSummary = {
  distributor: TDistributor;
  purchaseOrders: Array<PurchaseOrder>;
  purchaseSummary: {
    last_invoice: string | null;
    last_invoice_date: string | null;
    pending_amount: number;
    total_amount: number;
    pending_amount_color?: string;
  };
};

export type TDistributor = {
  _id: string;
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
};

export type DistributorOption = {
  value: string;
  label: string;
};

export type DistributorListProps = {
  data: TDistributor;
};

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

export interface AddDistributorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: TDistributor | null;
  isEditMode?: boolean;
}

export type TMedicine = {
  id: string;
  productName: string;
  hsn: string;
  batch: string;
  expiryMM: string;
  expiryYY: string;
  pack: string;
  qty: number | '';
  free: number | '';
  mrp: number | '';
  rate: number | '';
  disc: number | '';
  amount: number;
  margin: number;
};

export type TMedicineFormData = Omit<TMedicine, 'id' | 'amount' | 'margin'>;

export interface TransformedMedicine {
  med_name: string;
  batch: string;
  pack: string;
  expiry: string;
  qty: number;
  free: number;
  rate: number;
  mrp: number;
  disc: number;
  margin: number;
  amount: number;
}

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

export type TPurchaseInfo = {
  selectedDistributor: string;
  distributorName: string;
  invoiceNo: string;
  invoiceDate: Date | null;
  paymentDueDate: Date | null;
};

export interface PurchaseData {
  distributor_id: string;
  payment_due_date: string;
  invoice_no: string;
  invoice_date: string;
  total_amount: number;
  total_item_count: number;
  medicines: TransformedMedicine[];
}

export interface PurchaseOrder {
  _id: string;
  clinic_id: string;
  distributor_id: string;
  invoice_no: string;
  invoice_date: string;
  payment_due_date: string;
  payment_status: string;
  total_amount: number;
  total_item_count: number;
  payment_summary: {
    status: string;
    color: string;
  };
}

export interface PurchaseTotals {
  totalAmount: number;
  totalItems: number;
  totalQuantity: number;
}

// API Types
export interface DuplicateInvoiceCheckParams {
  invoice_no: string;
  distributor_id: string;
}

export interface DuplicateInvoiceResponse {
  message: string;
  data: {
    isInvoiceAvailable: boolean;
  };
}

export interface SavePurchaseResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}

export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// Hook Types
export interface UseAddPurchaseReturn {
  purchaseInfo: TPurchaseInfo;
  setPurchaseInfo: React.Dispatch<React.SetStateAction<TPurchaseInfo>>;
  medicines: TMedicine[];
  setMedicines: React.Dispatch<React.SetStateAction<TMedicine[]>>;
  showImportModal: boolean;
  setShowImportModal: React.Dispatch<React.SetStateAction<boolean>>;
  distributors: TDistributor[];
  distributorsLoading: boolean;
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
