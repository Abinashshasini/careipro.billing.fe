'use client';
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

export type SortOption =
  | 'lastAddedFirst'
  | 'lastTxnAtoZ'
  | 'lastTxnZtoA'
  | 'balanceHighToLow'
  | 'balanceLowToHigh'
  | 'nameAtoZ'
  | 'nameZtoA'
  | null;

interface SortFilterProps {
  isOpen: boolean;
  selected?: SortOption;
  onClose: () => void;
  onSelect: (option: SortOption) => void;
}

const SortFilter: React.FC<SortFilterProps> = ({
  isOpen,
  selected = null,
  onClose,
  onSelect,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (ref.current && !ref.current.contains(target)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleOutside, true);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutside, true);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const options: { key: SortOption; label: string }[] = [
    { key: 'lastAddedFirst', label: 'Last Added First' },
    { key: 'lastTxnAtoZ', label: 'Last Txn - A to Z' },
    { key: 'lastTxnZtoA', label: 'Last Txn - Z to A' },
    { key: 'balanceHighToLow', label: 'Balance - High to Low' },
    { key: 'balanceLowToHigh', label: 'Balance - Low to High' },
    { key: 'nameAtoZ', label: 'Distributor Name A - Z' },
    { key: 'nameZtoA', label: 'Distributor Name Z - A' },
  ];

  return (
    <div
      ref={ref}
      className="absolute z-50 mt-2 right-0 bg-white border border-border rounded shadow-lg p-3 w-56 text-sm font-medium"
    >
      <div className="flex flex-col">
        {options.map((opt) => (
          <button
            key={opt.key || 'none'}
            onClick={() => {
              onSelect(opt.key);
              onClose();
            }}
            className={`text-left px-3 py-2 rounded hover:bg-gray-100 ${
              selected === opt.key ? 'bg-gray-100 font-semibold' : ''
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SortFilter;
