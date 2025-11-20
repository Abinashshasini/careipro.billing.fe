'use client';
import React, { useState } from 'react';

/** components */
import InvoiceDetailsWrapper from '@/components/purchases/invoice-details-wrapper';
import DistibutorListWraper from '@/components/purchases/distributor-list-wraper';

const PurchaseContainer = () => {
  const [selectedDistributorId, setSelectedDistributorId] = useState<
    string | null
  >(null);

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
        <InvoiceDetailsWrapper selectedDistributorId={selectedDistributorId} />
      </div>
    </div>
  );
};

export default PurchaseContainer;
