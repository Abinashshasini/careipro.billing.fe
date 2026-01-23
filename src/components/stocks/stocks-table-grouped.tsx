'use client';
import React, { useState, useMemo } from 'react';
import { FiEdit, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import Tooltip from '@/components/ui/tooltip';

interface StockBatch {
  batch: string;
  pack: string;
  expiry_mm: string;
  expiry_yy: string;
  rate: number;
  mrp: number;
  status: string;
}

interface StockMedicine {
  _id: string;
  name: string;
  manufacturer: string;
  type: string;
  pack_size: string;
  batch: StockBatch;
  available_qty: number;
  reserved_qty: number;
  reorder_level: number;
  last_purchase_date: string;
  status: string;
}

interface GroupedMedicine {
  name: string;
  manufacturer: string;
  type: string;
  totalAvailable: number;
  totalReserved: number;
  reorder_level: number;
  batches: StockMedicine[];
}

interface StocksTableProps {
  stocks: StockMedicine[];
  loading?: boolean;
}

const StocksTable: React.FC<StocksTableProps> = ({ stocks, loading }) => {
  const [expandedMedicines, setExpandedMedicines] = useState<Set<string>>(
    new Set(),
  );

  // Group stocks by medicine name
  const groupedStocks = useMemo(() => {
    const groups = new Map<string, GroupedMedicine>();

    stocks.forEach((stock) => {
      const key = stock.name;
      if (!groups.has(key)) {
        groups.set(key, {
          name: stock.name,
          manufacturer: stock.manufacturer,
          type: stock.type,
          totalAvailable: 0,
          totalReserved: 0,
          reorder_level: stock.reorder_level,
          batches: [],
        });
      }

      const group = groups.get(key)!;
      group.totalAvailable += stock.available_qty;
      group.totalReserved += stock.reserved_qty;
      group.batches.push(stock);
    });

    return Array.from(groups.values());
  }, [stocks]);

  const toggleExpand = (medicineName: string) => {
    const newExpanded = new Set(expandedMedicines);
    if (newExpanded.has(medicineName)) {
      newExpanded.delete(medicineName);
    } else {
      newExpanded.add(medicineName);
    }
    setExpandedMedicines(newExpanded);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getStatusColor = (qty: number, reorderLevel: number) => {
    if (qty === 0) return 'text-red-600 bg-red-50';
    if (qty <= reorderLevel) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  const getStatusText = (qty: number, reorderLevel: number) => {
    if (qty === 0) return 'Out of Stock';
    if (qty <= reorderLevel) return 'Low Stock';
    return 'In Stock';
  };

  return (
    <div className="w-full relative">
      <div
        className="w-full overflow-x-auto overflow-y-auto"
        style={{ maxHeight: 'calc(100vh - 340px)' }}
      >
        <table className="w-full border-collapse min-w-max">
        <thead className="sticky top-0 bg-white z-10 shadow-sm">
          <tr className="border-b-2 border-gray-200">
            <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase w-10"></th>
            <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase">
              Medicine
            </th>
            <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase">
              Batch / Expiry
            </th>
            <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase">
              Manufacturer
            </th>
            <th className="text-right p-3 text-xs font-semibold text-gray-600 uppercase">
              MRP / Rate
            </th>
            <th className="text-right p-3 text-xs font-semibold text-gray-600 uppercase">
              Stock Qty
            </th>
            <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase">
              Status
            </th>
            <th className="text-center p-3 text-xs font-semibold text-gray-600 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {groupedStocks.map((group, groupIndex) => {
            const isExpanded = expandedMedicines.has(group.name);
            const hasBatches = group.batches.length > 1;

            return (
              <React.Fragment key={group.name}>
                {/* Main Medicine Row */}
                <tr
                  onClick={() => hasBatches && toggleExpand(group.name)}
                  className={`border-b border-border transition-all duration-200 ${
                    groupIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } ${hasBatches ? 'cursor-pointer hover:bg-blue-50 hover:shadow-sm' : 'hover:bg-gray-100'}`}
                >
                  <td className="p-3">
                    {hasBatches && (
                      <div className="p-1 text-primary">
                        {isExpanded ? (
                          <FiChevronDown
                            size={18}
                            className="transition-transform"
                          />
                        ) : (
                          <FiChevronRight
                            size={18}
                            className="transition-transform"
                          />
                        )}
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="max-w-xs">
                      <p className="text-sm font-semibold text-black break-words">
                        {group.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-500">{group.type}</p>
                        {hasBatches && (
                          <span className="text-xs font-normal text-primary bg-primary-light px-2 py-0.5 rounded-full whitespace-nowrap">
                            {group.batches.length} batches
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    {!hasBatches ? (
                      <div>
                        <div className="text-sm font-medium text-gray-700">
                          {group.batches[0].batch.batch}
                        </div>
                        <div className="text-xs text-gray-500">
                          Exp: {group.batches[0].batch.expiry_mm}/
                          {group.batches[0].batch.expiry_yy} • 1×
                          {group.batches[0].batch.pack}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-xs font-medium text-primary">
                          {group.batches.length} different batches
                        </div>
                        <div className="text-xs text-gray-500">
                          Click to view details
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-gray-700">
                      {group.manufacturer}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {!hasBatches ? (
                      <div>
                        <div className="text-sm font-semibold text-gray-700">
                          ₹{group.batches[0].batch.mrp.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Rate: ₹{group.batches[0].batch.rate.toFixed(2)}
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-600">
                        <div>
                          ₹
                          {Math.min(
                            ...group.batches.map((b) => b.batch.mrp),
                          ).toFixed(0)}{' '}
                          - ₹
                          {Math.max(
                            ...group.batches.map((b) => b.batch.mrp),
                          ).toFixed(0)}
                        </div>
                        <div className="text-gray-400">
                          Rate: ₹
                          {Math.min(
                            ...group.batches.map((b) => b.batch.rate),
                          ).toFixed(0)}{' '}
                          - ₹
                          {Math.max(
                            ...group.batches.map((b) => b.batch.rate),
                          ).toFixed(0)}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <div>
                      <div
                        className={`text-base font-bold ${
                          group.totalAvailable <= group.reorder_level
                            ? 'text-orange-600'
                            : 'text-green-600'
                        }`}
                      >
                        {group.totalAvailable}
                      </div>
                      {group.totalReserved > 0 && (
                        <div className="text-xs text-gray-500">
                          ({group.totalReserved} reserved)
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        group.totalAvailable,
                        group.reorder_level,
                      )}`}
                    >
                      {getStatusText(group.totalAvailable, group.reorder_level)}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <Tooltip content="Edit Stock" position="top">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle edit
                        }}
                        className="p-2 hover:bg-primary hover:text-white rounded-lg transition-colors"
                      >
                        <FiEdit size={16} />
                      </button>
                    </Tooltip>
                  </td>
                </tr>

                {/* Batch Rows (expanded) */}
                {hasBatches &&
                  isExpanded &&
                  group.batches.map((batch, batchIndex) => (
                    <tr
                      key={batch._id}
                      className="border-b border-border bg-indigo-50 hover:bg-indigo-100 transition"
                    >
                      <td className="p-3"></td>
                      <td className="p-3 pl-8">
                        <div className="text-xs text-gray-600 font-medium">
                          Batch #{batchIndex + 1}
                        </div>
                      </td>
                      <td className="p-3">
                        <div>
                          <div className="text-sm font-medium text-gray-700">
                            {batch.batch.batch}
                          </div>
                          <div className="text-xs text-gray-500">
                            Exp: {batch.batch.expiry_mm}/{batch.batch.expiry_yy}{' '}
                            • 1×{batch.batch.pack}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="text-sm text-gray-600">
                          {batch.manufacturer}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div>
                          <div className="text-sm font-semibold text-gray-700">
                            ₹{batch.batch.mrp.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Rate: ₹{batch.batch.rate.toFixed(2)}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <div>
                          <div
                            className={`text-sm font-bold ${
                              batch.available_qty <= batch.reorder_level
                                ? 'text-orange-600'
                                : 'text-green-600'
                            }`}
                          >
                            {batch.available_qty}
                          </div>
                          {batch.reserved_qty > 0 && (
                            <div className="text-xs text-gray-500">
                              ({batch.reserved_qty} reserved)
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            batch.available_qty,
                            batch.reorder_level,
                          )}`}
                        >
                          {getStatusText(
                            batch.available_qty,
                            batch.reorder_level,
                          )}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <Tooltip content="Edit Batch" position="top">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle edit
                            }}
                            className="p-2 hover:bg-primary hover:text-white rounded-lg transition-colors"
                          >
                            <FiEdit size={16} />
                          </button>
                        </Tooltip>
                      </td>
                    </tr>
                  ))}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      {stocks.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-sm">No stock data available</p>
        </div>
      )}
      </div>
    </div>
  );
};

export default StocksTable;
