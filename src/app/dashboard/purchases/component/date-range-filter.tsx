'use client';
import React, { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from '@/components/ui/button';

interface DateRangeFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (from: Date | null, to: Date | null) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  const [range, setRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = range;
  const ref = useRef<HTMLDivElement | null>(null);

  /** Add outside-click (mousedown/touchstart capture) and Escape key handling */
  const handleOutside = (e: MouseEvent | TouchEvent) => {
    const target = e.target as Node;
    if (ref.current && !ref.current.contains(target)) {
      onClose();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('mousedown', handleOutside, true);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutside, true);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className="absolute z-50 mt-2 bg-white border border-border rounded shadow-lg p-3"
    >
      <div>
        <DatePicker
          selected={startDate}
          onChange={(dates: Date | [Date | null, Date | null] | null) => {
            if (Array.isArray(dates)) {
              setRange(dates as [Date | null, Date | null]);
            } else if (dates instanceof Date) {
              setRange([dates, null]);
            } else {
              setRange([null, null]);
            }
          }}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline
        />

        <div className="flex gap-2 mt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setRange([null, null])}
            className="px-3 py-1"
          >
            Clear
          </Button>

          <Button
            type="button"
            variant="default"
            className="px-3 py-1 ml-auto"
            onClick={() => {
              if (startDate && !endDate) {
                onApply(startDate, startDate);
              } else if (startDate && endDate) {
                onApply(startDate, endDate);
              } else {
                onApply(null, null);
              }
              onClose();
            }}
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DateRangeFilter;
