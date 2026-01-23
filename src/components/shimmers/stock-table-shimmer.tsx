import React from 'react';

const StockTableShimmer: React.FC = () => {
  return (
    <div
      className="w-full overflow-auto"
      style={{ height: 'calc(100vh - 280px)' }}
    >
      <table className="w-full border-collapse">
        <thead className="sticky top-0 bg-white z-10">
          <tr className="border-b border-border">
            <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase">
              Medicine Name
            </th>
            <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase">
              Batch
            </th>
            <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase">
              Manufacturer
            </th>
            <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase">
              Pack Size
            </th>
            <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase">
              Expiry
            </th>
            <th className="text-right p-3 text-xs font-semibold text-gray-600 uppercase">
              MRP
            </th>
            <th className="text-right p-3 text-xs font-semibold text-gray-600 uppercase">
              Rate
            </th>
            <th className="text-right p-3 text-xs font-semibold text-gray-600 uppercase">
              Available
            </th>
            <th className="text-right p-3 text-xs font-semibold text-gray-600 uppercase">
              Reserved
            </th>
            <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase">
              Status
            </th>
            <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase">
              Last Purchase
            </th>
            <th className="text-center p-3 text-xs font-semibold text-gray-600 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {[...Array(8)].map((_, index) => (
            <tr
              key={index}
              className={`border-b border-border ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              <td className="p-3">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-40"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                </div>
              </td>
              <td className="p-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
              </td>
              <td className="p-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
              </td>
              <td className="p-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
              </td>
              <td className="p-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
              </td>
              <td className="p-3 text-right">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-16 ml-auto"></div>
              </td>
              <td className="p-3 text-right">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-16 ml-auto"></div>
              </td>
              <td className="p-3 text-right">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-12 ml-auto"></div>
              </td>
              <td className="p-3 text-right">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-12 ml-auto"></div>
              </td>
              <td className="p-3">
                <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20"></div>
              </td>
              <td className="p-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
              </td>
              <td className="p-3 text-center">
                <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse mx-auto"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockTableShimmer;
