'use client';
import React, { useState } from 'react';
import { IoMdAdd, IoMdSearch } from 'react-icons/io';
import { MdFilterList } from 'react-icons/md';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { GET_CUSTOMERS } from '@/utils/api-endpoints';
import { TCustomer } from '@/types/sells';
import CustomerCard from './customer-card';
import { DistributorShimmer } from '@/components/shimmers/distributor-shimmer';
import { NoData } from '@/components/ui/no-data';
import { SearchBar } from '@/components/ui/searchbar';
import Tooltip from '@/components/ui/tooltip';

interface CustomerListWrapperProps {
  selectedCustomerId: string | null;
  setSelectedCustomerId: React.Dispatch<React.SetStateAction<string | null>>;
  refreshCustomerList: number;
  openCustomerModal: () => void;
}

const CustomerListWrapper: React.FC<CustomerListWrapperProps> = ({
  selectedCustomerId,
  setSelectedCustomerId,
  refreshCustomerList,
  openCustomerModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'recent'>('all');

  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers', refreshCustomerList],
    queryFn: async () => {
      const response = await apiClient.get(GET_CUSTOMERS);
      return response.data.data as TCustomer[];
    },
  });

  const filteredCustomers = customers?.filter((customer) => {
    const matchesSearch =
      customer.customer_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      customer.mobile_number.includes(searchQuery);

    return matchesSearch;
  });

  const customerCount = filteredCustomers?.length || 0;
  const hasActiveFilters = searchQuery.length > 0 || filterType !== 'all';

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Customers</h2>
            <p className="text-xs text-gray-600 mt-0.5">
              {customerCount} customer{customerCount !== 1 ? 's' : ''} found
            </p>
          </div>
          <Tooltip content="Add Customer" position="left">
            <button
              onClick={openCustomerModal}
              className="p-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <IoMdAdd size={20} />
            </button>
          </Tooltip>
        </div>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search customers..."
          icon={<IoMdSearch size={18} />}
        />

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 mt-3">
          <Tooltip content="All Customers" position="top">
            <button
              onClick={() => setFilterType('all')}
              className={`relative p-2 rounded-lg transition-colors ${
                filterType === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <MdFilterList size={16} />
              {filterType === 'all' && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-white text-primary text-[10px] font-bold rounded-full flex items-center justify-center">
                  {customerCount}
                </span>
              )}
            </button>
          </Tooltip>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="text-gray-600">Filters:</span>
            {searchQuery && (
              <span className="px-2 py-1 bg-blue-100 text-primary rounded">
                Search: "{searchQuery}"
              </span>
            )}
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterType('all');
              }}
              className="text-primary hover:underline ml-auto"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Customer List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <DistributorShimmer count={5} />
        ) : filteredCustomers && filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (
            <CustomerCard
              key={customer._id}
              title={customer.customer_name}
              description={customer.mobile_number}
              address={
                customer.city && customer.state
                  ? `${customer.city}, ${customer.state}`
                  : customer.city || customer.state || ''
              }
              selected={selectedCustomerId === customer._id}
              onClick={() => setSelectedCustomerId(customer._id)}
            />
          ))
        ) : (
          <NoData
            message={
              hasActiveFilters
                ? 'No customers match your filters'
                : 'No customers found'
            }
            description={
              hasActiveFilters
                ? 'Try adjusting your search or filters'
                : 'Add your first customer to get started'
            }
          />
        )}
      </div>
    </div>
  );
};

export default CustomerListWrapper;
