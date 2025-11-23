'use client';
import React from 'react';
import { TDistributorSummary } from '@/types/purchases';
import moment from 'moment';
import { MdEditSquare } from 'react-icons/md';

interface DistributorDetailsProps {
  data: TDistributorSummary;
}

const DistributorDetails: React.FC<DistributorDetailsProps> = ({ data }) => {
  const { distributor, purchaseSummary } = data;

  return (
    <div className="flex gap-4">
      {/* Avatar */}
      <div
        className={`h-15 w-15 flex items-center justify-center font-bold text-2xl rounded-lg ${'bg-bg-primary text-primary'}`}
      >
        {distributor.distributor_name &&
          distributor.distributor_name.slice(0, 2).toUpperCase()}
      </div>

      <div className="flex-1">
        {/* Name and GST */}
        <div className="text-lg font-medium text-black flex">
          {distributor.distributor_name}
          {distributor.gst_number && (
            <span>&nbsp;({distributor.gst_number})</span>
          )}
          <div className="flex items-center text-xs text-danger gap-0.5 cursor-pointer hover:opacity-80 transition ml-2">
            <MdEditSquare /> More Options
          </div>
        </div>

        {/* State and Mobile */}
        <div className="text-sm flex gap-1 mb-3 $ text-gray">
          <p>
            {distributor.state && `${distributor.state}, `}
            {distributor.mobile_number}
          </p>
          <p className="text-primary font-bold">
            ({distributor.drug_license_number})
          </p>
        </div>

        {/* Invoice Details */}
        <div className="flex gap-2 flex-col w-2/3">
          <div className="text-black text-sm grid grid-cols-4">
            <span className="">Last invoice </span>
            <span className="">Last invoice date</span>
            <span className="">Pending amount</span>
            <span className="">Total amount</span>
          </div>
          <div className="text-black text-sm grid grid-cols-4">
            <span className="font-bold  text-black">
              {purchaseSummary.last_invoice || '-'}
            </span>
            <span className=" text-black font-bold">
              {moment(purchaseSummary.last_invoice_date).format('MMM Do YY') ||
                '-'}
            </span>
            <span className="font-bold  text-danger">
              ₹{purchaseSummary.pending_amount || '-'}
            </span>
            <span className="font-medium  text-success">
              ₹{purchaseSummary.total_amount || '-'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributorDetails;
