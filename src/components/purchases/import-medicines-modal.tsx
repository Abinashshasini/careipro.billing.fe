'use client';
import React, { useState } from 'react';
import { MdCheckCircle, MdError } from 'react-icons/md';
import { Modal } from '@/components/ui/modal';
import FileUpload from '@/components/ui/file-upload';
import { parseImportFile } from '@/lib/fileParser';
import { TMedicine, ImportMedicinesModalProps } from '@/types/purchases';

interface ImportResult {
  success: boolean;
  imported: number;
  errors: string[];
}

const ImportMedicinesModal: React.FC<ImportMedicinesModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  /** Handle file selection and parsing */
  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setImportResult(null);

    try {
      const result = await parseImportFile(file);

      if (result.success && result.data.length > 0) {
        // Convert TMedicineFormData to TMedicine with IDs
        const newMedicines: TMedicine[] = result.data.map((data) => ({
          ...data,
          id: `medicine_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          amount: 0,
          margin: 0,
        }));

        // Call the onImport callback with new medicines
        onImport(newMedicines);

        setImportResult({
          success: true,
          imported: result.data.length,
          errors: result.errors,
        });
      } else {
        setImportResult({
          success: false,
          imported: 0,
          errors:
            result.errors.length > 0
              ? result.errors
              : ['No valid data found in file'],
        });
      }
    } catch (error) {
      setImportResult({
        success: false,
        imported: 0,
        errors: [
          error instanceof Error ? error.message : 'Failed to process file',
        ],
      });
    } finally {
      setIsProcessing(false);
    }
  };

  /** Close modal and reset state */
  const handleClose = () => {
    setImportResult(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Import Medicines">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Upload a CSV or Excel file containing medicine details. The file
          should include columns for product name, batch, HSN, expiry date,
          quantity, pack, MRP, rate, and GST.
        </p>

        <FileUpload
          onFileSelect={handleFileSelect}
          accept=".csv,.xlsx,.xls"
          maxSize={5}
          disabled={isProcessing}
        />

        {isProcessing && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Processing file...</span>
          </div>
        )}

        {importResult && (
          <div
            className={`p-4 rounded-lg ${
              importResult.success ? 'bg-green-50' : 'bg-red-50'
            }`}
          >
            <div className="flex items-start gap-2">
              {importResult.success ? (
                <MdCheckCircle className="text-green-600 text-xl flex-shrink-0 mt-0.5" />
              ) : (
                <MdError className="text-red-600 text-xl flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <h4
                  className={`font-semibold mb-1 ${
                    importResult.success ? 'text-green-800' : 'text-red-800'
                  }`}
                >
                  {importResult.success
                    ? `Successfully imported ${importResult.imported} medicine(s)`
                    : 'Import failed'}
                </h4>
                {importResult.errors.length > 0 && (
                  <div className="text-sm space-y-1 max-h-40 overflow-y-auto">
                    {importResult.errors.map((error, index) => (
                      <p
                        key={index}
                        className={
                          importResult.success
                            ? 'text-yellow-700'
                            : 'text-red-700'
                        }
                      >
                        • {error}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {importResult.success && (
              <button
                onClick={handleClose}
                className="mt-3 w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Close
              </button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ImportMedicinesModal;
