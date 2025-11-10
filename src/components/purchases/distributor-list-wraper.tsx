import React, { FC, useState } from 'react';
import { IoMdSearch } from 'react-icons/io';
import { LuCalendarArrowUp } from 'react-icons/lu';
import { FaRegAddressBook } from 'react-icons/fa';
import { TbSortAscending } from 'react-icons/tb';

import { SearchBar } from '@/components/ui/searchbar';
import apiClient from '@/lib/apiClient';
import { TSupplier } from '@/types/purchases';
import { useQuery } from '@tanstack/react-query';
import { DistributorShimmer } from '@/components/shimmers/distributor-shimmer';
import DistributorOrInvoiceList from './distributor-or-invoice-list';
import DateRangeFilter from './date-range-filter';
import SortFilter, { SortOption } from './sort-filter';
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
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showSortFilter, setShowSortFilter] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption | null>(null);

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

  /** Search + Date range filter */
  const filteredData = data?.filter((supplier) => {
    const matchesText =
      supplier.supplier_name.toLowerCase().includes(query.toLowerCase()) ||
      supplier.gst_number.toLowerCase().includes(query.toLowerCase());

    // If query contains a date or date range 'YYYY-MM-DD' or 'YYYY-MM-DD|YYYY-MM-DD', respect that
    if (query.includes('|')) {
      const [fromStr, toStr] = query.split('|');
      const from = new Date(fromStr);
      const to = new Date(toStr);
      const invoiceDate = supplier.last_invoice_date
        ? new Date(supplier.last_invoice_date)
        : null;
      if (!invoiceDate) return false;
      return invoiceDate >= from && invoiceDate <= to;
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(query)) {
      // exact date search
      return supplier.last_invoice_date === query || matchesText;
    }

    return matchesText;
  });

  /** Function to handle search by date */
  const handleSearchByDate = (from: Date | null, to: Date | null) => {
    if (from && to && from.getTime() === to.getTime()) {
      setQuery(from.toISOString().split('T')[0]);
    } else if (from && to) {
      setQuery(
        `${from.toISOString().split('T')[0]}|${to.toISOString().split('T')[0]}`,
      );
    } else {
      setQuery('');
    }
  };
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
        <div className="relative">
          <div
            className="border border-border rounded-lg p-2 hover:bg-grayLight transition bg-bg-secondary"
            onClick={() => setShowDateFilter((prev) => !prev)}
          >
            <LuCalendarArrowUp
              size={23}
              className="text-black cursor-pointer"
            />
          </div>
          <DateRangeFilter
            isOpen={showDateFilter}
            onClose={() => setShowDateFilter(false)}
            onApply={handleSearchByDate}
          />
        </div>
        <div className="relative">
          <div
            className="border border-border rounded-lg p-2 hover:bg-grayLight transition bg-bg-secondary"
            onClick={() => setShowSortFilter((s) => !s)}
          >
            <TbSortAscending size={23} className="text-black cursor-pointer" />
          </div>
          <SortFilter
            isOpen={showSortFilter}
            selected={selectedSort}
            onClose={() => setShowSortFilter(false)}
            onSelect={(opt) => setSelectedSort(opt)}
          />
        </div>
      </div>

      {/* Info Banner */}
      <div>
        <h3 className="font-medium text-sm px-4 py-2 pl-4 border-b border-border bg-shade-yellow">
          Select an invoice to get&nbsp;
          <span className="underline font-semibold">Invoice Lists</span>
        </h3>
      </div>

      <div className="relative w-full h-[calc(100%-140px)] overflow-hidden">
        {/* Distributor List */}
        <div className="w-full h-full ">
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
                amount={Number(element.last_invoice_amount) || 0}
                distributorId={element.supplier_id}
                seleceted={selectedDistributorId === element.supplier_id}
                onClick={() => setSelectedDistributorId(element.supplier_id)}
              />
            ))
          ) : (
            <>
              <DistributorOrInvoiceList
                title="MedPlus Healthcare Solutions | (29AABCT1332L1ZW)"
                date="Last Txn: 2024-11-01"
                amount={125000}
                distributorId={1}
                seleceted={selectedDistributorId === 1}
                onClick={() => setSelectedDistributorId(1)}
              />
              <DistributorOrInvoiceList
                title="Apollo Pharmacy Distributors | (27AABCA3842M1Z5)"
                date="Last Txn: 2024-10-28"
                amount={87500}
                distributorId={2}
                seleceted={selectedDistributorId === 2}
                onClick={() => setSelectedDistributorId(2)}
              />
              <DistributorOrInvoiceList
                title="Wellness Forever Medical | (24AACFW3421N1ZQ)"
                date="Last Txn: 2024-10-25"
                amount={95250}
                distributorId={3}
                seleceted={selectedDistributorId === 3}
                onClick={() => setSelectedDistributorId(3)}
              />
              <DistributorOrInvoiceList
                title="HealthKart Pharmaceuticals | (07AABCH9645P1Z2)"
                date="Last Txn: 2024-10-20"
                amount={156800}
                distributorId={4}
                seleceted={selectedDistributorId === 4}
                onClick={() => setSelectedDistributorId(4)}
              />
              <DistributorOrInvoiceList
                title="Guardian Medical Distribution | (33AACFG7890R1ZK)"
                date="Last Txn: 2024-10-15"
                amount={72300}
                distributorId={5}
                seleceted={selectedDistributorId === 5}
                onClick={() => setSelectedDistributorId(5)}
              />
            </>
          )}
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
