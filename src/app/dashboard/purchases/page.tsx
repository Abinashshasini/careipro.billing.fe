'use client';
import React, { useState } from 'react';

/** components */
import InvoiceDetailsWrapper from '@/components/purchases/invoice-details-wrapper';
import DistibutorListWraper from '@/components/purchases/distributor-list-wraper';

const PurchaseContainer = () => {
  const [selectedDistributorId, setSelectedDistributorId] = useState<
    number | null
  >(null);

  const demoDistributors = [
    {
      supplier_id: 1,
      supplier_name: 'MedPlus Healthcare Solutions',
      mobile_number: '9876543210',
      gst_number: '29AABCT1332L1ZW',
      last_invoice_date: '2024-11-01',
      last_invoice_no: 'INV-2024-001',
      last_invoice_amount: '125000.00',
    },
    {
      supplier_id: 2,
      supplier_name: 'Apollo Pharmacy Distributors',
      mobile_number: '9988776655',
      gst_number: '27AABCA3842M1Z5',
      last_invoice_date: '2024-10-28',
      last_invoice_no: 'INV-2024-002',
      last_invoice_amount: '87500.50',
    },
    {
      supplier_id: 3,
      supplier_name: 'Wellness Forever Medical Supplies',
      mobile_number: '9123456789',
      gst_number: '24AACFW3421N1ZQ',
      last_invoice_date: '2024-10-25',
      last_invoice_no: 'INV-2024-003',
      last_invoice_amount: '95250.75',
    },
  ];

  const selectedDistributor = demoDistributors.find(
    (d) => d.supplier_id === selectedDistributorId,
  );

  return (
    <div className="w-full bg-white rounded-lg h-full flex">
      {/* Sidebar (Distributor & Invoice List) */}
      <div className="w-md border-r-1 h-full border-border relative">
        <DistibutorListWraper
          selectedDistributorId={selectedDistributorId}
          setSelectedDistributorId={setSelectedDistributorId}
        />
      </div>

      {/* Right Panel */}
      <div className="h-full flex-1">
        <InvoiceDetailsWrapper distributor={selectedDistributor} />
      </div>
    </div>
  );
};

export default PurchaseContainer;
