import { TSupplier } from '@/types/purchases';

/**
 * Demo distributor data for testing and development
 * Use this data when the API is not available or for initial testing
 */
export const DEMO_DISTRIBUTORS: TSupplier[] = [
  {
    supplier_id: 1,
    supplier_name: 'MedPlus Healthcare Solutions',
    mobile_number: '9876543210',
    gst_number: '29AABCT1332L1ZW',
    last_invoice_date: '2024-11-01',
    last_invoice_no: 'INV-2024-001',
    last_invoice_amount: '125000.00',
  },
  {
    supplier_id: 2,
    supplier_name: 'Apollo Pharmacy Distributors',
    mobile_number: '9988776655',
    gst_number: '27AABCA3842M1Z5',
    last_invoice_date: '2024-10-28',
    last_invoice_no: 'INV-2024-002',
    last_invoice_amount: '87500.50',
  },
  {
    supplier_id: 3,
    supplier_name: 'Wellness Forever Medical Supplies',
    mobile_number: '9123456789',
    gst_number: '24AACFW3421N1ZQ',
    last_invoice_date: '2024-10-25',
    last_invoice_no: 'INV-2024-003',
    last_invoice_amount: '95250.75',
  },
  {
    supplier_id: 4,
    supplier_name: 'HealthKart Pharmaceuticals',
    mobile_number: '9234567890',
    gst_number: '07AABCH9645P1Z2',
    last_invoice_date: '2024-10-20',
    last_invoice_no: 'INV-2024-004',
    last_invoice_amount: '156800.00',
  },
  {
    supplier_id: 5,
    supplier_name: 'Guardian Medical Distribution',
    mobile_number: '9345678901',
    gst_number: '33AACFG7890R1ZK',
    last_invoice_date: '2024-10-15',
    last_invoice_no: 'INV-2024-005',
    last_invoice_amount: '72300.25',
  },
];

/**
 * Get demo distributors
 * Can be used as fallback when API fails or for development
 */
export const getDemoDistributors = (): TSupplier[] => {
  return DEMO_DISTRIBUTORS;
};

/**
 * Get a single demo distributor by ID
 */
export const getDemoDistributorById = (id: number): TSupplier | undefined => {
  return DEMO_DISTRIBUTORS.find((d) => d.supplier_id === id);
};

/**
 * Search demo distributors by name or GST
 */
export const searchDemoDistributors = (query: string): TSupplier[] => {
  const lowerQuery = query.toLowerCase();
  return DEMO_DISTRIBUTORS.filter(
    (d) =>
      d.supplier_name.toLowerCase().includes(lowerQuery) ||
      d.gst_number.toLowerCase().includes(lowerQuery),
  );
};
