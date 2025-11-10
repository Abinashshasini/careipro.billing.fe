'use client';
import React from 'react';
import AddMedicineRow from './add-medicine-row';
import { TMedicine } from '@/types/medicine';
import { useMedicineForm } from '@/hooks/useMedicineForm';

interface MedicineListManagerProps {
  onMedicinesChange?: (medicines: TMedicine[]) => void;
  initialMedicines?: TMedicine[];
}

const MedicineListManager: React.FC<MedicineListManagerProps> = ({
  onMedicinesChange,
  initialMedicines = [],
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
    <>
      <div className="w-full light-border rounded-lg items-start px-4 pt-6 pb-6 gap-2 flex flex-col overflow-y-auto overflow-x-hidden h-full">
        <div className="flex items-center whitespace-nowrap text-xs font-regular text-black relative  w-full">
          <div className="initial">#</div>
          <div className="productName">Product / Barcode</div>
          <div className="hsn">HSN</div>
          <div className="batch">BATCH</div>
          <div className="expiry">Expiry</div>
          <div className="pack">Pack</div>
          <div className="qty">QTY</div>
          <div className="free">FREE</div>
          <div className="mrp">MRP</div>
          <div className="rate">RATE</div>
          <div className="sch">SCH %</div>
          <div className="disc">DISC</div>
          <div className="gst">GST</div>
          <div className="margin">MARGIN</div>
          <div className="amount">AMT</div>
          <div className="amount">ACTION</div>
        </div>

        {/* Add Medicine Row */}
        <div className="space-y-1  pr-2">
          {medicines.map((medicine, index) => (
            <AddMedicineRow
              key={medicine.id}
              medicine={medicine}
              onUpdate={updateMedicine}
              onDelete={deleteMedicine}
              isLast={index === medicines.length - 1}
              onAddNew={addMedicine}
            />
          ))}
        </div>
      </div>

      {/* Totals Summary */}
      <div className="w-full light-border rounded-lg items-start px-4 gap-2 flex flex-col pt-3">
        <div className="flex gap-6 text-sm mb-3">
          <div className="flex justify-between gap-4">
            <span className="font-medium">Total Items:</span>
            <span className="font-bold">{totals.totalItems}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="font-medium">Total Quantity:</span>
            <span className="font-bold">{totals.totalQty}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="font-medium">Total Discount:</span>
            <span className="font-bold text-danger">
              ₹ {totals.totalDiscount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="font-medium">Total Amount:</span>
            <span className="font-bold text-success">
              ₹ {totals.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default MedicineListManager;
