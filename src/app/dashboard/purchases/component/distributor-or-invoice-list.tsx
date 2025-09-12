import React, { FC } from 'react';

interface DistributorOrInvoiceListProps {
  distributorId: number;
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
      <div>
        <h3 className="text-sm font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray">{date}</p>
      </div>
      <div className="font-semibold text-danger">
        {amount ? `₹${amount}` : ''}
      </div>
    </div>
  );
};

export default DistributorOrInvoiceList;
