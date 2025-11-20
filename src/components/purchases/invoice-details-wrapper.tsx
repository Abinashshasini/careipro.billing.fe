'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IoMdAdd } from 'react-icons/io';
import { useSearchParams } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { TDistributor } from '@/types/purchases';
import { useQuery } from '@tanstack/react-query';

type DistributorListProps = {
  data: TDistributor;
};

interface InvoiceDetailsWrapperProps {
  selectedDistributorId?: string | null;
}

const InvoiceDetailsWrapper = ({
  selectedDistributorId,
}: InvoiceDetailsWrapperProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const distributorId = searchParams.get('distributorId');

  /** API call */
  const fetchData = async (): Promise<TDistributor> => {
    const { data } = await apiClient.get<DistributorListProps>(
      '/billing-dashboard/get-distributors',
      { params: { distributor_id: selectedDistributorId || distributorId } },
    );
    return data.data;
  };

  const { data, isLoading } = useQuery<TDistributor>({
    queryKey: [`${distributorId}-distributors`],
    queryFn: fetchData,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (selectedDistributorId || distributorId) {
      fetchData();
    }
  }, [selectedDistributorId, distributorId]);

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
        {data && (
          <div className="flex gap-4">
            <div className="h-15 w-15 flex items-center justify-center font-bold text-2xl bg-bg-primary rounded-lg text-primary">
              {data.distributor_name &&
                data.distributor_name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="text-lg font-medium">
                {data.distributor_name}&nbsp;({data.gst_number})
              </div>
              <div className="text-sm text-gray flex gap-4">
                <p>
                  {data.state},&nbsp;{data.mobile_number}
                </p>
              </div>

              <div className="flex gap-2 mt-2">
                <div className="text-sm">
                  Last Invoice -
                  <span
                    className={`${
                      data.last_invoice_no ? 'text-black' : 'text-input-border'
                    } font-medium ml-2`}
                  >
                    {data.last_invoice_no || '#12345'}
                  </span>
                  <span
                    className={`${
                      data.last_invoice_no ? 'text-black' : 'text-input-border'
                    } font-medium`}
                  >
                    &nbsp;on {data.last_invoice_date || '#2024-01-01'}
                  </span>
                </div>
                <div className="text-sm">
                  Total Amount -
                  <span
                    className={`${
                      data.last_invoice_no ? 'text-black' : 'text-input-border'
                    } font-medium ml-2`}
                  >
                    ₹{data.last_invoice_amount || '0.00'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetailsWrapper;
