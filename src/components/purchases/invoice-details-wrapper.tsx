'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { IoMdAdd } from 'react-icons/io';
import { TSupplier } from '@/types/purchases';

interface InvoiceDetailsWrapperProps {
  distributor?: TSupplier | undefined | null;
}

const InvoiceDetailsWrapper = ({ distributor }: InvoiceDetailsWrapperProps) => {
  const router = useRouter();
  return (
    <div className="p-4 ">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-xl font-bold">Distributor Invoice Details</h3>
            <p className="text-gray text-md">
              Select a distributor to view details
            </p>
          </div>
        </div>
        <div
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:opacity-90 transition"
          onClick={() => router.push('purchases/add-purchase')}
        >
          <IoMdAdd className="mr-2" />
          Add New Purchase
        </div>
      </div>
      {/* {distributor && (
        <div className="mt-4 flex gap-2">
          <div className="h-15 w-15 flex items-center justify-center font-bold text-2xl bg-bg-primary rounded-lg text-primary">
            MD
          </div>
          <div>
            <div className="text-lg font-medium">
              {distributor.supplier_name}
            </div>
            <div className="text-sm text-gray">Nagawara, Bangalore</div>
            <div className="flex flex-col gap-2 mt-3">
              <div className="text-sm">
                GST -
                <span className="font-medium ml-2">
                  {distributor.gst_number}
                </span>
              </div>
              <div className="text-sm">
                Contact -
                <span className="font-medium ml-2">
                  {distributor.mobile_number}
                </span>
              </div>
              <div className="text-sm">
                Last Invoice -
                <span className="font-medium ml-2">
                  {distributor.last_invoice_no}
                </span>
                on
                <span className="font-medium ml-2">
                  {distributor.last_invoice_date}
                </span>
              </div>
              <div className="text-sm">
                Total Amount -
                <span className="font-medium ml-2">
                  ₹{distributor.last_invoice_amount}
                </span>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default InvoiceDetailsWrapper;
