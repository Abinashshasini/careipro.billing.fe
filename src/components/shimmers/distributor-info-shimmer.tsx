'use client';
import React from 'react';

const DistributorInfoShimmer: React.FC = () => {
  return (
    <div className="flex gap-4 animate-pulse">
      {/* Avatar shimmer */}
      <div className="h-15 w-15 bg-gray-200 rounded-lg"></div>

      <div className="flex-1">
        {/* Name and GST shimmer */}
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>

        {/* State and mobile shimmer */}
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>

        {/* Invoice details section */}
        <div className="flex gap-2">
          {/* Last invoice shimmer */}
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>

          {/* Total amount shimmer */}
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributorInfoShimmer;
