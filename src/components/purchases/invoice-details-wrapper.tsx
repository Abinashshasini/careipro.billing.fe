'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { IoMdAdd } from 'react-icons/io';
import { useSearchParams } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { TDistributorSummary } from '@/types/purchases';
import { useQuery } from '@tanstack/react-query';
import { GET_DISTRIBUTOR_BYID } from '@/utils/api-endpoints';
import DistributorDetails from './distributor-details';
import DistributorInfoShimmer from '@/components/shimmers/distributor-info-shimmer';
import PurchaseOrdersTable from './purchase-orders-table';

interface InvoiceDetailsWrapperProps {
  selectedDistributorId?: string | null;
}

// Demo distributor data to show when no distributor is selected
const DEMO_DISTRIBUTOR: TDistributorSummary = {
  distributor: {
    _id: 'demo-id',
    distributor_name: 'Sample Medical Distributors',
    gst_number: '29DEMO1234L1ZW',
    state: 'Maharashtra',
    mobile_number: '9876543210',
    drug_license_number: 'MD12345678',
  },
  purchaseOrders: [],
  purchaseSummary: {
    last_invoice: '12345',
    last_invoice_date: 'Jan 1 2025',
    pending_amount: 10000,
    total_amount: 10000,
    pending_amount_color: '#8AA624',
  },
};

const InvoiceDetailsWrapper = ({
  selectedDistributorId,
}: InvoiceDetailsWrapperProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const distributorId = searchParams.get('distributorId');

  // Check if we have a distributor ID to fetch
  const hasDistributorId = Boolean(selectedDistributorId || distributorId);

  /** API call */
  const fetchData = async (): Promise<TDistributorSummary> => {
    const { data } = await apiClient.get<{ data: TDistributorSummary }>(
      `${GET_DISTRIBUTOR_BYID}/${selectedDistributorId || distributorId}`,
    );
    return data.data;
  };

  const { data, isLoading } = useQuery<TDistributorSummary>({
    queryKey: [`${selectedDistributorId || distributorId}-distributor`],
    queryFn: fetchData,
    staleTime: 1000 * 60 * 5,
    enabled: hasDistributorId,
  });

  // Determine what to render based on state
  const renderDistributorInfo = () => {
    if (!hasDistributorId) {
      return <DistributorDetails data={DEMO_DISTRIBUTOR} isDemo />;
    }

    if (isLoading) {
      return <DistributorInfoShimmer />;
    }

    if (data) {
      return (
        <div>
          <DistributorDetails data={data} isDemo={false} />
        </div>
      );
    }

    return <DistributorDetails data={DEMO_DISTRIBUTOR} isDemo />;
  };

  return (
    <div>
      <div className="flex justify-between items-center p-4">
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
      <div className="p-4 border-b-1 border-border pt-2">
        {renderDistributorInfo()}
      </div>
      {data && data.purchaseOrders && data.purchaseOrders.length > 0 && (
        <PurchaseOrdersTable purchaseOrders={data.purchaseOrders} />
      )}
    </div>
  );
};

export default InvoiceDetailsWrapper;
