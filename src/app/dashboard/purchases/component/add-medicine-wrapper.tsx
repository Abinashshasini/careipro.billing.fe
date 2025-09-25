import React from 'react';
import AddMedicineRow from './add-medicine-row';
import '../styles/add-purchase-row.css';

const AddMedicineWrapper = () => {
  return (
    <div className="w-full light-border rounded-lg items-start p-6 gap-2 h-94 flex flex-col">
      <div className="flex items-center whitespace-nowrap text-xs font-regular text-black relative  w-full">
        <div className="initial">#</div>
        <div className="productName">Product / Barcode</div>
        <div className="hsn">HSN</div>
        <div className="batch">BATCH</div>
        <div className="expiry">Expiry</div>
        <div className="pack">Pack</div>
        <div className="qty">QTY</div>
        <div className="free">FREE</div>
        <div className="mrp">MRP</div>
        <div className="rate">RATE</div>
        <div className="sch">SCH %</div>
        <div className="disc">DISC</div>
        <div className="gst">GST</div>
        <div className="margin">MARGIN</div>
        <div className="amount">AMT</div>
        <div className="amount" />
      </div>
      <AddMedicineRow />
    </div>
  );
};

export default AddMedicineWrapper;
