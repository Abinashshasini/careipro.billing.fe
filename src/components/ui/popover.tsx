'use client';
import React, { useRef, useEffect, ReactNode } from 'react';

export type PopoverPosition =
  | 'bottom-left'
  | 'bottom-right'
  | 'top-left'
  | 'top-right'
  | 'bottom-center'
  | 'top-center';

interface PopoverProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  position?: PopoverPosition;
  className?: string;
  showArrow?: boolean;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  offset?: number;
  minWidth?: string;
  maxWidth?: string;
  zIndex?: number;
}

const Popover: React.FC<PopoverProps> = ({
  isOpen,
  onClose,
  children,
  position = 'bottom-left',
  className = '',
  showArrow = false,
  closeOnClickOutside = true,
  closeOnEscape = true,
  offset = 4,
  minWidth = '12rem',
  maxWidth,
  zIndex = 50,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  // Position classes mapping
  const positionClasses = {
    'bottom-left': `top-full left-0 mt-${offset}`,
    'bottom-right': `top-full right-0 mt-${offset}`,
    'bottom-center': `top-full left-1/2 transform -translate-x-1/2 mt-${offset}`,
    'top-left': `bottom-full left-0 mb-${offset}`,
    'top-right': `bottom-full right-0 mb-${offset}`,
    'top-center': `bottom-full left-1/2 transform -translate-x-1/2 mb-${offset}`,
  };

  // Arrow classes mapping
  const arrowClasses = {
    'bottom-left':
      'top-0 left-4 transform -translate-y-full border-l-transparent border-r-transparent border-b-white border-t-0',
    'bottom-right':
      'top-0 right-4 transform -translate-y-full border-l-transparent border-r-transparent border-b-white border-t-0',
    'bottom-center':
      'top-0 left-1/2 transform -translate-x-1/2 -translate-y-full border-l-transparent border-r-transparent border-b-white border-t-0',
    'top-left':
      'bottom-0 left-4 transform translate-y-full border-l-transparent border-r-transparent border-t-white border-b-0',
    'top-right':
      'bottom-0 right-4 transform translate-y-full border-l-transparent border-r-transparent border-t-white border-b-0',
    'top-center':
      'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full border-l-transparent border-r-transparent border-t-white border-b-0',
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        closeOnClickOutside &&
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, closeOnClickOutside]);

  // Close on escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose, closeOnEscape]);

  // Don't render if not open
  if (!isOpen) return null;

  const widthStyles = {
    ...(minWidth && { minWidth }),
    ...(maxWidth && { maxWidth }),
  };

  return (
    <div
      ref={popoverRef}
      className={`absolute ${positionClasses[position]} bg-white border border-gray-200 rounded-lg shadow-lg ${className}`}
      style={{
        zIndex,
        ...widthStyles,
      }}
    >
      {/* Arrow */}
      {showArrow && (
        <div
          className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`}
        />
      )}

      {/* Content */}
      <div className="relative">{children}</div>
    </div>
  );
};

export default Popover;
