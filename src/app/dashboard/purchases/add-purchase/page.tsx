'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoChevronBackOutline } from 'react-icons/io5';
import { FaFileMedical } from 'react-icons/fa6';
import { HiSaveAs } from 'react-icons/hi';
import { DatePicker } from 'react-datepicker';
import { RiArrowDownSFill } from 'react-icons/ri';
import 'react-datepicker/dist/react-datepicker.css';

type TinvoiceTypes = {
  invoiceNumber: string;
  selectedDistributor: string;
  invoiceDate: Date | null;
  paymentDueDate: Date | null;
};

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useQueryClient } from '@tanstack/react-query';
import { TSupplier } from '@/types/purchases';
import { BehaviourProvidorDiv } from '@/components/ui/behaviour-providor-div';

const AddPurchaseOrder = () => {
  const router = useRouter();

  /** Required states */
  const [invoiceInfo, setInvoiceInfo] = useState<TinvoiceTypes>({
    invoiceNumber: '',
    selectedDistributor: '',
    invoiceDate: new Date(),
    paymentDueDate: new Date(),
  });

  const queryClient = useQueryClient();
  const suppliers = queryClient.getQueryData<TSupplier[]>(['suppliers']) || [];

  return (
    <div className="h-full w-full rounded-xl bg-white p-6 min-w-6xl">
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
          <Button type="submit" variant="outline" className="font-semibold">
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
      <div className="w-full light-border rounded-lg flex items-start p-4 gap-8">
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
          <BehaviourProvidorDiv className="border border-border rounded-lg pr-4 pl-2 h-10 hover:bg-grayLight transition cursor-pointer flex items-center">
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
          <BehaviourProvidorDiv className="border border-border rounded-lg pr-4 pl-2 h-10 hover:bg-grayLight transition cursor-pointer flex items-center">
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
    </div>
  );
};

export default AddPurchaseOrder;
