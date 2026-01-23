'use client';
import React, { useState } from 'react';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { MdDelete, MdPayment, MdDownload } from 'react-icons/md';
import { IoIosArrowForward } from 'react-icons/io';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { PurchaseOrder } from '@/types/purchases';
import Tooltip from '@/components/ui/tooltip';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import RecordPaymentModal, {
  PaymentData,
} from '@/components/purchases/record-payment-modal';
import apiClient from '@/lib/apiClient';
import { DELETE_PURCHASE_ORDER } from '@/utils/api-endpoints';
import { ApiResponse } from '@/types/apitypes';

interface PurchaseOrdersTableProps {
  purchaseOrders: PurchaseOrder[] | undefined;
}

type FilterStatus = 'all' | 'paid' | 'partial' | 'pending';

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyles()}`}
    >
      {status}
    </span>
  );
};

const PurchaseOrdersTable: React.FC<PurchaseOrdersTableProps> = ({
  purchaseOrders,
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] =
    useState<PurchaseOrder | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrderForPayment, setSelectedOrderForPayment] =
    useState<PurchaseOrder | null>(null);
  const [isRecordingPayment, setIsRecordingPayment] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  const handleDeleteClick = (
    event: React.MouseEvent,
    _params: PurchaseOrder,
  ) => {
    event.stopPropagation();
    setSelectedOrderDetails(_params);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmPayment = async (paymentData: PaymentData) => {
    try {
      setIsRecordingPayment(true);

      // TODO: Replace with actual API endpoint when available
      // const response = await apiClient.post(`/record-payment/${selectedOrderForPayment?._id}`, paymentData);

      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setShowPaymentModal(false);
      setSelectedOrderForPayment(null);

      // Only invalidate purchase-related queries
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      queryClient.invalidateQueries({ queryKey: ['purchases'] });

      toast.success(
        `Payment of ₹${paymentData.payment_amount} recorded successfully for invoice "${selectedOrderForPayment?.invoice_no}".`,
      );
    } catch (error) {
      console.error('Error recording payment:', error);
      toast.error('Failed to record payment. Please try again.');
    } finally {
      setIsRecordingPayment(false);
    }
  };
  const handleConfirmDelete = async () => {
    try {
      const response = await apiClient.delete<ApiResponse<null>>(
        `${DELETE_PURCHASE_ORDER}/${selectedOrderDetails?._id}`,
      );
      if (response.data.code === 200) {
        setShowDeleteConfirmation(false);
        setSelectedOrderDetails(null);

        // Only invalidate purchase-related queries
        queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
        queryClient.invalidateQueries({ queryKey: ['purchases'] });

        toast.success(
          `"${selectedOrderDetails?.invoice_no}" has been deleted successfully.`,
        );
      }
    } catch (error) {
      console.error('Error deleting purchase order:', error);
      setShowDeleteConfirmation(false);
    }
  };

  const handleRecordPayment = (
    event: React.MouseEvent,
    order: PurchaseOrder,
  ) => {
    event.stopPropagation();
    setSelectedOrderForPayment(order);
    setShowPaymentModal(true);
  };

  const handleDownload = (event: React.MouseEvent, order: PurchaseOrder) => {
    event.stopPropagation();
    // TODO: Implement download functionality
    console.log('Download invoice for:', order.invoice_no);
  };

  const handleRedirect = (id?: string) => {
    router.push(
      `/dashboard/purchases/add-purchase?purchaseOrderId=${id || ''}`,
    );
  };

  // Filter purchase orders based on selected status
  const filteredOrders =
    filterStatus === 'all'
      ? purchaseOrders
      : purchaseOrders?.filter(
          (order) => order.payment_status === filterStatus,
        );

  const getStatusCount = (status: FilterStatus) => {
    if (status === 'all') return purchaseOrders?.length || 0;
    return (
      purchaseOrders?.filter((order) => order.payment_status === status)
        .length || 0
    );
  };

  if (!purchaseOrders || purchaseOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100%-223px)] p-8">
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
    <div className="h-[calc(100%-223px)] flex flex-col">
      {/* Quick Filter Buttons */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 bg-gray-50">
        <span className="text-xs font-medium text-gray-600 mr-2">Filter:</span>
        {(['all', 'pending', 'partial', 'paid'] as FilterStatus[]).map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filterStatus === status
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span
                className={`ml-1.5 ${
                  filterStatus === status ? 'text-white' : 'text-gray-500'
                }`}
              >
                ({getStatusCount(status)})
              </span>
            </button>
          ),
        )}
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-y-auto">
        {/* Table Header */}
        <div className="grid grid-cols-12 bg-gray-50 p-3 border-b border-gray-200 text-xs font-semibold text-gray-700 gap-3 sticky top-0 z-10">
          <div className="col-span-1">#</div>
          <div className="col-span-3">INVOICE & DATE</div>
          <div className="col-span-2">AMOUNT</div>
          <div className="col-span-2">STATUS</div>
          <div className="col-span-2">DUE DATE</div>
          <div className="col-span-2">ACTIONS</div>
        </div>

        {/* Table Body */}
        {filteredOrders && filteredOrders.length > 0 ? (
          <div className="border-l border-r border-b border-gray-200">
            {filteredOrders.map((order, index) => (
              <div
                key={order._id}
                className="grid grid-cols-12 p-3 text-sm hover:bg-blue-50 transition-all gap-3 items-center cursor-pointer border-b border-gray-100 group"
                onClick={() => handleRedirect(order._id)}
              >
                {/* Serial Number */}
                <div className="col-span-1 text-gray-600 font-medium">
                  {index + 1}
                </div>

                {/* Invoice & Date */}
                <div className="col-span-3">
                  <div className="font-semibold text-black truncate">
                    {order.invoice_no}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {moment(order.invoice_date).format('DD MMM YYYY')}
                  </div>
                </div>

                {/* Amount */}
                <div className="col-span-2">
                  <div className="font-bold text-black">
                    ₹{order.total_amount}
                  </div>
                  {order.total_amount_payable !== order.total_amount && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      Payable: ₹{order.total_amount_payable}
                    </div>
                  )}
                </div>

                {/* Payment Status */}
                <div className="col-span-2">
                  <StatusBadge status={order.payment_status} />
                </div>

                {/* Due Date */}
                <div className="col-span-2 text-gray-600">
                  {moment(order.payment_due_date).format('DD MMM YYYY')}
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {/* Download Button */}
                    <Tooltip content="Download Invoice" position="top">
                      <button
                        onClick={(event) => handleDownload(event, order)}
                        className="p-2 text-primary hover:bg-blue-100 rounded-md transition-colors"
                      >
                        <MdDownload size={16} />
                      </button>
                    </Tooltip>

                    {/* Record Payment Button */}
                    {order.payment_status !== 'paid' && (
                      <Tooltip content="Record Payment" position="top">
                        <button
                          onClick={(event) => handleRecordPayment(event, order)}
                          className="p-2 text-success hover:bg-green-100 rounded-md transition-colors"
                        >
                          <MdPayment size={16} />
                        </button>
                      </Tooltip>
                    )}

                    {/* Delete Button */}
                    <Tooltip content="Delete Purchase Order" position="top">
                      <button
                        onClick={(event) => handleDeleteClick(event, order)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                      >
                        <MdDelete size={16} />
                      </button>
                    </Tooltip>
                  </div>
                  <IoIosArrowForward
                    size={18}
                    className="text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <p className="text-sm">
              No {filterStatus !== 'all' ? filterStatus : ''} orders found
            </p>
          </div>
        )}
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

      {/* Record Payment Modal */}
      <RecordPaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedOrderForPayment(null);
        }}
        onConfirm={handleConfirmPayment}
        purchaseOrder={selectedOrderForPayment}
        isLoading={isRecordingPayment}
      />
    </div>
  );
};

export default PurchaseOrdersTable;
