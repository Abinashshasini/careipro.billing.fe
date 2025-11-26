'use client';
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { IoChevronBackOutline } from 'react-icons/io5';
import { FaFileMedical } from 'react-icons/fa6';
import { HiSaveAs } from 'react-icons/hi';
import { DatePicker } from 'react-datepicker';
import Select from 'react-select';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MedicineListManager from '@/components/purchases/medicine-list-manager';
import ImportMedicinesModal from '@/components/purchases/import-medicines-modal';
import useAddPurchase from '@/hooks/useAddPurchase';
import 'react-datepicker/dist/react-datepicker.css';

import { DistributorOption } from '@/types/purchases';

const AddPurchaseOrder = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const purchaseOrderId = searchParams.get('purchaseOrderId');

  const {
    purchaseInfo,
    setPurchaseInfo,
    medicines,
    showImportModal,
    setShowImportModal,
    distributors,
    distributorsLoading,
    isCheckingInvoice,
    isSubmitting,
    invoiceError,
    handleMedicinesChange,
    handleImportMedicines,
    handleSubmit,
    validateDateOrder,
  } = useAddPurchase(purchaseOrderId);

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
            <h3 className="text-lg font-bold text-black">
              {purchaseOrderId ? 'Edit Purchase' : 'Add New Purchase'}
            </h3>
            <p className="text-md font-regular text-gray">
              {!purchaseOrderId
                ? 'Fill in the details below to import a new purchase bill'
                : 'Review and update the medicine details for this purchase order'}
            </p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          {!purchaseOrderId && (
            <Button
              type="button"
              variant="outline"
              className="font-semibold"
              onClick={() => setShowImportModal(true)}
            >
              <FaFileMedical className="mr-2" size={20} />
              Import CSV/PDF
            </Button>
          )}
          <Button
            type="submit"
            variant="default"
            className="font-semibold"
            onClick={handleSubmit}
            disabled={isSubmitting || !!invoiceError}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <HiSaveAs className="mr-2" size={20} />
                Save (Alt + S)
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Default options - Hidden in edit mode */}
      {!purchaseOrderId && (
        <div className="w-full light-border rounded-lg flex items-start p-4 gap-8 mb-6 relative z-2">
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
              placeholder={
                distributorsLoading
                  ? 'Loading distributors...'
                  : 'Select Distributor'
              }
              isSearchable
              isClearable
              isLoading={distributorsLoading}
              noOptionsMessage={() =>
                distributorsLoading ? 'Loading...' : 'No distributors found'
              }
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
            <div className="relative">
              <Input
                placeholder="Invoice Number"
                className={`w-64 ${
                  invoiceError ? 'border-danger focus:border-danger' : ''
                }`}
                value={purchaseInfo.invoiceNo}
                onChange={(e) => {
                  setPurchaseInfo({
                    ...purchaseInfo,
                    invoiceNo: e.target.value,
                  });
                }}
                error={invoiceError || undefined}
                required
              />
              {isCheckingInvoice && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            {invoiceError && (
              <p className="text-danger text-xs mt-1 max-w-64">
                {invoiceError}
              </p>
            )}
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
      )}

      {/* Add Medicine component */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 relative z-1"
        style={{ height: 'calc(100% - 260px)' }}
      >
        <MedicineListManager
          onMedicinesChange={handleMedicinesChange}
          initialMedicines={medicines}
        />
      </form>

      {/* Import Modal - Hidden in edit mode */}
      {!purchaseOrderId && (
        <ImportMedicinesModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImport={handleImportMedicines}
        />
      )}
    </div>
  );
};

export default AddPurchaseOrder;
