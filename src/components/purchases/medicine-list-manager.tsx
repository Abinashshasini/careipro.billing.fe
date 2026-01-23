'use client';
import React from 'react';
import AddMedicineRow from './add-medicine-row';
import { MedicineListManagerProps } from '@/types/purchases';
import { useMedicineForm } from '@/hooks/useMedicineForm';

const MedicineListManager: React.FC<MedicineListManagerProps> = ({
  onMedicinesChange,
  initialMedicines = [],
  isEditMode = false,
  existingMedicinesCount = 0,
}) => {
  const {
    medicines,
    updateMedicine,
    addMedicine,
    deleteMedicine,
    clearAllMedicines,
    calculateTotals,
  } = useMedicineForm({
    initialMedicines,
    onMedicinesChange,
  });

  const totals = calculateTotals();

  return (
    <div className="w-full light-border rounded-lg flex flex-col h-full relative overflow-hidden">
      {/* Medicine Table with Scrollable Body */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4">
        {/* Sticky Header */}
        <div className="flex items-center whitespace-nowrap text-xs font-regular text-black w-full sticky top-0 bg-white py-4 z-10 border-b border-gray-200">
          <div className="initial">#</div>
          <div className="productName">Product / Barcode</div>
          <div className="batch">BATCH</div>
          <div className="expiry">Expiry</div>
          <div className="pack">Pack</div>
          <div className="qty">QTY</div>
          <div className="free">FREE</div>
          <div className="mrp">MRP</div>
          <div className="rate">RATE</div>
          <div className="disc">DISC</div>
          <div className="gst">GST</div>
          <div className="margin">MARGIN</div>
          <div className="amount">AMT</div>
          <div className="amount">ACTION</div>
        </div>

        {/* Add Medicine Rows */}
        <div className="space-y-1 pr-2 pb-4">
          {medicines.map((medicine, index) => {
            const isReadOnly = isEditMode && index < existingMedicinesCount;

            return (
              <AddMedicineRow
                key={medicine.id}
                medicine={medicine}
                onUpdate={updateMedicine}
                onDelete={deleteMedicine}
                isLast={index === medicines.length - 1}
                onAddNew={addMedicine}
                isReadOnly={isReadOnly}
              />
            );
          })}
        </div>
      </div>

      {/* Sticky Footer - Totals Summary */}
      <div className="w-full border-t-2 border-gray-200 bg-white px-4 py-3 sticky bottom-0 z-10">
        <div className="flex items-center justify-between gap-6 text-sm">
          <div className="flex gap-6 flex-wrap">
            <div className="flex justify-between gap-4">
              <span className="font-medium text-gray-700">Total Items:</span>
              <span className="font-bold text-black">{totals.totalItems}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="font-medium text-gray-700">Total Quantity:</span>
              <span className="font-bold text-black">{totals.totalQty}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="font-medium text-gray-700">Total Discount:</span>
              <span className="font-bold text-danger">
                ₹{totals.totalDiscount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="font-medium text-gray-700">Total Amount:</span>
              <span className="font-bold text-success text-lg">
                ₹{totals.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Clear All Button */}
          {medicines?.length > 1 && (
            <button
              onClick={clearAllMedicines}
              className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicineListManager;
