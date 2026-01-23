'use client';
import React, { useState } from 'react';
import { TDistributorSummary } from '@/types/purchases';
import moment from 'moment';
import toast from 'react-hot-toast';
import { MdEdit, MdDelete, MdPhone, MdBusiness } from 'react-icons/md';
import { HiLocationMarker } from 'react-icons/hi';
import { BsFileTextFill } from 'react-icons/bs';
import { FaFileInvoiceDollar } from 'react-icons/fa';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import Tooltip from '@/components/ui/tooltip';
import apiClient from '@/lib/apiClient';
import { DELETE_DISTRIBUTOR } from '@/utils/api-endpoints';

interface DistributorDetailsProps {
  data: TDistributorSummary;
  isDemo: boolean;
  onEdit?: () => void;
  onDeleteSuccess?: () => void;
}

const DistributorDetails: React.FC<DistributorDetailsProps> = ({
  data,
  isDemo,
  onEdit,
  onDeleteSuccess,
}) => {
  const { distributor, purchaseSummary } = data;
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    if (typeof onEdit === 'function') {
      onEdit();
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await apiClient.delete(`${DELETE_DISTRIBUTOR}/${distributor._id}`);

      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
      toast.success(
        `"${distributor.distributor_name}" has been deleted successfully.`,
      );
    } catch (error) {
      console.error('Error deleting distributor:', error);
      toast.error(
        `Failed to delete "${distributor.distributor_name}". Please try again.`,
      );
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirmation(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between gap-4">
        {/* Left Section: Avatar + Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Avatar */}
          <div className="h-14 w-14 flex items-center justify-center font-bold text-lg rounded-lg bg-primary text-white flex-shrink-0">
            <span className="truncate px-1">
              {distributor.distributor_name &&
                distributor.distributor_name.slice(0, 2).toUpperCase()}
            </span>
          </div>

          {/* Distributor Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 truncate flex-shrink">
                {distributor.distributor_name}
              </h3>
              {distributor.gst_number && (
                <span className="px-2 py-0.5 bg-white text-primary text-xs font-semibold rounded border border-blue-300 whitespace-nowrap flex-shrink-0">
                  {distributor.gst_number}
                </span>
              )}
            </div>

            {/* Contact Info - Inline */}
            <div className="flex items-center gap-4 text-sm flex-wrap">
              {distributor.state && (
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <HiLocationMarker
                    className="text-primary flex-shrink-0"
                    size={15}
                  />
                  <span className="text-gray-700 font-medium truncate">
                    {distributor.state}
                  </span>
                </div>
              )}
              {distributor.mobile_number && (
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <MdPhone className="text-primary flex-shrink-0" size={15} />
                  <span className="text-gray-700 font-medium">
                    {distributor.mobile_number}
                  </span>
                </div>
              )}
              {distributor.drug_license_number && (
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <MdBusiness
                    className="text-primary flex-shrink-0"
                    size={15}
                  />
                  <span className="text-gray-700 font-medium truncate">
                    Lic: {distributor.drug_license_number}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Middle Section: Summary Stats */}
        <div className="flex items-center gap-4 px-4 border-l-2 border-blue-300">
          <div className="text-center min-w-[70px]">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Last Invoice
            </p>
            <p className="text-base font-bold text-gray-900">
              #{purchaseSummary.last_invoice || 'N/A'}
            </p>
          </div>
          <div className="text-center min-w-[70px]">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Last Date
            </p>
            <p className="text-base font-bold text-gray-900">
              {purchaseSummary.last_invoice_date
                ? moment(purchaseSummary.last_invoice_date).format('DD MMM YY')
                : 'N/A'}
            </p>
          </div>
          <div className="text-center min-w-[75px]">
            <p className="text-[11px] font-semibold text-orange-600 uppercase tracking-wide mb-1">
              Pending
            </p>
            <p className="text-base font-bold text-orange-700">
              ₹{purchaseSummary.pending_amount?.toFixed(2) || '0.00'}
            </p>
          </div>
          <div className="text-center min-w-[75px]">
            <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wide mb-1">
              Total Paid
            </p>
            <p className="text-base font-bold text-emerald-700">
              ₹{purchaseSummary.total_amount?.toFixed(2) || '0.00'}
            </p>
          </div>
        </div>

        {/* Right Section: Action Buttons */}
        {!isDemo && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <Tooltip content="Edit Distributor" position="top">
              <button
                onClick={handleEdit}
                className="p-1.5 text-primary hover:bg-blue-100 rounded-md transition-colors"
              >
                <MdEdit size={16} />
              </button>
            </Tooltip>
            <Tooltip content="Delete Distributor" position="top">
              <button
                onClick={handleDelete}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <MdDelete size={16} />
              </button>
            </Tooltip>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Distributor"
        message={`Are you sure you want to delete "${distributor.distributor_name}"? This action cannot be undone and will remove all associated data.`}
        confirmText="Yes, Delete"
        cancelText="Not Sure"
        confirmVariant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default DistributorDetails;
