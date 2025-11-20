'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoChevronBackOutline } from 'react-icons/io5';
import { FaFileMedical } from 'react-icons/fa6';
import { HiSaveAs } from 'react-icons/hi';
import { DatePicker } from 'react-datepicker';
import Select from 'react-select';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQueryClient } from '@tanstack/react-query';
import { TDistributor } from '@/types/purchases';
import MedicineListManager from '@/components/purchases/medicine-list-manager';
import ImportMedicinesModal from '@/components/purchases/import-medicines-modal';
import { TMedicine } from '@/types/medicine';
import { isRowComplete } from '@/lib/medicineValidation';
import 'react-datepicker/dist/react-datepicker.css';

type TPurchaseInfo = {
  selectedDistributor: string;
  distributorName: string;
  invoiceNo: string;
  invoiceDate: Date | null;
  paymentDueDate: Date | null;
};

type DistributorOption = {
  value: string;
  label: string;
};

const AddPurchaseOrder = () => {
  const router = useRouter();

  /** Required states */
  const [purchaseInfo, setPurchaseInfo] = useState<TPurchaseInfo>({
    selectedDistributor: '',
    distributorName: '',
    invoiceNo: '',
    invoiceDate: new Date(),
    paymentDueDate: new Date(),
  });
  const [medicines, setMedicines] = useState<TMedicine[]>([]);
  const [showImportModal, setShowImportModal] = useState(false);

  const queryClient = useQueryClient();
  const distributors =
    queryClient.getQueryData<TDistributor[]>(['distributors']) || [];

  const handleMedicinesChange = (updatedMedicines: TMedicine[]) => {
    setMedicines(updatedMedicines);
  };

  /** Handle import of medicines from file */
  const handleImportMedicines = (importedMedicines: TMedicine[]) => {
    setMedicines((prev) => {
      const hasOnlyEmptyRow =
        prev.length === 1 &&
        !prev[0].productName &&
        !prev[0].hsn &&
        !prev[0].batch;
      const newMedicines = hasOnlyEmptyRow
        ? importedMedicines
        : [...prev, ...importedMedicines];
      return newMedicines;
    });
  };

  /** Function to handle form submission */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!purchaseInfo.distributorName.trim()) {
      toast.error('Please select a distributor.');
      return;
    }
    if (!purchaseInfo.invoiceNo.trim()) {
      toast.error('Please enter an invoice number.');
      return;
    }
    if (!purchaseInfo.invoiceDate) {
      toast.error('Please select an invoice date.');
      return;
    }
    if (!purchaseInfo.paymentDueDate) {
      toast.error('Please select a payment due date.');
      return;
    }

    const validMedicines = medicines.filter((medicine) =>
      isRowComplete(medicine),
    );
    const invalidMedicines = medicines.filter(
      (medicine) =>
        !isRowComplete(medicine) &&
        (medicine.productName.trim() !== '' ||
          medicine.hsn.trim() !== '' ||
          medicine.batch.trim() !== '' ||
          (medicine.qty !== '' && Number(medicine.qty) > 0) ||
          (medicine.mrp !== '' && Number(medicine.mrp) > 0) ||
          (medicine.rate !== '' && Number(medicine.rate) > 0)),
    );

    if (invalidMedicines.length > 0) {
      toast.error(
        `Please complete all required fields for ${invalidMedicines.length} medicine row(s) before submitting.`,
      );
      return;
    }

    if (validMedicines.length === 0) {
      toast.error(
        'Please add at least one complete medicine entry before submitting.',
      );
      return;
    }

    const purchaseData = {
      distributor: {
        distributorName: purchaseInfo.distributorName,
        invoiceNo: purchaseInfo.invoiceNo,
        invoiceDate:
          purchaseInfo.invoiceDate?.toISOString().split('T')[0] || '',
        dueDate: purchaseInfo.paymentDueDate?.toISOString().split('T')[0] || '',
      },
      medicines: validMedicines,
      totals: calculateTotals(validMedicines),
    };

    console.log('Purchase Data:', purchaseData);
    toast.success(
      `Purchase saved successfully with ${validMedicines.length} medicine(s)!`,
    );
  };

  /** Function to validate that due date is not before invoice date */
  const validateDateOrder = (
    invoiceDate: Date | null,
    dueDate: Date | null,
  ) => {
    if (invoiceDate && dueDate && dueDate < invoiceDate) {
      toast.error('Payment due date cannot be before invoice date.');
      return false;
    }
    return true;
  };

  /** Function to calculate totals for medicines */
  const calculateTotals = (medicineList: TMedicine[]) => {
    return medicineList.reduce(
      (acc, medicine) => {
        const packParts = medicine.pack.split('×').map((p) => parseInt(p, 10));
        const unitsPerStrip =
          packParts.length === 2 && !isNaN(packParts[0]) && !isNaN(packParts[1])
            ? packParts[0] * packParts[1]
            : 1;

        const totalStrips =
          Number(medicine.qty || 0) + Number(medicine.free || 0);
        const totalUnits = totalStrips * unitsPerStrip;
        const totalRate = totalUnits * Number(medicine.rate || 0);

        const discountAmount = totalRate * (Number(medicine.disc || 0) / 100);
        const afterDiscount = totalRate - discountAmount;
        const gst = afterDiscount * 0.05;
        const finalAmount = afterDiscount + gst;

        acc.totalAmount += finalAmount;
        acc.totalItems += totalUnits;
        acc.totalQuantity += Number(medicine.qty || 0);

        return acc;
      },
      {
        totalAmount: 0,
        totalItems: 0,
        totalQuantity: 0,
      },
    );
  };

  return (
    <div
      className="h-full w-full rounded-xl bg-white p-6 min-w-6xl"
      style={{ height: 'calc(100vh - 96px)' }}
    >
      <Toaster position="top-right" reverseOrder={true} />
      {/* Header Code */}
      <div className="flex justify-between mb-6">
        <div className="flex gap-2">
          <IoChevronBackOutline
            size={24}
            className="cursor-pointer relative top-1"
            onClick={() => router.back()}
          />
          <div>
            <h3 className="text-lg font-bold text-black">Add New Purchase</h3>
            <p className="text-md font-regular text-gray">
              Fill in the details below to import a new purchase bill
            </p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <Button
            type="button"
            variant="outline"
            className="font-semibold"
            onClick={() => setShowImportModal(true)}
          >
            <FaFileMedical className="mr-2" size={20} />
            Import CSV/PDF
          </Button>
          <Button
            type="submit"
            variant="default"
            className="font-semibold"
            onClick={handleSubmit}
          >
            <HiSaveAs className="mr-2" size={20} />
            Save (Alt + S)
          </Button>
        </div>
      </div>

      {/* Default options */}
      <div className="w-full light-border rounded-lg flex items-start p-4 gap-8 mb-6">
        <div>
          <p className="whitespace-nowrap mb-2 text-xs font-regular text-black relative">
            SELECT DISTRIBUTOR
            <span className="text-danger text-xl absolute -top-1">*</span>
          </p>
          <Select<DistributorOption>
            value={
              distributors.find(
                (d) => d._id === purchaseInfo.selectedDistributor,
              )
                ? {
                    value:
                      distributors.find(
                        (d) => d._id === purchaseInfo.selectedDistributor,
                      )?._id || '',
                    label:
                      distributors.find(
                        (d) => d._id === purchaseInfo.selectedDistributor,
                      )?.distributor_name || '',
                  }
                : null
            }
            onChange={(selectedOption) => {
              const selectedDistributor = distributors.find(
                (d) => d._id === selectedOption?.value,
              );
              setPurchaseInfo({
                ...purchaseInfo,
                selectedDistributor: selectedOption?.value || '',
                distributorName: selectedDistributor?.distributor_name || '',
              });
            }}
            options={distributors.map((distributor) => ({
              value: distributor._id,
              label: `${distributor.distributor_name} | ${distributor.gst_number}`,
            }))}
            placeholder="Select Distributor"
            isSearchable
            isClearable
            className="react-select-container w-64 text-sm"
            classNamePrefix="react-select"
            styles={{
              option: (base) => ({
                ...base,
                fontSize: '0.875rem',
                fontWeight: '600',
              }),
            }}
          />
        </div>

        <div>
          <p className="whitespace-nowrap mb-2 text-xs font-regular text-black relative">
            INVOICE NUMBER
            <span className="text-danger text-xl absolute -top-1">*</span>
          </p>
          <Input
            placeholder="Invoice Number"
            className="w-64"
            value={purchaseInfo.invoiceNo}
            onChange={(e) =>
              setPurchaseInfo({
                ...purchaseInfo,
                invoiceNo: e.target.value,
              })
            }
            required
          />
        </div>

        <div>
          <p className="whitespace-nowrap mb-2 text-xs font-regular text-black relative">
            INVOICE DATE
            <span className="text-danger text-xl absolute -top-1">*</span>
          </p>
          <div className="border border-border rounded-lg pr-4 pl-2 h-10 hover:bg-grayLight transition cursor-pointer flex items-center border-box-shadow">
            <DatePicker
              showIcon
              dateFormat="dd-MM-yyyy"
              className="text-center p-3 w-30 rounded text-sm  outline-none  focus:ring-0 bg-transparent react-select__control"
              selected={purchaseInfo.invoiceDate}
              onChange={(date) => {
                if (
                  purchaseInfo.paymentDueDate &&
                  date &&
                  purchaseInfo.paymentDueDate < date
                ) {
                  toast.error(
                    'Payment due date cannot be before invoice date. Please update the payment date.',
                  );
                  setPurchaseInfo({
                    ...purchaseInfo,
                    invoiceDate: date,
                    paymentDueDate: date,
                  });
                } else {
                  setPurchaseInfo({ ...purchaseInfo, invoiceDate: date });
                }
              }}
              required
            />
          </div>
        </div>

        <div>
          <p className="whitespace-nowrap mb-2 text-xs font-regular text-black relative">
            PAYMENT DATE
            <span className="text-danger text-xl absolute -top-1">*</span>
          </p>
          <div className="border border-border rounded-lg pr-4 pl-2 h-10 hover:bg-grayLight transition cursor-pointer flex items-center border-box-shadow">
            <DatePicker
              showIcon
              dateFormat="dd-MM-yyyy"
              className="text-center p-3 w-30 rounded text-sm outline-none focus:ring-0 bg-transparent"
              selected={purchaseInfo.paymentDueDate}
              onChange={(date) => {
                if (validateDateOrder(purchaseInfo.invoiceDate, date)) {
                  setPurchaseInfo({ ...purchaseInfo, paymentDueDate: date });
                }
              }}
              required
            />
          </div>
        </div>
      </div>

      {/* Add Medicine component */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
        style={{ height: 'calc(100% - 260px)' }}
      >
        <MedicineListManager
          onMedicinesChange={handleMedicinesChange}
          initialMedicines={medicines}
        />
      </form>

      {/* Import Modal */}
      <ImportMedicinesModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImportMedicines}
      />
    </div>
  );
};

export default AddPurchaseOrder;
