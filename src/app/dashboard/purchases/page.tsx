'use client';
import React, { useState } from 'react';

/** components */
import InvoiceDetailsWrapper from './component/invoice-details-wrapper';
import DistibutorListWraper from './component/distributor-list-wraper';

const PurchaseContainer = () => {
  const [selectedDistributorId, setSelectedDistributorId] = useState<
    number | null
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
        <InvoiceDetailsWrapper />
      </div>
    </div>
  );
};

export default PurchaseContainer;
