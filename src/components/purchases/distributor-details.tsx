'use client';
import React, { useState } from 'react';
import { TDistributorSummary } from '@/types/purchases';
import moment from 'moment';
import toast from 'react-hot-toast';
import { MdEditSquare } from 'react-icons/md';
import DistributorOptionsDropdown from './distributor-options-dropdown';
import ConfirmationModal from '@/components/ui/confirmation-modal';
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
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    if (typeof onEdit === 'function') {
      onEdit();
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirmation(true);
    setShowOptionsDropdown(false);
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
    <div className="flex gap-4">
      {/* Avatar */}
      <div
        className={`h-15 w-15 flex items-center justify-center font-bold text-2xl rounded-lg ${'bg-bg-primary text-primary'}`}
      >
        {distributor.distributor_name &&
          distributor.distributor_name.slice(0, 2).toUpperCase()}
      </div>

      <div className="flex-1">
        {/* Name and GST */}
        <div className="text-lg font-medium text-black flex">
          {distributor.distributor_name}
          {distributor.gst_number && (
            <span>&nbsp;({distributor.gst_number})</span>
          )}
          <div
            className={`relative ml-2 flex items-center ${
              isDemo ? 'pointer-events-none' : ''
            }`}
          >
            <div
              className="flex items-center text-xs text-danger gap-0.5 cursor-pointer hover:opacity-80 transition"
              onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
            >
              <MdEditSquare /> More Options
            </div>
            <DistributorOptionsDropdown
              isOpen={showOptionsDropdown}
              onClose={() => setShowOptionsDropdown(false)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>

        {/* State and Mobile */}
        <div className="text-sm flex gap-1 mb-3 $ text-gray">
          <p>
            {distributor.state && `${distributor.state}, `}
            {distributor.mobile_number}
          </p>
          <p className="text-primary font-bold">
            ({distributor.drug_license_number})
          </p>
        </div>

        {/* Invoice Details */}
        <div className="flex gap-2 flex-col w-2/3">
          <div className="text-black text-sm grid grid-cols-4">
            <span className="">Last invoice </span>
            <span className="">Last invoice date</span>
            <span className="">Pending amount</span>
            <span className="">Total amount</span>
          </div>
          <div className="text-black text-sm grid grid-cols-4">
            <span className="font-bold  text-black">
              {purchaseSummary.last_invoice || '-'}
            </span>
            <span className=" text-black font-bold">
              {purchaseSummary.last_invoice_date
                ? moment(purchaseSummary.last_invoice_date).format('MMM Do YY')
                : '-'}
            </span>
            <span
              className="font-bold "
              style={{ color: purchaseSummary.pending_amount_color }}
            >
              ₹{purchaseSummary.pending_amount.toFixed(2) || 0}
            </span>
            <span className="font-medium  text-success">
              ₹{purchaseSummary.total_amount.toFixed(2) || 0}
            </span>
          </div>
        </div>
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
