'use client';
import React from 'react';
import { Modal } from './modal';
import { Button } from './button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'default' | 'secondary' | 'danger' | 'outline' | 'ghost';
  icon?: React.ReactNode;
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to continue?',
  confirmText = 'Yes',
  cancelText = 'Not Sure',
  confirmVariant = 'danger',
  icon,
  isLoading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      className="max-w-md"
      backdropEnabled={true}
    >
      <div className="space-y-6">
        {/* Icon and Message */}
        <div className="text-center space-y-4">
          {icon && (
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-red-100">{icon}</div>
            </div>
          )}

          <p className="text-gray-700 text-sm leading-relaxed">{message}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2 min-w-20"
          >
            {cancelText}
          </Button>

          <Button
            variant={confirmVariant}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            disabled={isLoading}
            className="px-6 py-2 min-w-20"
          >
            {isLoading ? 'Processing...' : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
