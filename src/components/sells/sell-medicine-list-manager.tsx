'use client';
import React from 'react';
import { SellMedicine, SellMedicineListManagerProps } from '@/types/sells';
import useSellMedicineForm from '@/hooks/useSellMedicineForm';
import AddSellMedicineRow from './add-sell-medicine-row';

const SellMedicineListManager: React.FC<SellMedicineListManagerProps> = ({
  onMedicinesChange,
  initialMedicines,
  isEditMode = false,
}) => {
  const { medicines, handleUpdate, handleDelete, handleAddNew } =
    useSellMedicineForm({
      initialMedicines,
      onMedicinesChange,
    });

  const calculateTotals = () => {
    const totalAmount = medicines.reduce(
      (sum, med) => sum + (med.amount || 0),
      0,
    );
    const totalItems = medicines.filter(
      (med) => med.med_name && med.qty && med.qty > 0,
    ).length;
    const totalQty = medicines.reduce(
      (sum, med) => sum + (Number(med.qty) || 0),
      0,
    );
    const totalDiscount = medicines.reduce((sum, med) => {
      const qty = Number(med.qty) || 0;
      const rate = Number(med.rate) || 0;
      const disc = Number(med.disc) || 0;
      return sum + (qty * rate * disc) / 100;
    }, 0);

    return {
      totalAmount,
      totalItems,
      totalQty,
      totalDiscount,
    };
  };

  const totals = calculateTotals();

  const handleClearAll = () => {
    if (
      window.confirm(
        'Are you sure you want to clear all medicines? This action cannot be undone.',
      )
    ) {
      onMedicinesChange([
        {
          id: Date.now().toString(),
          medicine_id: '',
          med_name: '',
          batch: '',
          expiryMM: '',
          expiryYY: '',
          pack: '',
          qty: '',
          free: '',
          mrp: '',
          rate: '',
          disc: '',
          amount: 0,
          margin: 0,
          available_qty: 0,
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200">
      {/* Header - Sticky */}
      <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
        <div className="grid grid-cols-12 gap-2 px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wide">
          <div className="col-span-3">Medicine Details</div>
          <div className="col-span-2">Batch & Expiry</div>
          <div className="col-span-2 text-center">Quantity</div>
          <div className="col-span-2 text-center">Pricing</div>
          <div className="col-span-2 text-right">Amount</div>
          <div className="col-span-1 text-center">Action</div>
        </div>
      </div>

      {/* Medicine Rows - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {medicines.map((medicine, index) => (
          <AddSellMedicineRow
            key={medicine.id}
            medicine={medicine}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            isLast={index === medicines.length - 1}
            onAddNew={handleAddNew}
            isReadOnly={false}
          />
        ))}
      </div>

      {/* Totals Footer - Sticky */}
      <div className="sticky bottom-0 bg-gradient-to-r from-gray-50 to-white border-t-2 border-gray-300 px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleClearAll}
            className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-300"
            disabled={medicines.length === 0}
          >
            Clear All
          </button>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-xs text-gray-600 font-medium">Items</p>
              <p className="text-lg font-bold text-gray-900">
                {totals.totalItems}
              </p>
            </div>
            <div className="h-10 w-px bg-gray-300"></div>
            <div className="text-center">
              <p className="text-xs text-gray-600 font-medium">Quantity</p>
              <p className="text-lg font-bold text-gray-900">
                {totals.totalQty}
              </p>
            </div>
            <div className="h-10 w-px bg-gray-300"></div>
            <div className="text-center">
              <p className="text-xs text-gray-600 font-medium">Discount</p>
              <p className="text-lg font-bold text-red-600">
                -₹{totals.totalDiscount.toFixed(2)}
              </p>
            </div>
            <div className="h-10 w-px bg-gray-300"></div>
            <div className="text-right">
              <p className="text-xs text-gray-600 font-medium">Total Amount</p>
              <p className="text-2xl font-bold text-success">
                ₹{totals.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellMedicineListManager;
