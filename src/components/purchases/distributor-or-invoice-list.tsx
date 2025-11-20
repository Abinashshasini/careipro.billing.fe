import React, { FC } from 'react';

interface DistributorOrInvoiceListProps {
  title: string;
  date: string;
  seleceted: boolean;
  amount?: number | string;
  onClick?: () => void;
}

const DistributorOrInvoiceList: FC<DistributorOrInvoiceListProps> = ({
  title = '',
  date = '',
  amount = '',
  seleceted,
  onClick = () => {},
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between px-4 py-4 border-b border-border cursor-pointer hover:bg-grayLight transition border-l-4 border-l-primary hover:bg-shade-blue ${
        seleceted ? 'bg-shade-blue' : ''
      }`}
    >
      <div className="min-w-0">
        <h3 className="text-sm font-semibold mb-1 truncate">{title}</h3>
        <p className="text-sm text-gray truncate">{date}</p>
      </div>
      <div className="font-semibold text-red-500 ml-4 flex-shrink-0">
        {amount ? `₹${amount}` : ''}
      </div>
    </div>
  );
};

export default DistributorOrInvoiceList;
