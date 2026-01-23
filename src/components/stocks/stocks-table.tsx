'use client';
import React from 'react';
import { FiEdit } from 'react-icons/fi';
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

interface StocksTableProps {
  stocks: StockMedicine[];
  loading?: boolean;
}

const StocksTable: React.FC<StocksTableProps> = ({ stocks, loading }) => {
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
    <div
      className="w-full overflow-auto"
      style={{ height: 'calc(100vh - 280px)' }}
    >
      <table className="w-full border-collapse">
        <thead className="sticky top-0 bg-white z-10">
          <tr className="border-b border-border">
            <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase">
              Medicine Name
            </th>
            <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase">
              Batch
            </th>
            <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase">
              Manufacturer
            </th>
            <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase">
              Pack Size
            </th>
            <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase">
              Expiry
            </th>
            <th className="text-right p-3 text-xs font-semibold text-gray-600 uppercase">
              MRP
            </th>
            <th className="text-right p-3 text-xs font-semibold text-gray-600 uppercase">
              Rate
            </th>
            <th className="text-right p-3 text-xs font-semibold text-gray-600 uppercase">
              Available
            </th>
            <th className="text-right p-3 text-xs font-semibold text-gray-600 uppercase">
              Reserved
            </th>
            <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase">
              Status
            </th>
            <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase">
              Last Purchase
            </th>
            <th className="text-center p-3 text-xs font-semibold text-gray-600 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock, index) => (
            <tr
              key={stock._id}
              className={`border-b border-border hover:bg-gray-50 transition ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              <td className="p-3">
                <div>
                  <p className="text-sm font-semibold text-black">
                    {stock.name}
                  </p>
                  <p className="text-xs text-gray-500">{stock.type}</p>
                </div>
              </td>
              <td className="p-3">
                <span className="text-sm font-medium text-gray-700">
                  {stock.batch.batch}
                </span>
              </td>
              <td className="p-3">
                <span className="text-sm text-gray-700">
                  {stock.manufacturer}
                </span>
              </td>
              <td className="p-3">
                <span className="text-sm font-medium text-gray-700">
                  1×{stock.batch.pack}
                </span>
              </td>
              <td className="p-3">
                <span className="text-sm font-medium text-gray-700">
                  {stock.batch.expiry_mm}/{stock.batch.expiry_yy}
                </span>
              </td>
              <td className="p-3 text-right">
                <span className="text-sm font-semibold text-gray-700">
                  ₹{stock.batch.mrp.toFixed(2)}
                </span>
              </td>
              <td className="p-3 text-right">
                <span className="text-sm font-medium text-gray-700">
                  ₹{stock.batch.rate.toFixed(2)}
                </span>
              </td>
              <td className="p-3 text-right">
                <span
                  className={`text-sm font-bold ${
                    stock.available_qty <= stock.reorder_level
                      ? 'text-orange-600'
                      : 'text-green-600'
                  }`}
                >
                  {stock.available_qty}
                </span>
              </td>
              <td className="p-3 text-right">
                <span className="text-sm font-medium text-gray-700">
                  {stock.reserved_qty}
                </span>
              </td>
              <td className="p-3">
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    stock.available_qty,
                    stock.reorder_level,
                  )}`}
                >
                  {getStatusText(stock.available_qty, stock.reorder_level)}
                </span>
              </td>
              <td className="p-3">
                <span className="text-sm text-gray-700">
                  {formatDate(stock.last_purchase_date)}
                </span>
              </td>
              <td className="p-3 text-center">
                <Tooltip content="Edit Stock" position="top">
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition">
                    <FiEdit size={16} className="text-gray-600" />
                  </button>
                </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {stocks.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-sm">No stock data available</p>
        </div>
      )}
    </div>
  );
};

export default StocksTable;
