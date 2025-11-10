'use client';
import { useRouter } from 'next/navigation';
import { IoMdAdd } from 'react-icons/io';
import React from 'react';

const InvoiceDetailsWrapper = () => {
  const router = useRouter();
  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex items-center gap-4">
        <div>
          <h3 className="text-xl font-bold">Distributor Invoice Details</h3>
          <p className="text-gray text-md">Invoice #12345 Details</p>
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
  );
};

export default InvoiceDetailsWrapper;
