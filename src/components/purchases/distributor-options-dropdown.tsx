'use client';
import React from 'react';
import { MdEdit, MdDelete } from 'react-icons/md';
import Popover from '@/components/ui/popover';

interface DistributorOptionsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const DistributorOptionsDropdown: React.FC<DistributorOptionsDropdownProps> = ({
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  return (
    <Popover
      isOpen={isOpen}
      onClose={onClose}
      position="bottom-left"
      minWidth="12rem"
      offset={0}
    >
      <div className="py-2">
        <div
          onClick={() => {
            onEdit();
            onClose();
          }}
          className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
        >
          <MdEdit size={16} className="text-blue-600" />
          <span className="text-sm text-gray-700">Edit Distributor</span>
        </div>

        {/* Delete Option */}
        <div
          onClick={() => {
            onDelete();
            onClose();
          }}
          className="flex items-center gap-3 px-3 py-2 hover:bg-red-50 cursor-pointer transition-colors"
        >
          <MdDelete size={16} className="text-red-600" />
          <span className="text-sm text-red-600">Delete Distributor</span>
        </div>
      </div>
    </Popover>
  );
};

export default DistributorOptionsDropdown;
