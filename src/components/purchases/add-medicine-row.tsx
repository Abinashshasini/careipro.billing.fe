'use client';
import React, { useState, useEffect } from 'react';
import { MdDelete } from 'react-icons/md';
import { Button } from '@/components/ui/button';
import Tooltip from '@/components/ui/tooltip';
import { TMedicineFormData, AddMedicineRowProps } from '@/types/purchases';
import { getFieldError, isRowComplete } from '@/lib/medicineValidation';
import './styles/add-purchase-row.css';

const GST_RATE = 0.05;

const AddMedicineRow: React.FC<AddMedicineRowProps> = ({
  medicine,
  onUpdate,
  onDelete,
  isLast,
  onAddNew,
}) => {
  const [form, setForm] = useState<TMedicineFormData>({
    med_name: medicine.med_name,
    hsn: medicine.hsn,
    batch: medicine.batch,
    expiryMM: medicine.expiryMM,
    expiryYY: medicine.expiryYY,
    pack: medicine.pack,
    qty: medicine.qty,
    free: medicine.free,
    mrp: medicine.mrp,
    rate: medicine.rate,
    disc: medicine.disc,
  });

  const [amount, setAmount] = useState(0);
  const [margin, setMargin] = useState(0);
  const [showValidation, setShowValidation] = useState(false);

  const currentRowValid = isRowComplete(form);

  // Helper function to get input class names
  const getInputClassName = (
    field: keyof TMedicineFormData,
    isBorderless = false,
  ) => {
    const baseClass = `medicine-input ${isBorderless ? 'borderless' : ''}`;
    const errorClass =
      showValidation && getFieldError(form, field) ? 'error' : '';
    return `${baseClass} ${errorClass}`.trim();
  };

  // Handle add new with validation
  const handleAddNew = () => {
    if (currentRowValid) {
      onAddNew();
      setShowValidation(false);
    } else {
      setShowValidation(true);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      // If this is the last row and it's valid, add new row
      if (isLast && currentRowValid) {
        handleAddNew();
        return;
      }

      // Otherwise, move to next field or next row
      const inputs = document.querySelectorAll('input:not([readonly])');
      const currentIndex = Array.from(inputs).indexOf(e.currentTarget);
      const nextInput = inputs[currentIndex + 1] as HTMLInputElement;

      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  // handle input change
  const handleChange = (
    key: keyof TMedicineFormData,
    value: string | number,
  ) => {
    const newForm = { ...form, [key]: value };
    setForm(newForm);
    onUpdate(medicine.id, newForm);
  };

  // Handle number input change (allows empty strings)
  const handleNumberChange = (key: keyof TMedicineFormData, value: string) => {
    // If empty string, keep as empty string, otherwise convert to number
    const newValue = value === '' ? '' : Number(value);
    handleChange(key, newValue);
  };

  // calculate amount & margin whenever form changes
  useEffect(() => {
    const packParts = form.pack.split('×').map((p) => parseInt(p, 10));
    const unitsPerStrip =
      packParts.length === 2 && !isNaN(packParts[0]) && !isNaN(packParts[1])
        ? packParts[0] * packParts[1]
        : 1;

    const totalStrips = Number(form.qty || 0) + Number(form.free || 0);
    const totalUnits = totalStrips * unitsPerStrip;

    const totalMrp = totalUnits * Number(form.mrp || 0);
    const totalRate = totalUnits * Number(form.rate || 0);

    // Apply discount
    const discountAmount = totalRate * (Number(form.disc || 0) / 100);
    const afterDiscount = totalRate - discountAmount;

    const gst = afterDiscount * GST_RATE;
    const finalAmount = afterDiscount + gst;

    setAmount(finalAmount);

    if (totalMrp > 0) {
      const profit = totalMrp - totalRate;
      setMargin(parseFloat(((profit / totalMrp) * 100).toFixed(2)));
    } else {
      setMargin(0);
    }
  }, [form]);

  return (
    <div className="flex items-center w-full">
      <div className="h-16 initial" />
      <div
        className={`productName input-styles ${
          showValidation && getFieldError(form, 'med_name')
            ? 'validation-error'
            : ''
        }`}
      >
        <input
          placeholder="Search Product*"
          value={form.med_name}
          onChange={(e) => handleChange('med_name', e.target.value)}
          onKeyDown={handleKeyDown}
          className={getInputClassName('med_name')}
          tabIndex={0}
        />
        {showValidation && getFieldError(form, 'med_name') && (
          <div className="absolute top-full left-0 text-xs text-red-500 mt-1 z-10 bg-white p-1 rounded shadow">
            {getFieldError(form, 'med_name')}
          </div>
        )}
      </div>
      <div
        className={`batch input-styles ${
          showValidation && getFieldError(form, 'batch')
            ? 'validation-error'
            : ''
        }`}
      >
        <input
          placeholder="Batch*"
          value={form.batch}
          onChange={(e) => handleChange('batch', e.target.value)}
          onKeyDown={handleKeyDown}
          className={getInputClassName('batch')}
          tabIndex={0}
        />
        {showValidation && getFieldError(form, 'batch') && (
          <div className="absolute top-full left-0 text-xs text-red-500 mt-1 z-10 bg-white p-1 rounded shadow">
            {getFieldError(form, 'batch')}
          </div>
        )}
      </div>
      <div
        className={`expiry input-styles ${
          showValidation &&
          (getFieldError(form, 'expiryMM') || getFieldError(form, 'expiryYY'))
            ? 'validation-error'
            : ''
        } flex items-center pl-1`}
      >
        <input
          placeholder="MM"
          value={form.expiryMM}
          onChange={(e) => handleChange('expiryMM', e.target.value)}
          onKeyDown={handleKeyDown}
          className={getInputClassName('expiryMM', true)}
          maxLength={2}
          tabIndex={0}
        />
        <div className="px-1">/</div>
        <input
          placeholder="YY"
          value={form.expiryYY}
          onChange={(e) => handleChange('expiryYY', e.target.value)}
          onKeyDown={handleKeyDown}
          className={getInputClassName('expiryYY', true)}
          maxLength={2}
          tabIndex={0}
        />
        {showValidation &&
          (getFieldError(form, 'expiryMM') ||
            getFieldError(form, 'expiryYY')) && (
            <div className="absolute top-full left-0 text-xs text-red-500 mt-1 z-10 bg-white p-1 rounded shadow">
              {getFieldError(form, 'expiryMM') ||
                getFieldError(form, 'expiryYY')}
            </div>
          )}
      </div>

      <div
        className={`pack input-styles ${
          showValidation && getFieldError(form, 'pack')
            ? 'validation-error'
            : ''
        } flex items-center pl-3 pr-1 text-sm`}
      >
        <span className="font-semibold">1×</span>
        <input
          placeholder="10*"
          value={form.pack}
          onChange={(e) => handleChange('pack', e.target.value)}
          onKeyDown={handleKeyDown}
          className={getInputClassName('pack', true)}
          tabIndex={0}
        />
        {showValidation && getFieldError(form, 'pack') && (
          <div className="absolute top-full left-0 text-xs text-red-500 mt-1 z-10 bg-white p-1 rounded shadow">
            {getFieldError(form, 'pack')}
          </div>
        )}
      </div>

      <div
        className={`qty input-styles ${
          showValidation && getFieldError(form, 'qty') ? 'validation-error' : ''
        }`}
      >
        <input
          type="number"
          placeholder="Qty*"
          value={form.qty}
          onChange={(e) => handleNumberChange('qty', e.target.value)}
          onKeyDown={handleKeyDown}
          className={getInputClassName('qty')}
          min="1"
          tabIndex={0}
        />
        {showValidation && getFieldError(form, 'qty') && (
          <div className="absolute top-full left-0 text-xs text-red-500 mt-1 z-10 bg-white p-1 rounded shadow">
            {getFieldError(form, 'qty')}
          </div>
        )}
      </div>

      <div
        className={`free input-styles ${
          showValidation && getFieldError(form, 'free')
            ? 'validation-error'
            : ''
        } flex items-center text-sm`}
      >
        <input
          type="number"
          placeholder="Free*"
          value={form.free}
          onChange={(e) => handleNumberChange('free', e.target.value)}
          onKeyDown={handleKeyDown}
          className={getInputClassName('free', true)}
          min="0"
          tabIndex={0}
        />
        {showValidation && getFieldError(form, 'free') && (
          <div className="absolute top-full left-0 text-xs text-red-500 mt-1 z-10 bg-white p-1 rounded shadow">
            {getFieldError(form, 'free')}
          </div>
        )}
      </div>

      <div
        className={`mrp input-styles ${
          showValidation && getFieldError(form, 'mrp') ? 'validation-error' : ''
        } flex items-center px-1 text-sm`}
      >
        <span>₹</span>
        <input
          type="number"
          placeholder="MRP*"
          value={form.mrp}
          onChange={(e) => handleNumberChange('mrp', e.target.value)}
          onKeyDown={handleKeyDown}
          className={getInputClassName('mrp', true)}
          min="0.01"
          step="0.01"
          tabIndex={0}
        />
        {showValidation && getFieldError(form, 'mrp') && (
          <div className="absolute top-full left-0 text-xs text-red-500 mt-1 z-10 bg-white p-1 rounded shadow">
            {getFieldError(form, 'mrp')}
          </div>
        )}
      </div>

      <div
        className={`rate input-styles ${
          showValidation && getFieldError(form, 'rate')
            ? 'validation-error'
            : ''
        } flex items-center px-1 text-sm`}
      >
        <span>₹</span>
        <input
          type="number"
          placeholder="Rate*"
          value={form.rate}
          onChange={(e) => handleNumberChange('rate', e.target.value)}
          onKeyDown={handleKeyDown}
          className={getInputClassName('rate', true)}
          min="0.01"
          step="0.01"
          tabIndex={0}
        />
        {showValidation && getFieldError(form, 'rate') && (
          <div className="absolute top-full left-0 text-xs text-red-500 mt-1 z-10 bg-white p-1 rounded shadow">
            {getFieldError(form, 'rate')}
          </div>
        )}
      </div>

      <div className="disc flex items-center pxl-1 pr-2 text-sm input-styles">
        <input
          type="number"
          placeholder="Disc*"
          value={form.disc}
          onChange={(e) => handleNumberChange('disc', e.target.value)}
          onKeyDown={handleKeyDown}
          className="medicine-input borderless"
          min="0"
          max="100"
          step="0.01"
          tabIndex={0}
        />
        <span>%</span>
      </div>
      <div className="gst flex items-center pl-1 pr-2 text-sm input-styles">
        <input
          type="number"
          value={5}
          readOnly
          className="medicine-input borderless bg-gray-100"
        />
        <span>%</span>
      </div>

      <div className="margin flex items-center pl-1 pr-2 text-sm bg-shade-gray h-10 font-semibold">
        <span className="px-2 w-full">{margin.toFixed(2)}</span>
        <span>%</span>
      </div>

      <Tooltip
        content={amount.toFixed(2)}
        position="top"
        disabled={amount.toString().length <= 4}
      >
        <div className="amount flex items-center px-2 text-sm bg-shade-gray h-10 font-semibold">
          <span>{amount.toFixed(2)}</span>
        </div>
      </Tooltip>

      <div className="select">
        {isLast && (
          <Tooltip
            content="Complete all required fields to add new row"
            disabled={currentRowValid}
            position="top"
          >
            <Button
              variant={currentRowValid ? 'default' : 'secondary'}
              className={`font-bold flex gap-2 ${
                !currentRowValid ? 'opacity-60 cursor-not-allowed' : ''
              }`}
              onClick={handleAddNew}
              type="button"
              disabled={!currentRowValid}
            >
              Add
            </Button>
          </Tooltip>
        )}
        <Tooltip content="Delete this row" position="top">
          <Button
            variant="danger"
            className="font-bold"
            onClick={() => onDelete(medicine.id)}
            type="button"
          >
            <MdDelete size={17} />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default AddMedicineRow;
