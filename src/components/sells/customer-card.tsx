import React, { FC } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import { HiLocationMarker } from 'react-icons/hi';
import { FaUser } from 'react-icons/fa';

import { CustomerCardProps } from '@/types/sells';

const CustomerCard: FC<CustomerCardProps> = ({
  title = '',
  description = '',
  address = '',
  selected,
  onClick = () => {},
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative flex items-center justify-between px-4 py-3.5 border-b border-gray-200 cursor-pointer transition-all group ${
        selected
          ? 'bg-blue-50 border-l-4 border-l-primary'
          : 'border-l-4 border-l-transparent hover:bg-gray-50'
      }`}
    >
      <div className="flex-1 min-w-0 pr-3">
        {/* Title */}
        <h3
          className={`text-sm font-semibold mb-1.5 truncate transition-colors ${
            selected ? 'text-primary' : 'text-gray-900 group-hover:text-primary'
          }`}
        >
          <FaUser className="inline mr-2 flex-shrink-0" size={12} />
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-xs text-gray-600 font-medium mb-1 truncate">
            {description}
          </p>
        )}

        {/* Address */}
        {address && (
          <div className="flex items-start gap-1.5 text-xs text-gray-500">
            <HiLocationMarker className="flex-shrink-0 mt-0.5" size={12} />
            <span className="truncate">{address}</span>
          </div>
        )}
      </div>

      {/* Arrow Icon */}
      <IoIosArrowForward
        className={`flex-shrink-0 transition-all ${
          selected
            ? 'text-primary opacity-100 translate-x-0'
            : 'text-gray-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
        }`}
        size={18}
      />
    </div>
  );
};

export default CustomerCard;
