'use client';
import React, { useState, useMemo } from 'react';
import StockFilters from '@/components/stocks/stock-filters';
import StocksTable from '@/components/stocks/stocks-table-grouped';
import StockTableShimmer from '@/components/shimmers/stock-table-shimmer';

// Demo data - Replace with API call
const demoStocksData = [
  {
    _id: '1',
    name: 'Azithral 500 Tablet',
    manufacturer: 'Alembic Pharmaceuticals Ltd',
    type: 'Tablet',
    pack_size: '5',
    batch: {
      batch: '1234',
      pack: '10',
      expiry_mm: '12',
      expiry_yy: '27',
      rate: 12,
      mrp: 20,
      status: 'active',
    },
    available_qty: 22,
    reserved_qty: 0,
    reorder_level: 10,
    last_purchase_date: '2026-01-20T07:43:02.510+00:00',
    status: 'active',
  },
  {
    _id: '1-batch2',
    name: 'Azithral 500 Tablet',
    manufacturer: 'Alembic Pharmaceuticals Ltd',
    type: 'Tablet',
    pack_size: '5',
    batch: {
      batch: '5690',
      pack: '10',
      expiry_mm: '03',
      expiry_yy: '28',
      rate: 13,
      mrp: 20,
      status: 'active',
    },
    available_qty: 45,
    reserved_qty: 3,
    reorder_level: 10,
    last_purchase_date: '2026-01-21T08:30:00.000+00:00',
    status: 'active',
  },
  {
    _id: '2',
    name: 'Paracetamol 650mg',
    manufacturer: 'Sun Pharma',
    type: 'Tablet',
    pack_size: '10',
    batch: {
      batch: '5678',
      pack: '10',
      expiry_mm: '08',
      expiry_yy: '26',
      rate: 8,
      mrp: 15,
      status: 'active',
    },
    available_qty: 5,
    reserved_qty: 2,
    reorder_level: 20,
    last_purchase_date: '2026-01-18T10:30:00.000+00:00',
    status: 'active',
  },
  {
    _id: '3',
    name: 'Amoxicillin 500mg Capsule',
    manufacturer: 'Cipla Ltd',
    type: 'Capsule',
    pack_size: '10',
    batch: {
      batch: 'AMX123',
      pack: '10',
      expiry_mm: '06',
      expiry_yy: '27',
      rate: 25,
      mrp: 40,
      status: 'active',
    },
    available_qty: 150,
    reserved_qty: 10,
    reorder_level: 30,
    last_purchase_date: '2026-01-15T14:20:00.000+00:00',
    status: 'active',
  },
  {
    _id: '3-batch2',
    name: 'Amoxicillin 500mg Capsule',
    manufacturer: 'Cipla Ltd',
    type: 'Capsule',
    pack_size: '10',
    batch: {
      batch: 'AMX456',
      pack: '10',
      expiry_mm: '09',
      expiry_yy: '27',
      rate: 26,
      mrp: 42,
      status: 'active',
    },
    available_qty: 75,
    reserved_qty: 5,
    reorder_level: 30,
    last_purchase_date: '2026-01-19T16:45:00.000+00:00',
    status: 'active',
  },
  {
    _id: '3-batch3',
    name: 'Amoxicillin 500mg Capsule',
    manufacturer: 'Cipla Ltd',
    type: 'Capsule',
    pack_size: '10',
    batch: {
      batch: 'AMX789',
      pack: '10',
      expiry_mm: '12',
      expiry_yy: '27',
      rate: 27,
      mrp: 42,
      status: 'active',
    },
    available_qty: 30,
    reserved_qty: 0,
    reorder_level: 30,
    last_purchase_date: '2026-01-20T14:20:00.000+00:00',
    status: 'active',
  },
  {
    _id: '4',
    name: 'Dolo 650 Tablet',
    manufacturer: 'Micro Labs',
    type: 'Tablet',
    pack_size: '15',
    batch: {
      batch: 'DOL456',
      pack: '15',
      expiry_mm: '03',
      expiry_yy: '26',
      rate: 10,
      mrp: 18,
      status: 'active',
    },
    available_qty: 0,
    reserved_qty: 0,
    reorder_level: 50,
    last_purchase_date: '2025-12-20T09:15:00.000+00:00',
    status: 'active',
  },
  {
    _id: '5',
    name: 'Crocin Advance Tablet',
    manufacturer: 'GSK Pharmaceuticals',
    type: 'Tablet',
    pack_size: '15',
    batch: {
      batch: 'CRC789',
      pack: '15',
      expiry_mm: '11',
      expiry_yy: '26',
      rate: 12,
      mrp: 22,
      status: 'active',
    },
    available_qty: 85,
    reserved_qty: 5,
    reorder_level: 25,
    last_purchase_date: '2026-01-19T11:45:00.000+00:00',
    status: 'active',
  },
];

