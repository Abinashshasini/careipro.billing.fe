'use client';
import React, { FC, useState } from 'react';
import { IoMdSearch } from 'react-icons/io';
import { LuCalendarArrowUp } from 'react-icons/lu';
import { FaRegAddressBook } from 'react-icons/fa';
import { TbSortAscending } from 'react-icons/tb';

import { SearchBar } from '@/components/ui/searchbar';
import apiClient from '@/lib/apiClient';
import { TDistributor, DistributorListWraperProps } from '@/types/purchases';
import { useQuery } from '@tanstack/react-query';
import { DistributorShimmer } from '@/components/shimmers/distributor-shimmer';
import DistributorOrInvoiceList from './distributor-or-invoice-list';
import DateRangeFilter from './date-range-filter';
import SortFilter, { SortOption } from './sort-filter';
import { useRouter } from 'next/navigation';
import { GET_DISTRIBUTORS } from '@/utils/api-endpoints';

const DistibutorListWraper: FC<DistributorListWraperProps> = ({
  selectedDistributorId,
  setSelectedDistributorId,
  refreshDistributorList,
  openDistributorModal,
}) => {
  const router = useRouter();
  /** Required states and  */
  const [query, setQuery] = useState('');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showSortFilter, setShowSortFilter] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [selectedSort, setSelectedSort] = useState<SortOption | null>(null);

  /** API call */
  const fetchData = async (): Promise<TDistributor[]> => {
    const { data } = await apiClient.get<{
      data: { distributors: TDistributor[] };
    }>(GET_DISTRIBUTORS, {
      params: { sortBy: selectedSort, dateFrom, dateTo, status: 'active' },
    });
    return data.data.distributors;
  };

  const { data, isLoading } = useQuery<TDistributor[]>({
    queryKey: [
      'distributors',
      selectedSort,
      dateFrom,
      dateTo,
      refreshDistributorList,
    ],
    queryFn: fetchData,
    staleTime: 1000 * 60 * 5,
  });

  const filteredData = data?.filter((supplier) => {
    const matchesText =
      supplier.distributor_name.toLowerCase().includes(query.toLowerCase()) ||
      supplier.gst_number.toLowerCase().includes(query.toLowerCase());
    return matchesText;
  });

  /** Function to replace the route with distributor ID */
  const handleSelectDistributor = (distributorId: string) => {
    setSelectedDistributorId(distributorId);
    router.replace(`/dashboard/purchases?distributorId=${distributorId}`);
  };

  /** Function to handle distributor description */
  const handleDistributorDescription = (distributor: TDistributor) => {
    const lastInvoiceDate = distributor.last_invoice_date
      ? new Date(distributor.last_invoice_date).toLocaleDateString()
      : 'NA';
    const lastInvoiceNo = distributor.last_invoice_no ?? 'NA';
    return `Last Txn: ${lastInvoiceDate} | Invoice No: ${lastInvoiceNo}`;
  };

  /** Function to open distributor modal */
  const handleOpenAddDistributorModal = () => {
    openDistributorModal();
  };

  return (
    <div className="h-full">
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
          onClick={handleOpenAddDistributorModal}
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
            onApply={(dateFrom, dateTo) => {
              setDateFrom(dateFrom);
              setDateTo(dateTo);
            }}
            title="Sort by purchase date"
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
          Select a distributor to get&nbsp;
          <span className="underline font-semibold cursor-pointer">
            Invoice Lists
          </span>
        </h3>
      </div>

      <div className="relative w-full h-[calc(100%-203px)] overflow-scroll no-scrollbar">
        {/* Distributor List */}
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
              key={element._id}
              title={`${element.distributor_name} | (${element.gst_number})`}
              description={handleDistributorDescription(element)}
              address={element.address || ''}
              seleceted={selectedDistributorId === element._id}
              onClick={() => handleSelectDistributor(element._id)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <FaRegAddressBook size={60} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No Distributors Available
            </h3>
            <p className="text-sm text-gray-500 mb-6 text-center">
              Add a distributor to manage purchases{' '}
              <span
                onClick={() => openDistributorModal()}
                className="underline text-sm text-gray-500 cursor-pointer"
              >
                add distributor
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DistibutorListWraper;
