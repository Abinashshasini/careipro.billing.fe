'use client';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from '@/components/ui/button';
import Popover from '@/components/ui/popover';

interface DateRangeFilterProps {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  onApply: (from: Date | null, to: Date | null) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  title,
  isOpen,
  onClose,
  onApply,
}) => {
  const [range, setRange] = useState<[Date | null, Date | null]>([
    new Date(),
    null,
  ]);
  const [startDate, endDate] = range;

  return (
    <Popover
      isOpen={isOpen}
      onClose={onClose}
      position="bottom-left"
      minWidth="18rem"
      className="p-3"
    >
      {title && (
        <p className="text-sm text-black font-semibold mb-3">{title}</p>
      )}
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
                onApply(startDate, null);
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
    </Popover>
  );
};

export default DateRangeFilter;
