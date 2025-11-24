'use client';
import React from 'react';
import Popover from '@/components/ui/popover';

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
    <Popover
      isOpen={isOpen}
      onClose={onClose}
      position="bottom-left"
      minWidth="14rem"
      className="p-3"
    >
      <div className="flex flex-col text-sm font-medium">
        {options.map((opt) => (
          <button
            key={opt.key || 'none'}
            onClick={() => {
              onSelect(opt.key);
              onClose();
            }}
            className={`text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors ${
              selected === opt.key ? 'bg-gray-100 font-semibold' : ''
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </Popover>
  );
};

export default SortFilter;
