import { TMedicineFormData } from '@/types/purchases';

export interface ParsedMedicineData {
  success: boolean;
  data: TMedicineFormData[];
  errors: string[];
}

/**
 * Parse CSV file and extract medicine data
 */
export const parseCSVFile = async (file: File): Promise<ParsedMedicineData> => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter((line) => line.trim());

        if (lines.length < 2) {
          resolve({
            success: false,
            data: [],
            errors: [
              'CSV file must contain a header row and at least one data row',
            ],
          });
          return;
        }

        // Parse header
        const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
        const data: TMedicineFormData[] = [];
        const errors: string[] = [];

        // Parse data rows
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map((v) => v.trim());

          try {
            const medicine = parseMedicineRow(headers, values);
            data.push(medicine);
          } catch (error) {
            errors.push(
              `Row ${i + 1}: ${
                error instanceof Error ? error.message : 'Invalid data'
              }`,
            );
          }
        }

        resolve({
          success: data.length > 0,
          data,
          errors,
        });
      } catch (error) {
        resolve({
          success: false,
          data: [],
          errors: [
            `Failed to parse CSV: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`,
          ],
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        data: [],
        errors: ['Failed to read file'],
      });
    };

    reader.readAsText(file);
  });
};

/**
 * Parse Excel file and extract medicine data
 * Note: This requires the 'xlsx' package to be installed
 */
export const parseExcelFile = async (
  file: File,
): Promise<ParsedMedicineData> => {
  try {
    // Dynamically import xlsx to avoid build issues if not installed
    const XLSX = await import('xlsx');

    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });

          // Get first sheet
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
          }) as string[][];

          if (jsonData.length < 2) {
            resolve({
              success: false,
              data: [],
              errors: [
                'Excel file must contain a header row and at least one data row',
              ],
            });
            return;
          }

          const headers = jsonData[0].map((h) =>
            String(h).trim().toLowerCase(),
          );
          const medicines: TMedicineFormData[] = [];
          const errors: string[] = [];

          for (let i = 1; i < jsonData.length; i++) {
            const values = jsonData[i].map((v) => String(v).trim());

            try {
              const medicine = parseMedicineRow(headers, values);
              medicines.push(medicine);
            } catch (error) {
              errors.push(
                `Row ${i + 1}: ${
                  error instanceof Error ? error.message : 'Invalid data'
                }`,
              );
            }
          }

          resolve({
            success: medicines.length > 0,
            data: medicines,
            errors,
          });
        } catch (error) {
          resolve({
            success: false,
            data: [],
            errors: [
              `Failed to parse Excel: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            ],
          });
        }
      };

      reader.onerror = () => {
        resolve({
          success: false,
          data: [],
          errors: ['Failed to read file'],
        });
      };

      reader.readAsArrayBuffer(file);
    });
  } catch (error) {
    return {
      success: false,
      data: [],
      errors: [
        'Excel parsing requires xlsx package. Please run: npm install xlsx',
      ],
    };
  }
};

/**
 * Parse PDF file (placeholder - requires pdf parsing library)
 */
export const parsePDFFile = async (file: File): Promise<ParsedMedicineData> => {
  // PDF parsing is complex and requires libraries like pdf-parse or pdfjs-dist
  return {
    success: false,
    data: [],
    errors: [
      'PDF parsing is not yet implemented. Please use CSV or Excel files.',
    ],
  };
};

/**
 * Helper function to parse a single medicine row
 */
const parseMedicineRow = (
  headers: string[],
  values: string[],
): TMedicineFormData => {
  const getColumnValue = (columnNames: string[]): string => {
    for (const name of columnNames) {
      const index = headers.findIndex((h) => h.includes(name));
      if (index !== -1 && values[index]) {
        return values[index];
      }
    }
    return '';
  };

  const getNumberValue = (columnNames: string[]): number | '' => {
    const value = getColumnValue(columnNames);
    if (!value) return '';
    const num = parseFloat(value);
    return isNaN(num) ? '' : num;
  };

  // Extract expiry month and year
  const expiryValue = getColumnValue(['expiry', 'exp', 'expdate']);
  let expiryMM = '';
  let expiryYY = '';

  if (expiryValue) {
    // Try to parse various date formats (MM/YY, MM-YY, MMYY, etc.)
    const expiryMatch = expiryValue.match(/(\d{1,2})[\/-]?(\d{2,4})/);
    if (expiryMatch) {
      expiryMM = expiryMatch[1].padStart(2, '0');
      expiryYY = expiryMatch[2].slice(-2); // Get last 2 digits
    }
  }

  return {
    med_name: getColumnValue([
      'product',
      'productname',
      'name',
      'medicine',
      'item',
    ]),
    batch: getColumnValue(['batch', 'batchno', 'batchnumber']),
    expiryMM: expiryMM || getColumnValue(['expirymm', 'month', 'mm']),
    expiryYY: expiryYY || getColumnValue(['expiryyy', 'year', 'yy']),
    pack: getColumnValue(['pack', 'packing', 'package']) || '1×10',
    qty: getNumberValue(['qty', 'quantity', 'strips']),
    free: getNumberValue(['free', 'freeqty']),
    mrp: getNumberValue(['mrp', 'price', 'maxretailprice']),
    rate: getNumberValue(['rate', 'purchaserate', 'cost']),
    disc: getNumberValue(['disc', 'discount', 'discountpercent', 'disc%']) || 0,
  };
};

/**
 * Main function to parse any supported file type
 */
export const parseImportFile = async (
  file: File,
): Promise<ParsedMedicineData> => {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  switch (fileExtension) {
    case 'csv':
      return parseCSVFile(file);
    case 'xlsx':
    case 'xls':
      return parseExcelFile(file);
    case 'pdf':
      return parsePDFFile(file);
    default:
      return {
        success: false,
        data: [],
        errors: [
          'Unsupported file format. Please use CSV, Excel, or PDF files.',
        ],
      };
  }
};
