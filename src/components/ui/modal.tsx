'use client';

import React, { useEffect } from 'react';
import { IoCloseSharp } from 'react-icons/io5';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  backdropEnabled?: boolean; // 👈 new prop
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  backdropEnabled = false,
}: ModalProps) {
  const [show, setShow] = React.useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      const timer = setTimeout(() => setShow(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !show) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity duration-200',
        isOpen ? 'opacity-100' : 'opacity-0',
      )}
      onClick={backdropEnabled ? onClose : undefined} // 👈 close when clicking backdrop
    >
      <div
        className={cn(
          'bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6 transform transition-transform duration-200',
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
          className,
        )}
        onClick={(e) => e.stopPropagation()} // 👈 prevent closing when clicking inside
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-8 border-border">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          <button
            onClick={onClose}
            className="text-black-500 hover:text-gray-700"
          >
            <IoCloseSharp size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
