import React, { FC, useState } from 'react';
import { IoMdSearch } from 'react-icons/io';
import { LuCalendarArrowUp } from 'react-icons/lu';
import { FaRegAddressBook } from 'react-icons/fa';
import { TbSortAscending } from 'react-icons/tb';
import { IoChevronBackOutline } from 'react-icons/io5';

import { SearchBar } from '@/components/ui/searchbar';
import apiClient from '@/lib/apiClient';
import { TSupplier } from '@/types/purchases';
import { useQuery } from '@tanstack/react-query';
import { DistributorShimmer } from '@/components/shimmers/distributor-shimmer';
import DistributorOrInvoiceList from './distributor-or-invoice-list';
import { NoData } from '@/components/ui/no-data';
import AddDistributorModal from './add-distributors';

type SuppliersListProps = {
  data: TSupplier[];
};

interface DistributorListWraperProps {
  selectedDistributorId: number | null;
  setSelectedDistributorId: React.Dispatch<React.SetStateAction<number | null>>;
}

const DistibutorListWraper: FC<DistributorListWraperProps> = ({
  selectedDistributorId,
  setSelectedDistributorId,
}) => {
  /** Required states and  */
  const [query, setQuery] = useState('');
  const [openAddDistributorModal, setOpenAddDistributorModal] = useState(false);

  /** API call */
  const fetchData = async (): Promise<TSupplier[]> => {
    const { data } = await apiClient.get<SuppliersListProps>(
      '/suppliers/get-distributors',
    );
    return data.data;
  };

  const { data, isLoading } = useQuery<TSupplier[]>({
    queryKey: ['suppliers'],
    queryFn: fetchData,
    staleTime: 1000 * 60 * 5,
  });

  /** Search filter */
  const filteredData = data?.filter(
    (supplier) =>
      supplier.supplier_name.toLowerCase().includes(query.toLowerCase()) ||
      supplier.gst_number.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-xl font-bold">Purchases</h3>
            <p className="text-gray text-md">View or Edit Purchases</p>
          </div>
        </div>
        <div
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:opacity-90 transition"
          onClick={() => setOpenAddDistributorModal(true)}
        >
          <FaRegAddressBook className="mr-2" />
          Add Distributors
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-4 border-b border-border pb-6 p-4">
        <SearchBar
          placeholder="Search by Name or GSTIN"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="text-semibold"
          icon={<IoMdSearch size={20} className="text-black" />}
        />
        <div className="border border-border rounded-lg p-2 hover:bg-grayLight transition bg-bg-secondary">
          <LuCalendarArrowUp size={23} className="text-black cursor-pointer" />
        </div>
        <div className="border border-border rounded-lg p-2 hover:bg-grayLight transition bg-bg-secondary">
          <TbSortAscending size={23} className="text-black cursor-pointer" />
        </div>
      </div>

      {/* Info Banner */}
      <div>
        <h3 className="font-medium text-sm px-4 py-2 pl-4 border-b border-border bg-shade-yellow">
          {selectedDistributorId ? (
            <>
              Select an invoice to get&nbsp;
              <span className="underline font-semibold">Purchase Details</span>
            </>
          ) : (
            <>
              Select a distributor to view their&nbsp;
              <span className="underline font-semibold">Invoices</span>
            </>
          )}
        </h3>
      </div>

      {/* Animated Lists */}
      <div className="relative w-full h-[calc(100%-140px)] overflow-hidden">
        {/* Distributor List */}
        <div
          className={`absolute top-0 left-0 w-full h-full transition-transform duration-300 ${
            selectedDistributorId ? '-translate-x-full' : 'translate-x-0'
          }`}
        >
          {isLoading ? (
            <>
              {Array(7)
                .fill(0)
                .map((_, index) => (
                  <DistributorShimmer key={index} />
                ))}
            </>
          ) : filteredData && filteredData.length > 0 ? (
            filteredData.map((element) => (
              <DistributorOrInvoiceList
                key={element.supplier_id}
                title={`${element.supplier_name} | (${element.gst_number})`}
                date={`Last Txn: ${element.last_invoice_date || 'NA'}`}
                amount={element.last_invoice_amount || 0}
                distributorId={element.supplier_id}
                seleceted={selectedDistributorId === element.supplier_id}
                onClick={() => setSelectedDistributorId(element.supplier_id)}
              />
            ))
          ) : (
            <NoData message="No suppliers available" />
          )}
        </div>

        {/* Invoice List */}
        <div
          className={`absolute top-0 left-0 w-full h-full transition-transform duration-300 ${
            selectedDistributorId ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-4 flex items-center gap-2">
            <IoChevronBackOutline
              size={20}
              onClick={() => setSelectedDistributorId(null)}
              className="cursor-pointer"
            />
            <div>
              <h3 className="text-md font-regular text-gray">
                Showing Invoices for this distributor
              </h3>
            </div>
          </div>
        </div>

        {/* Add distributor modal  */}
        <AddDistributorModal
          isOpen={openAddDistributorModal}
          onClose={() => setOpenAddDistributorModal(false)}
        />
      </div>
    </>
  );
};

export default DistibutorListWraper;
