'use client';
import React, { useState } from 'react';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { MdDelete, MdPayment, MdDownload } from 'react-icons/md';
import { IoIosArrowForward } from 'react-icons/io';
import { PurchaseOrder } from '@/types/purchases';
import Tooltip from '@/components/ui/tooltip';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import apiClient from '@/lib/apiClient';
import { DELETE_PURCHASE_ORDER } from '@/utils/api-endpoints';
import { ApiResponse } from '@/types/apitypes';
import toast from 'react-hot-toast';

interface PurchaseOrdersTableProps {
  purchaseOrders: PurchaseOrder[] | undefined;
}

const PurchaseOrdersTable: React.FC<PurchaseOrdersTableProps> = ({
  purchaseOrders,
}) => {
  const router = useRouter();

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] =
    useState<PurchaseOrder | null>(null);

  const handleDownload = () => {
    // :: TODO implement download logic
  };

  const handleDeleteClick = (
    event: React.MouseEvent,
    _params: PurchaseOrder,
  ) => {
    event.stopPropagation();
    setSelectedOrderDetails(_params);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await apiClient.delete<ApiResponse<null>>(
        `${DELETE_PURCHASE_ORDER}/${selectedOrderDetails?._id}`,
      );
      if (response.data.code === 200) {
        setShowDeleteConfirmation(false);
        setSelectedOrderDetails(null);
        toast.success(
          `"${selectedOrderDetails?.invoice_no}" has been deleted successfully.`,
        );
      }
    } catch (error) {
      console.error('Error deleting purchase order:', error);
      setShowDeleteConfirmation(false);
    }
  };

  const handleRecordPayment = () => {
    // :: TODO implement record payment logic
  };

  const handleRedirect = (id?: string) => {
    router.push(
      `/dashboard/purchases/add-purchase?purchaseOrderId=${id || ''}`,
    );
  };

  if (!purchaseOrders || purchaseOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <h3 className="text-lg font-medium text-gray-600 mb-2">
          No purchase orders available
        </h3>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Start managing your purchases by adding new purchase orders&nbsp;
          <span
            className="underline text-sm text-secondary cursor-pointer"
            onClick={() => router.push('/dashboard/purchases/add-purchase')}
          >
            add purchase order
          </span>
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Table Header */}
      <div className="grid grid-cols-13 bg-gray-50 p-3 border-b border-gray-200 text-xs font-medium text-gray-700 gap-4">
        <div className="col-span-1">SL NO</div>
        <div className="col-span-2">INVOICE</div>
        <div className="col-span-2">INVOICE DATE</div>
        <div className="col-span-1">PAYBLE</div>
        <div className="col-span-1">STATUS</div>
        <div className="col-span-2">AMOUNT</div>
        <div className="col-span-2">DUE DATE</div>
        <div className="col-span-2">OPTIONS</div>
      </div>

      {/* Table Body */}
      <div className="border border-gray-200">
        {purchaseOrders.map((order, index) => (
          <div
            key={order._id}
            className={`grid grid-cols-13 p-3 text-sm hover:bg-gray-100 transition-colors gap-4 items-center ${
              index !== purchaseOrders.length - 1
                ? 'border-b border-gray-100'
                : ''
            }`}
            onClick={() => handleRedirect(order._id)}
          >
            {/* Serial Number */}
            <div className="col-span-1 pl-1">{index + 1}</div>

            {/* Invoice Number */}
            <div className="col-span-2 font-medium text-black truncate">
              {order.invoice_no}
            </div>

            {/* Invoice Date */}
            <div className="col-span-2 text-gray-600">
              {moment(order.invoice_date).format('MMM DD, YYYY')}
            </div>

            {/* Payble Amount */}
            <div className="col-span-1 text-gray-600">₹2000</div>

            {/* Payment Status */}
            <div className="col-span-1">
              <span
                className="inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize text-white"
                style={{ backgroundColor: order.payment_summary.color }}
              >
                {order.payment_summary.status}
              </span>
            </div>

            {/* Total Amount */}
            <div className="col-span-2 font-medium text-black">
              ₹{order.total_amount}
            </div>

            {/* Due Date */}
            <div className="col-span-2 text-gray-600">
              {moment(order.payment_due_date).format('MMM DD, YYYY')}
            </div>

            {/* Options */}
            <div className="col-span-2 text-center flex justify-between items-center">
              <div className="flex items-center gap-1">
                {/* Download Button */}
                <Tooltip content="Download Invoice" position="top">
                  <button
                    onClick={handleDownload}
                    className="p-1.5 text-primary hover:bg-blue-100 rounded-md transition-colors"
                  >
                    <MdDownload size={17} />
                  </button>
                </Tooltip>

                {/* Record Payment Button */}
                <Tooltip content="Record Payment" position="top">
                  <button
                    onClick={handleRecordPayment}
                    className="p-1.5 text-success hover:bg-green-100 rounded-md transition-colors"
                  >
                    <MdPayment size={17} />
                  </button>
                </Tooltip>

                {/* Delete Button */}
                <Tooltip content="Delete Purchase Order" position="top">
                  <button
                    onClick={(event) => handleDeleteClick(event, order)}
                    className="p-1.5 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                  >
                    <MdDelete size={17} />
                  </button>
                </Tooltip>
              </div>
              <div>
                <IoIosArrowForward size={18} color="var(--color-primary)" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => {
          setShowDeleteConfirmation(false);
          setSelectedOrderDetails(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Purchase Order"
        message={`Are you sure you want to delete invoice "${selectedOrderDetails?.invoice_no}"? This action cannot be undone and will remove all associated data.`}
        confirmText="Yes, Delete"
        cancelText="Not Sure!"
        confirmVariant="danger"
        isLoading={false}
      />
    </div>
  );
};

export default PurchaseOrdersTable;
