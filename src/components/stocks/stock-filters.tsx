'use client';
import React, { useState } from 'react';
import { IoSearch } from 'react-icons/io5';
import { FiFilter } from 'react-icons/fi';
import Select from 'react-select';

interface FilterOption {
  value: string;
  label: string;
}

interface StockFiltersProps {
  onSearch: (searchTerm: string) => void;
  onFilterChange: (filters: {
    status?: string;
    stockLevel?: string;
    manufacturer?: string;
  }) => void;
  manufacturers?: string[];
}

const StockFilters: React.FC<StockFiltersProps> = ({
  onSearch,
  onFilterChange,
  manufacturers = [],
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<FilterOption | null>(
    null,
  );
  const [selectedStockLevel, setSelectedStockLevel] =
    useState<FilterOption | null>(null);
  const [selectedManufacturer, setSelectedManufacturer] =
    useState<FilterOption | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const statusOptions: FilterOption[] = [
    { value: 'all', label: 'All Status' },
    { value: 'in-stock', label: 'In Stock' },
    { value: 'low-stock', label: 'Low Stock' },
    { value: 'out-of-stock', label: 'Out of Stock' },
  ];

  const stockLevelOptions: FilterOption[] = [
    { value: 'all', label: 'All Levels' },
    { value: 'high', label: 'High Stock' },
    { value: 'medium', label: 'Medium Stock' },
    { value: 'low', label: 'Low Stock' },
    { value: 'critical', label: 'Critical Stock' },
  ];

  const manufacturerOptions: FilterOption[] = [
    { value: 'all', label: 'All Manufacturers' },
    ...manufacturers.map((mfr) => ({ value: mfr, label: mfr })),
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleStatusChange = (option: FilterOption | null) => {
    setSelectedStatus(option);
    onFilterChange({
      status: option?.value !== 'all' ? option?.value : undefined,
      stockLevel:
        selectedStockLevel?.value !== 'all'
          ? selectedStockLevel?.value
          : undefined,
      manufacturer:
        selectedManufacturer?.value !== 'all'
          ? selectedManufacturer?.value
          : undefined,
    });
  };

  const handleStockLevelChange = (option: FilterOption | null) => {
    setSelectedStockLevel(option);
    onFilterChange({
      status:
        selectedStatus?.value !== 'all' ? selectedStatus?.value : undefined,
      stockLevel: option?.value !== 'all' ? option?.value : undefined,
      manufacturer:
        selectedManufacturer?.value !== 'all'
          ? selectedManufacturer?.value
          : undefined,
    });
  };

  const handleManufacturerChange = (option: FilterOption | null) => {
    setSelectedManufacturer(option);
    onFilterChange({
      status:
        selectedStatus?.value !== 'all' ? selectedStatus?.value : undefined,
      stockLevel:
        selectedStockLevel?.value !== 'all'
          ? selectedStockLevel?.value
          : undefined,
      manufacturer: option?.value !== 'all' ? option?.value : undefined,
    });
  };

  const clearFilters = () => {
    setSelectedStatus(null);
    setSelectedStockLevel(null);
    setSelectedManufacturer(null);
    setSearchTerm('');
    onSearch('');
    onFilterChange({});
  };

  const hasActiveFilters =
    selectedStatus || selectedStockLevel || selectedManufacturer || searchTerm;

  return (
    <div className="w-full mb-4">
      {/* Combined Search and Filters Row */}
      <div className="flex gap-3 items-start">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <IoSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by medicine, batch, or manufacturer..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 items-center">
          {/* Status Filter */}
          <div className="w-44">
            <Select
              value={selectedStatus}
              onChange={handleStatusChange}
              options={statusOptions}
              placeholder="Status"
              isClearable
              isSearchable={false}
              styles={{
                control: (base, state) => ({
                  ...base,
                  minHeight: '38px',
                  fontSize: '0.875rem',
                  borderRadius: '0.5rem',
                  borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
                  boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
                  '&:hover': {
                    borderColor: '#3b82f6',
                  },
                }),
                placeholder: (base) => ({
                  ...base,
                  fontSize: '0.875rem',
                  fontWeight: '400',
                  color: '#9ca3af',
                }),
                singleValue: (base) => ({
                  ...base,
                  fontSize: '0.875rem',
                  fontWeight: '500',
                }),
                option: (base, state) => ({
                  ...base,
                  fontSize: '0.875rem',
                  fontWeight: '400',
                  backgroundColor: state.isSelected
                    ? '#3b82f6'
                    : state.isFocused
                      ? '#dbeafe'
                      : 'white',
                  color: state.isSelected ? 'white' : '#1f2937',
                }),
                menu: (base) => ({
                  ...base,
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }),
              }}
            />
          </div>

          {/* Stock Level Filter */}
          <div className="w-44">
            <Select
              value={selectedStockLevel}
              onChange={handleStockLevelChange}
              options={stockLevelOptions}
              placeholder="Level"
              isClearable
              isSearchable={false}
              styles={{
                control: (base, state) => ({
                  ...base,
                  minHeight: '38px',
                  fontSize: '0.875rem',
                  borderRadius: '0.5rem',
                  borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
                  boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
                  '&:hover': {
                    borderColor: '#3b82f6',
                  },
                }),
                placeholder: (base) => ({
                  ...base,
                  fontSize: '0.875rem',
                  fontWeight: '400',
                  color: '#9ca3af',
                }),
                singleValue: (base) => ({
                  ...base,
                  fontSize: '0.875rem',
                  fontWeight: '500',
                }),
                option: (base, state) => ({
                  ...base,
                  fontSize: '0.875rem',
                  fontWeight: '400',
                  backgroundColor: state.isSelected
                    ? '#3b82f6'
                    : state.isFocused
                      ? '#dbeafe'
                      : 'white',
                  color: state.isSelected ? 'white' : '#1f2937',
                }),
                menu: (base) => ({
                  ...base,
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }),
              }}
            />
          </div>

          {/* Manufacturer Filter */}
          <div className="w-52">
            <Select
              value={selectedManufacturer}
              onChange={handleManufacturerChange}
              options={manufacturerOptions}
              placeholder="Manufacturer"
              isClearable
              isSearchable
              styles={{
                control: (base, state) => ({
                  ...base,
                  minHeight: '38px',
                  fontSize: '0.875rem',
                  borderRadius: '0.5rem',
                  borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
                  boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
                  '&:hover': {
                    borderColor: '#3b82f6',
                  },
                }),
                placeholder: (base) => ({
                  ...base,
                  fontSize: '0.875rem',
                  fontWeight: '400',
                  color: '#9ca3af',
                }),
                singleValue: (base) => ({
                  ...base,
                  fontSize: '0.875rem',
                  fontWeight: '500',
                }),
                input: (base) => ({
                  ...base,
                  fontSize: '0.875rem',
                }),
                option: (base, state) => ({
                  ...base,
                  fontSize: '0.875rem',
                  fontWeight: '400',
                  backgroundColor: state.isSelected
                    ? '#3b82f6'
                    : state.isFocused
                      ? '#dbeafe'
                      : 'white',
                  color: state.isSelected ? 'white' : '#1f2937',
                }),
                menu: (base) => ({
                  ...base,
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }),
              }}
            />
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition whitespace-nowrap"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockFilters;
