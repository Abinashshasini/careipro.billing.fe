import { TMedicine, TMedicineFormData } from '@/types/medicine';

export interface ValidationError {
  field: keyof TMedicineFormData;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Validate a single medicine entry
export const validateMedicine = (
  medicine: TMedicine | TMedicineFormData,
): ValidationResult => {
  const errors: ValidationError[] = [];

  // Product Name - mandatory
  if (!medicine.productName || medicine.productName.trim() === '') {
    errors.push({
      field: 'productName',
      message: 'Product Name is required',
    });
  }

  // Batch - mandatory
  if (!medicine.batch || medicine.batch.trim() === '') {
    errors.push({
      field: 'batch',
      message: 'Batch is required',
    });
  }

  // Expiry - mandatory (both month and year) and must be future date
  if (!medicine.expiryMM || medicine.expiryMM.trim() === '') {
    errors.push({
      field: 'expiryMM',
      message: 'Expiry Month is required',
    });
  } else {
    const month = parseInt(medicine.expiryMM, 10);
    if (isNaN(month) || month < 1 || month > 12) {
      errors.push({
        field: 'expiryMM',
        message: 'Expiry Month must be between 01-12',
      });
    }
  }

  if (!medicine.expiryYY || medicine.expiryYY.trim() === '') {
    errors.push({
      field: 'expiryYY',
      message: 'Expiry Year is required',
    });
  } else {
    const year = parseInt(medicine.expiryYY, 10);
    if (isNaN(year) || year < 0 || year > 99) {
      errors.push({
        field: 'expiryYY',
        message: 'Expiry Year must be between 00-99',
      });
    } else {
      // Check if expiry date is in the future
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11

      const expiryMonth = parseInt(medicine.expiryMM, 10);
      const expiryYear = parseInt(medicine.expiryYY, 10);

      // Convert 2-digit year to full year (assuming 20xx for years 00-99)
      const fullExpiryYear =
        expiryYear < 50 ? 2000 + expiryYear : 1900 + expiryYear;
      const fullCurrentYear = currentDate.getFullYear();

      if (
        fullExpiryYear < fullCurrentYear ||
        (fullExpiryYear === fullCurrentYear && expiryMonth < currentMonth)
      ) {
        errors.push({
          field: 'expiryYY',
          message: 'Expiry date cannot be in the past',
        });
      }
    }
  }

  // Pack - mandatory
  if (!medicine.pack || medicine.pack.trim() === '') {
    errors.push({
      field: 'pack',
      message: 'Pack is required',
    });
  }

  // Qty - mandatory and must be greater than 0
  if (
    medicine.qty === '' ||
    medicine.qty === undefined ||
    medicine.qty === null ||
    Number(medicine.qty) <= 0
  ) {
    errors.push({
      field: 'qty',
      message: 'Quantity must be greater than 0',
    });
  }

  // Free - mandatory (can be 0 but cannot be empty)
  if (
    medicine.free === '' ||
    medicine.free === undefined ||
    medicine.free === null ||
    Number(medicine.free) < 0
  ) {
    errors.push({
      field: 'free',
      message: 'Free quantity is required (can be 0)',
    });
  }

  // MRP - mandatory and must be greater than 0
  if (
    medicine.mrp === '' ||
    medicine.mrp === undefined ||
    medicine.mrp === null ||
    Number(medicine.mrp) <= 0
  ) {
    errors.push({
      field: 'mrp',
      message: 'MRP must be greater than 0',
    });
  }

  // Rate - mandatory and must be greater than 0
  if (
    medicine.rate === '' ||
    medicine.rate === undefined ||
    medicine.rate === null ||
    Number(medicine.rate) <= 0
  ) {
    errors.push({
      field: 'rate',
      message: 'Rate must be greater than 0',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Check if current row has all mandatory fields filled
export const isRowComplete = (
  medicine: TMedicine | TMedicineFormData,
): boolean => {
  const validation = validateMedicine(medicine);
  return validation.isValid;
};

// Get field validation error for a specific field
export const getFieldError = (
  medicine: TMedicine | TMedicineFormData,
  field: keyof TMedicineFormData,
): string | null => {
  const validation = validateMedicine(medicine);
  const error = validation.errors.find((err) => err.field === field);
  return error ? error.message : null;
};

// Check if a medicine row has any meaningful data (not completely empty)
export const hasAnyData = (
  medicine: TMedicine | TMedicineFormData,
): boolean => {
  return (
    medicine.productName.trim() !== '' ||
    medicine.batch.trim() !== '' ||
    medicine.expiryMM.trim() !== '' ||
    medicine.expiryYY.trim() !== '' ||
    medicine.pack.trim() !== '' ||
    (medicine.qty !== '' && Number(medicine.qty) > 0) ||
    (medicine.free !== '' && Number(medicine.free) >= 0) ||
    (medicine.mrp !== '' && Number(medicine.mrp) > 0) ||
    (medicine.rate !== '' && Number(medicine.rate) > 0)
  );
};
