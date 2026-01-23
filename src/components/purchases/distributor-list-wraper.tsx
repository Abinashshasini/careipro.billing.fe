'use client';
import React, { FC, useState } from 'react';
import { IoMdSearch } from 'react-icons/io';
import { LuCalendarArrowUp } from 'react-icons/lu';
import { FaRegAddressBook } from 'react-icons/fa';
import { TbSortAscending } from 'react-icons/tb';
import { IoClose } from 'react-icons/io5';

import { SearchBar } from '@/components/ui/searchbar';
import Tooltip from '@/components/ui/tooltip';
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

  const SORT_LABELS: Record<Exclude<SortOption, null>, string> = {
    lastAddedFirst: 'Last Added First',
    lastTxnAtoZ: 'Last Txn A to Z',
    lastTxnZtoA: 'Last Txn Z to A',
    balanceHighToLow: 'Balance High to Low',
    balanceLowToHigh: 'Balance Low to High',
    nameAtoZ: 'Name A to Z',
    nameZtoA: 'Name Z to A',
  };

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

  const hasActiveFilters = !!dateFrom || !!dateTo || !!selectedSort;
  const activeFilterCount =
    (dateFrom || dateTo ? 1 : 0) + (selectedSort ? 1 : 0);

  /** Function to replace the route with distributor ID */
  const handleSelectDistributor = (distributorId: string) => {
    setSelectedDistributorId(distributorId);
    router.replace(`/dashboard/purchases?distributorId=${distributorId}`);
  };

  /** Clear all filters */
  const handleClearFilters = () => {
    setDateFrom(null);
    setDateTo(null);
    setSelectedSort(null);
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
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-black">Distributors</h3>
            <p className="text-gray-600 text-sm">
              {isLoading ? (
                'Loading...'
              ) : (
                <>
                  {data?.length || 0} distributor{data?.length !== 1 ? 's' : ''}
                  {filteredData && filteredData.length !== data?.length && (
                    <span className="text-primary font-medium">
                      {' · '}
                      {filteredData.length} shown
                    </span>
                  )}
                </>
              )}
            </p>
          </div>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-semibold text-sm shadow-sm"
          onClick={handleOpenAddDistributorModal}
        >
          <FaRegAddressBook size={18} />
          Add Distributor
        </button>
      </div>

      {/* Search + Filters */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <SearchBar
            placeholder="Search by Name or GSTIN"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 font-semibold"
            icon={<IoMdSearch size={20} className="text-gray-500" />}
          />

          {/* Date Range Filter */}
          <div className="relative">
            <Tooltip content="Filter by Date Range" position="top">
              <button
                className={`relative p-2.5 border rounded-lg transition ${
                  dateFrom || dateTo
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
                onClick={() => setShowDateFilter((prev) => !prev)}
              >
                <LuCalendarArrowUp size={20} />
                {(dateFrom || dateTo) && (
                  <span className="absolute -top-1 -right-1 bg-white text-primary text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center border border-primary">
                    1
                  </span>
                )}
              </button>
            </Tooltip>
            <DateRangeFilter
              isOpen={showDateFilter}
              onClose={() => setShowDateFilter(false)}
              onApply={(dateFrom, dateTo) => {
                setDateFrom(dateFrom);
                setDateTo(dateTo);
              }}
              title="Filter by purchase date"
            />
          </div>

          {/* Sort Filter */}
          <div className="relative">
            <Tooltip content="Sort Distributors" position="top">
              <button
                className={`relative p-2.5 border rounded-lg transition ${
                  selectedSort
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
                onClick={() => setShowSortFilter((s) => !s)}
              >
                <TbSortAscending size={20} />
                {selectedSort && (
                  <span className="absolute -top-1 -right-1 bg-white text-primary text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center border border-primary">
                    1
                  </span>
                )}
              </button>
            </Tooltip>
            <SortFilter
              isOpen={showSortFilter}
              selected={selectedSort}
              onClose={() => setShowSortFilter(false)}
              onSelect={(opt) => setSelectedSort(opt)}
            />
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Tooltip content="Clear All Filters" position="top">
              <button
                className="p-2.5 text-red-600 hover:bg-red-50 border border-red-300 rounded-lg transition"
                onClick={handleClearFilters}
              >
                <IoClose size={20} />
              </button>
            </Tooltip>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-xs font-medium text-gray-600">
              Active filters:
            </span>
            {(dateFrom || dateTo) && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                Date: {dateFrom?.toLocaleDateString() || 'Start'} -{' '}
                {dateTo?.toLocaleDateString() || 'End'}
              </span>
            )}
            {selectedSort && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                Sort: {SORT_LABELS[selectedSort]}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Info Banner */}
      {!isLoading && data && data.length > 0 && (
        <h3 className="font-medium text-sm px-4 py-2 pl-4 border-b border-border bg-shade-yellow">
          Select a distributor to get&nbsp;
          <span className="underline font-semibold cursor-pointer">
            Invoice Lists
          </span>
        </h3>
      )}

      <div className="flex-1 overflow-y-auto">
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
          <>
            {filteredData.map((element) => (
              <DistributorOrInvoiceList
                key={element._id}
                title={`${element.distributor_name} | (${element.gst_number})`}
                description={handleDistributorDescription(element)}
                address={element.address || ''}
                seleceted={selectedDistributorId === element._id}
                onClick={() => handleSelectDistributor(element._id)}
              />
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <FaRegAddressBook size={48} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {query || hasActiveFilters
                ? 'No Matching Distributors'
                : 'No Distributors Yet'}
            </h3>
            <p className="text-sm text-gray-600 mb-6 text-center max-w-sm">
              {query || hasActiveFilters ? (
                <>
                  No distributors match your {query ? 'search' : 'filters'}.
                  {query && (
                    <>
                      {' '}
                      <button
                        onClick={() => setQuery('')}
                        className="text-primary font-medium hover:underline"
                      >
                        Clear search
                      </button>
                    </>
                  )}
                  {hasActiveFilters && (
                    <>
                      {query ? ' or ' : ' '}
                      <button
                        onClick={handleClearFilters}
                        className="text-primary font-medium hover:underline"
                      >
                        clear filters
                      </button>
                    </>
                  )}{' '}
                  to see all distributors.
                </>
              ) : (
                <>
                  Get started by adding your first distributor to begin managing
                  purchases and tracking invoices.
                </>
              )}
            </p>
            {!query && !hasActiveFilters && (
              <button
                onClick={() => openDistributorModal()}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-semibold shadow-sm"
              >
                <FaRegAddressBook size={18} />
                Add Your First Distributor
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DistibutorListWraper;
