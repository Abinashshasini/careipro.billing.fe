'use client';
import { Button } from '@/components/ui/button';
import React, { useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
      </div>

      <div className="flex justify-between mt-3">
        <Button
          type="submit"
          variant="secondary"
          className="font-semibold"
          onClick={() => {
            setRange([null, null]);
          }}
        >
          Clear
        </Button>

        <Button
          type="submit"
          variant="default"
          className="font-semibold"
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
  );
};

export default DateRangeFilter;