const StockContainer = () => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<{
    status?: string;
    stockLevel?: string;
    manufacturer?: string;
  }>({});

  // Get unique manufacturers from demo data
  const manufacturers = useMemo(() => {
    const uniqueMfrs = new Set(
      demoStocksData.map((stock) => stock.manufacturer),
    );
    return Array.from(uniqueMfrs);
  }, []);

  // Calculate stock statistics
  const stockStats = useMemo(() => {
    const totalSKU = demoStocksData.length;
    const totalValue = demoStocksData.reduce(
      (sum, stock) => sum + stock.available_qty * stock.batch.rate,
      0,
    );
    const lowStock = demoStocksData.filter(
      (s) => s.available_qty > 0 && s.available_qty <= s.reorder_level,
    ).length;
    const outOfStock = demoStocksData.filter(
      (s) => s.available_qty === 0,
    ).length;

    // Check for expiring soon (within 3 months)
    const today = new Date();
    const threeMonthsFromNow = new Date(today);
    threeMonthsFromNow.setMonth(today.getMonth() + 3);

    const expiringSoon = demoStocksData.filter((stock) => {
      const expiryDate = new Date(
        parseInt('20' + stock.batch.expiry_yy),
        parseInt(stock.batch.expiry_mm) - 1,
      );
      return expiryDate <= threeMonthsFromNow && expiryDate >= today;
    }).length;

    return { totalSKU, totalValue, lowStock, outOfStock, expiringSoon };
  }, []);

  // Filter stocks based on search and filters
  const filteredStocks = useMemo(() => {
    let filtered = [...demoStocksData];

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (stock) =>
          stock.name.toLowerCase().includes(search) ||
          stock.batch.batch.toLowerCase().includes(search) ||
          stock.manufacturer.toLowerCase().includes(search),
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter((stock) => {
        if (filters.status === 'in-stock')
          return stock.available_qty > stock.reorder_level;
        if (filters.status === 'low-stock')
          return (
            stock.available_qty > 0 &&
            stock.available_qty <= stock.reorder_level
          );
        if (filters.status === 'out-of-stock') return stock.available_qty === 0;
        return true;
      });
    }

    // Stock level filter
    if (filters.stockLevel) {
      filtered = filtered.filter((stock) => {
        const qty = stock.available_qty;
        const reorder = stock.reorder_level;
        if (filters.stockLevel === 'high') return qty > reorder * 2;
        if (filters.stockLevel === 'medium')
          return qty > reorder && qty <= reorder * 2;
        if (filters.stockLevel === 'low') return qty > 0 && qty <= reorder;
        if (filters.stockLevel === 'critical') return qty === 0;
        return true;
      });
    }

    // Manufacturer filter
    if (filters.manufacturer) {
      filtered = filtered.filter(
        (stock) => stock.manufacturer === filters.manufacturer,
      );
    }

    return filtered;
  }, [searchTerm, filters]);

  return (
    <div className="w-full bg-white rounded-lg h-full border-border relative p-6 overflow-hidden">
      {/* Header with Title */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-black">Stock Management</h1>
        <p className="text-sm text-gray-500">
          Monitor and manage your inventory
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
          <p className="text-xs font-semibold text-blue-600 uppercase mb-1">
            Total SKUs
          </p>
          <p className="text-2xl font-bold text-blue-900">
            {stockStats.totalSKU}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
          <p className="text-xs font-semibold text-green-600 uppercase mb-1">
            Stock Value
          </p>
          <p className="text-2xl font-bold text-green-900">
            ₹{(stockStats.totalValue / 1000).toFixed(1)}K
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
          <p className="text-xs font-semibold text-orange-600 uppercase mb-1">
            Low Stock
          </p>
          <p className="text-2xl font-bold text-orange-900">
            {stockStats.lowStock}
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
          <p className="text-xs font-semibold text-red-600 uppercase mb-1">
            Out of Stock
          </p>
          <p className="text-2xl font-bold text-red-900">
            {stockStats.outOfStock}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
          <p className="text-xs font-semibold text-purple-600 uppercase mb-1">
            Expiring Soon
          </p>
          <p className="text-2xl font-bold text-purple-900">
            {stockStats.expiringSoon}
          </p>
        </div>
      </div>

      {/* Quick Filter Buttons */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={() =>
            setFilters({
              ...filters,
              status: filters.status === 'low-stock' ? undefined : 'low-stock',
            })
          }
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            filters.status === 'low-stock'
              ? 'bg-orange-500 text-white'
              : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
          }`}
        >
          Low Stock ({stockStats.lowStock})
        </button>
        <button
          onClick={() =>
            setFilters({
              ...filters,
              status:
                filters.status === 'out-of-stock' ? undefined : 'out-of-stock',
            })
          }
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            filters.status === 'out-of-stock'
              ? 'bg-red-500 text-white'
              : 'bg-red-50 text-red-600 hover:bg-red-100'
          }`}
        >
          Out of Stock ({stockStats.outOfStock})
        </button>
        <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-50 text-purple-600 hover:bg-purple-100 transition">
          Expiring Soon ({stockStats.expiringSoon})
        </button>
        {(filters.status || filters.stockLevel || filters.manufacturer) && (
          <button
            onClick={() => setFilters({})}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Filters and Search */}
      <StockFilters
        onSearch={setSearchTerm}
        onFilterChange={setFilters}
        manufacturers={manufacturers}
      />

      {/* Stock Table */}
      {loading ? (
        <StockTableShimmer />
      ) : (
        <StocksTable stocks={filteredStocks} loading={loading} />
      )}
    </div>
  );
};

export default StockContainer;
