import React, { FC } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import { HiLocationMarker } from 'react-icons/hi';
import { BsFileTextFill } from 'react-icons/bs';

import { DistributorOrInvoiceListProps } from '@/types/purchases';

const DistributorOrInvoiceList: FC<DistributorOrInvoiceListProps> = ({
  title = '',
  description = '',
  address = '',
  seleceted,
  onClick = () => {},
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative flex items-center justify-between px-4 py-3.5 border-b border-gray-200 cursor-pointer transition-all group ${
        seleceted
          ? 'bg-blue-50 border-l-4 border-l-primary'
          : 'border-l-4 border-l-transparent hover:bg-gray-50'
      }`}
    >
      <div className="flex-1 min-w-0 pr-3">
        {/* Title */}
        <h3
          className={`text-sm font-semibold mb-1.5 truncate transition-colors ${
            seleceted
              ? 'text-primary'
              : 'text-gray-900 group-hover:text-primary'
          }`}
        >
          {title}
        </h3>

        {/* Address */}
        {address && (
          <div className="flex items-start gap-1.5 mb-1">
            <HiLocationMarker
              className="flex-shrink-0 mt-0.5 text-gray-400"
              size={12}
            />
            <p className="text-xs text-gray-600 truncate font-medium">
              {address}
            </p>
          </div>
        )}

        {/* Description */}
        {description && (
          <div className="flex items-center gap-1.5">
            <BsFileTextFill className="flex-shrink-0 text-gray-400" size={11} />
            <p className="text-xs text-gray-500 truncate font-medium">
              {description}
            </p>
          </div>
        )}
      </div>

      {/* Arrow Indicator */}
      <div className="flex-shrink-0">
        <IoIosArrowForward
          size={18}
          className={`transition-all ${
            seleceted
              ? 'text-primary translate-x-0'
              : 'text-gray-400 -translate-x-1 group-hover:translate-x-0 group-hover:text-primary'
          }`}
        />
      </div>
    </div>
  );
};

export default DistributorOrInvoiceList;
