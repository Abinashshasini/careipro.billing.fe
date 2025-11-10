'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoChevronBackOutline } from 'react-icons/io5';
import { FaFileMedical } from 'react-icons/fa6';
import { HiSaveAs } from 'react-icons/hi';
import { DatePicker } from 'react-datepicker';
import { RiArrowDownSFill } from 'react-icons/ri';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useQueryClient } from '@tanstack/react-query';
import { TSupplier } from '@/types/purchases';
import { BehaviourProvidorDiv } from '@/components/ui/behaviour-providor-div';
import MedicineListManager from '../component/medicine-list-manager';
import ImportMedicinesModal from '../component/import-medicines-modal';
import { TMedicine } from '@/types/medicine';
import { isRowComplete } from '@/lib/medicineValidation';
import 'react-datepicker/dist/react-datepicker.css';

type TinvoiceTypes = {
  invoiceNumber: string;
  selectedDistributor: string;
  invoiceDate: Date | null;
  paymentDueDate: Date | null;
};

const AddPurchaseOrder = () => {
  const router = useRouter();

  /** Required states */
  const [invoiceInfo, setInvoiceInfo] = useState<TinvoiceTypes>({
    invoiceNumber: '',
    selectedDistributor: '',
    invoiceDate: new Date(),
    paymentDueDate: new Date(),
  });

  const [medicines, setMedicines] = useState<TMedicine[]>([]);
  const [supplierInfo, setSupplierInfo] = useState({
    supplierName: '',
    invoiceNo: '',
    invoiceDate: '',
    dueDate: '',
  });
  const [showImportModal, setShowImportModal] = useState(false);

  const queryClient = useQueryClient();
  const suppliers = queryClient.getQueryData<TSupplier[]>(['suppliers']) || [];

  const handleMedicinesChange = (updatedMedicines: TMedicine[]) => {
    setMedicines(updatedMedicines);
    console.log('Updated medicines:', updatedMedicines);
  };

  /** Handle import of medicines from file */
  const handleImportMedicines = (importedMedicines: TMedicine[]) => {
    console.log('Importing medicines:', importedMedicines);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
      alert(
        `Please complete all required fields for ${invalidMedicines.length} medicine row(s) before submitting.`,
      );
      return;
    }

    if (validMedicines.length === 0) {
      alert(
        'Please add at least one complete medicine entry before submitting.',
      );
      return;
    }

    const purchaseData = {
      supplier: supplierInfo,
      medicines: validMedicines,
      totals: calculateTotals(validMedicines),
    };

    console.log('Purchase Data:', purchaseData);
    alert(
      `Purchase saved successfully with ${validMedicines.length} medicine(s)! Check developer tools for details.`,
    );
  };

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
          <Button type="submit" variant="default" className="font-semibold">
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
          <Select
            value={invoiceInfo.selectedDistributor}
            onChange={(value) =>
              setInvoiceInfo({ ...invoiceInfo, selectedDistributor: value })
            }
            placeholder="Select Distributor"
            searchable
            className="w-64 mt-2"
            icon={<RiArrowDownSFill size={20} />}
          >
            {({ searchTerm, setValue }) =>
              suppliers
                .filter((element) =>
                  element.supplier_name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()),
                )
                .map((_element) => (
                  <div
                    key={_element.supplier_id}
                    onClick={() => setValue(_element.supplier_name)}
                    className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                  >
                    {_element.supplier_name}
                  </div>
                ))
            }
          </Select>
        </div>

        <div>
          <p className="whitespace-nowrap mb-2 text-xs font-regular text-black relative">
            INVOICE NUMBER
            <span className="text-danger text-xl absolute -top-1">*</span>
          </p>
          <Input placeholder="Invoice Number" className="w-64" />
        </div>

        <div>
          <p className="whitespace-nowrap mb-2 text-xs font-regular text-black relative">
            INVOICE DATE
            <span className="text-danger text-xl absolute -top-1">*</span>
          </p>
          <BehaviourProvidorDiv className="border border-border rounded-lg pr-4 pl-2 h-10 hover:bg-grayLight transition cursor-pointer flex items-center w-64">
            <DatePicker
              showIcon
              dateFormat="dd-MM-yyyy"
              className="text-center p-3 w-30 rounded text-sm  outline-none  focus:ring-0 bg-transparent"
              selected={invoiceInfo.invoiceDate}
              onChange={(date) => {
                setInvoiceInfo({ ...invoiceInfo, invoiceDate: date });
              }}
            />
          </BehaviourProvidorDiv>
        </div>

        <div>
          <p className="whitespace-nowrap mb-2 text-xs font-regular text-black relative">
            PAYMENT DATE
            <span className="text-danger text-xl absolute -top-1">*</span>
          </p>
          <BehaviourProvidorDiv className="border border-border rounded-lg pr-4 pl-2 h-10 hover:bg-grayLight transition cursor-pointer flex items-center w-64">
            <DatePicker
              showIcon
              dateFormat="dd-MM-yyyy"
              className="text-center p-3 w-30 rounded text-sm  outline-none  focus:ring-0 bg-transparent"
              selected={invoiceInfo.paymentDueDate}
              onChange={(date) => {
                setInvoiceInfo({ ...invoiceInfo, paymentDueDate: date });
              }}
            />
          </BehaviourProvidorDiv>
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
