'use client';
import React from 'react';
import moment from 'moment';
import { PurchaseOrder } from '@/types/purchases';

interface PurchaseOrdersTableProps {
  purchaseOrders: PurchaseOrder[];
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'paid':
      return 'text-success bg-green-50';
    case 'pending':
      return 'text-warning bg-yellow-50';
    case 'overdue':
      return 'text-danger bg-red-50';
    default:
      return 'text-gray bg-gray-50';
  }
};

const PurchaseOrdersTable: React.FC<PurchaseOrdersTableProps> = ({
  purchaseOrders,
}) => {
  if (!purchaseOrders || purchaseOrders.length === 0) {
    return (
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-black mb-4">
          Recent Purchase Orders
        </h4>
        <div className="text-center py-8 text-gray-500">
          <p>No purchase orders found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Table Header */}
      <div className="flex bg-gray-50 p-3  border-b border-gray-200 text-sm font-medium text-gray-700">
        <div className="flex-1">Invoice Number</div>
        <div className="flex-1">Invoice Date</div>
        <div className="flex-1">Due Date</div>
        <div className="flex-1">Status</div>
        <div className="flex-1 text-right">Amount</div>
      </div>

      {/* Table Body */}
      <div className="border border-gray-200">
        {purchaseOrders.map((order, index) => (
          <div
            key={order._id}
            className={`flex p-3 text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
              index !== purchaseOrders.length - 1
                ? 'border-b border-gray-100'
                : ''
            }`}
          >
            {/* Invoice Number */}
            <div className="flex-1 font-medium text-black">
              {order.invoice_no}
            </div>

            {/* Invoice Date */}
            <div className="flex-1 text-gray-600">
              {moment(order.invoice_date).format('MMM DD, YYYY')}
            </div>

            {/* Due Date */}
            <div className="flex-1 text-gray-600">
              {moment(order.payment_due_date).format('MMM DD, YYYY')}
            </div>

            {/* Payment Status */}
            <div className="flex-1">
              <span
                className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                  order.payment_status,
                )}`}
              >
                {order.payment_status}
              </span>
            </div>

            {/* Total Amount */}
            <div className="flex-1 text-right font-medium text-black">
              ₹
              {order.total_amount.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchaseOrdersTable;
