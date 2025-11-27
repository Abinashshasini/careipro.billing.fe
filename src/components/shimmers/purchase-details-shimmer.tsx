const PurchaseDetailsShimmer = () => {
  return (
    <div className="animate-pulse space-y-6">
      {/* Header Shimmer */}
      <div className="flex justify-between mb-6">
        <div className="flex gap-2">
          <div className="w-6 h-6 bg-shade-gray rounded"></div>
          <div>
            <div className="h-5 bg-shade-gray rounded w-32 mb-2"></div>
            <div className="h-4 bg-shade-gray rounded w-56"></div>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="h-10 bg-shade-gray rounded w-32"></div>
        </div>
      </div>

      {/* Medicine Table Header Shimmer */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-12 gap-2 mb-4">
          <div className="h-4 bg-shade-gray rounded col-span-2"></div>
          <div className="h-4 bg-shade-gray rounded col-span-1"></div>
          <div className="h-4 bg-shade-gray rounded col-span-1"></div>
          <div className="h-4 bg-shade-gray rounded col-span-1"></div>
          <div className="h-4 bg-shade-gray rounded col-span-1"></div>
          <div className="h-4 bg-shade-gray rounded col-span-1"></div>
          <div className="h-4 bg-shade-gray rounded col-span-1"></div>
          <div className="h-4 bg-shade-gray rounded col-span-1"></div>
          <div className="h-4 bg-shade-gray rounded col-span-1"></div>
          <div className="h-4 bg-shade-gray rounded col-span-1"></div>
          <div className="h-4 bg-shade-gray rounded col-span-1"></div>
        </div>

        {/* Medicine Rows Shimmer */}
        {[...Array(4)].map((_, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 mb-3">
            <div className="h-10 bg-shade-gray rounded col-span-2"></div>
            <div className="h-10 bg-shade-gray rounded col-span-1"></div>
            <div className="h-10 bg-shade-gray rounded col-span-1"></div>
            <div className="h-10 bg-shade-gray rounded col-span-1"></div>
            <div className="h-10 bg-shade-gray rounded col-span-1"></div>
            <div className="h-10 bg-shade-gray rounded col-span-1"></div>
            <div className="h-10 bg-shade-gray rounded col-span-1"></div>
            <div className="h-10 bg-shade-gray rounded col-span-1"></div>
            <div className="h-10 bg-shade-gray rounded col-span-1"></div>
            <div className="h-10 bg-shade-gray rounded col-span-1"></div>
            <div className="h-10 bg-shade-gray rounded col-span-1"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchaseDetailsShimmer;
