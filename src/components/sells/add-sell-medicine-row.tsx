'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { MdDelete } from 'react-icons/md';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import debounce from 'debounce';
import { Button } from '@/components/ui/button';
import Tooltip from '@/components/ui/tooltip';
import apiClient from '@/lib/apiClient';
import { SEARCH_MEDICINES_STOCK } from '@/utils/api-endpoints';
import {
  MedicineSearchResult,
  MedicineSelectOption,
  BatchSelectOption,
} from '@/types/purchases';
import { SellMedicine } from '@/types/sells';
import { getFieldError, isRowComplete } from '@/lib/medicineValidation';

const GST_RATE = 0.05;

interface AddSellMedicineRowProps {
  medicine: SellMedicine;
  onUpdate: (id: string, data: Partial<SellMedicine>) => void;
  onDelete: (id: string) => void;
  isLast: boolean;
  onAddNew: () => void;
  isReadOnly?: boolean;
}

const AddSellMedicineRow: React.FC<AddSellMedicineRowProps> = ({
  medicine,
  onUpdate,
  onDelete,
  isLast,
  onAddNew,
  isReadOnly = false,
}) => {
  const [form, setForm] = useState<SellMedicine>(medicine);
  const [amount, setAmount] = useState(0);
  const [margin, setMargin] = useState(0);
  const [showValidation, setShowValidation] = useState(false);

  // Medicine search state
  const [medicineOptions, setMedicineOptions] = useState<
    MedicineSelectOption[]
  >([]);
  const [selectedMedicine, setSelectedMedicine] =
    useState<MedicineSelectOption | null>(null);
  const [medicineLoading, setMedicineLoading] = useState(false);

  // Batch selection state
  const [batchOptions, setBatchOptions] = useState<BatchSelectOption[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<BatchSelectOption | null>(
    null,
  );

  const currentRowValid = isRowComplete(form);

  // Search medicines in stock with debounce
  const searchMedicines = useCallback((searchTerm: string) => {
    const debouncedSearch = debounce(async (term: string) => {
      if (!term || term.length < 2) {
        setMedicineOptions([]);
        return;
      }

      setMedicineLoading(true);
      try {
        const response = await apiClient.post(SEARCH_MEDICINES_STOCK, {
          search: term,
        });

        const medicines: MedicineSearchResult[] =
          response.data?.data?.medicines || [];
        const options: MedicineSelectOption[] = medicines.map((element) => ({
          value: element._id,
          label: `${element.name}${
            element.manufacturer ? ` - ${element.manufacturer}` : ''
          }`,
          medicine: element,
        }));

        setMedicineOptions(options);
      } catch (error) {
        console.error('Error searching medicines:', error);
        setMedicineOptions([]);
      } finally {
        setMedicineLoading(false);
      }
    }, 300);

    debouncedSearch(searchTerm);
  }, []);

  const handleMedicineSelect = (option: MedicineSelectOption | null) => {
    setSelectedMedicine(option);
    setSelectedBatch(null);
    setBatchOptions([]);

    if (option?.medicine) {
      const batches = option.medicine.batches || [];
      const availableBatches = batches.filter(
        (b) => (b.qty_available || 0) > 0,
      );

      const batchOpts: BatchSelectOption[] = availableBatches.map((batch) => ({
        value: batch._id,
        label: `${batch.batch} - Exp: ${batch.expiry_mm}/${batch.expiry_yy} - Qty: ${batch.qty_available || 0} - MRP: ₹${batch.mrp || 0}`,
        batch,
      }));

      setBatchOptions(batchOpts);

      updateForm({
        medicine_id: option.medicine._id,
        med_name: option.medicine.name,
        batch: '',
        expiryMM: '',
        expiryYY: '',
        pack: option.medicine.pack_size || '',
        mrp: '',
        rate: '',
        disc: '',
        available_qty: 0,
      });
    } else {
      updateForm({
        medicine_id: '',
        med_name: '',
        batch: '',
        expiryMM: '',
        expiryYY: '',
        pack: '',
        mrp: '',
        rate: '',
        disc: '',
        available_qty: 0,
      });
    }
  };

  const handleBatchSelect = (option: BatchSelectOption | null) => {
    setSelectedBatch(option);

    if (option?.batch) {
      const { batch, expiry_mm, expiry_yy, mrp, rate, disc, qty_available } =
        option.batch;

      updateForm({
        batch: batch || '',
        expiryMM: expiry_mm || '',
        expiryYY: expiry_yy || '',
        mrp: mrp || '',
        rate: rate || '',
        disc: disc || 0,
        available_qty: qty_available || 0,
      });
    }
  };

  const updateForm = (updates: Partial<SellMedicine>) => {
    const newForm = { ...form, ...updates };
    setForm(newForm);
  };

  // Calculate amount and margin
  useEffect(() => {
    const qty = Number(form.qty) || 0;
    const free = Number(form.free) || 0;
    const rate = Number(form.rate) || 0;
    const disc = Number(form.disc) || 0;
    const mrp = Number(form.mrp) || 0;

    const totalQty = qty + free;
    const discountAmount = (qty * rate * disc) / 100;
    const netAmount = qty * rate - discountAmount;
    const amountWithGST = netAmount * (1 + GST_RATE);

    let calculatedMargin = 0;
    if (totalQty > 0 && mrp > 0) {
      const costPerUnit = amountWithGST / totalQty;
      calculatedMargin = ((mrp - costPerUnit) / mrp) * 100;
    }

    setAmount(amountWithGST);
    setMargin(calculatedMargin);

    onUpdate(medicine.id, {
      ...form,
      amount: amountWithGST,
      margin: calculatedMargin,
    });
  }, [
    form.qty,
    form.free,
    form.rate,
    form.disc,
    form.mrp,
    form.med_name,
    form.batch,
    form.pack,
    form.expiryMM,
    form.expiryYY,
  ]);

  // Auto-add new row when current row is complete
  useEffect(() => {
    if (currentRowValid && isLast && !isReadOnly) {
      setShowValidation(false);
      onAddNew();
    }
  }, [currentRowValid, isLast, isReadOnly, onAddNew]);

  const handleInputChange = (
    field: keyof SellMedicine,
    value: string | number,
  ) => {
    setShowValidation(true);
    updateForm({ [field]: value });
  };

  const handleDelete = () => {
    onDelete(medicine.id);
  };

  const getInputClassName = (field: keyof SellMedicine) => {
    const baseClass =
      'w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-primary';
    const error = getFieldError(form, field);

    if (!showValidation || !error) {
      return `${baseClass} border-gray-300`;
    }

    return `${baseClass} border-red-500`;
  };

  const availableQty = form.available_qty || 0;
  const requestedQty = Number(form.qty) || 0;
  const isQtyExceeded = requestedQty > availableQty;

  return (
    <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-gray-200 hover:bg-gray-50 transition-colors items-start">
      {/* Medicine & Pack */}
      <div className="col-span-3 space-y-2">
        <Select
          value={selectedMedicine}
          onChange={handleMedicineSelect}
          onInputChange={searchMedicines}
          options={medicineOptions}
          isLoading={medicineLoading}
          placeholder="Search medicine..."
          isClearable
          isDisabled={isReadOnly}
          className="text-sm"
          styles={{
            control: (base) => ({
              ...base,
              minHeight: '34px',
              fontSize: '0.875rem',
            }),
          }}
        />
        <input
          type="text"
          value={form.pack}
          onChange={(e) => handleInputChange('pack', e.target.value)}
          placeholder="Pack"
          className={getInputClassName('pack')}
          disabled={isReadOnly}
        />
      </div>

      {/* Batch & Expiry */}
      <div className="col-span-2 space-y-2">
        <Select
          value={selectedBatch}
          onChange={handleBatchSelect}
          options={batchOptions}
          placeholder="Select batch"
          isClearable
          isDisabled={isReadOnly || !selectedMedicine}
          className="text-sm"
          styles={{
            control: (base) => ({
              ...base,
              minHeight: '34px',
              fontSize: '0.875rem',
            }),
          }}
        />
        <div className="flex gap-1">
          <input
            type="text"
            value={form.expiryMM}
            placeholder="MM"
            className={getInputClassName('expiryMM')}
            disabled
            readOnly
          />
          <input
            type="text"
            value={form.expiryYY}
            placeholder="YY"
            className={getInputClassName('expiryYY')}
            disabled
            readOnly
          />
        </div>
      </div>

      {/* Quantity */}
      <div className="col-span-2 space-y-2">
        <div className="relative">
          <input
            type="number"
            value={form.qty}
            onChange={(e) => handleInputChange('qty', e.target.value)}
            placeholder="Qty"
            className={`${getInputClassName('qty')} ${isQtyExceeded ? 'border-red-500' : ''}`}
            disabled={isReadOnly}
          />
          {isQtyExceeded && (
            <Tooltip
              content={`Only ${availableQty} available in stock`}
              position="top"
            >
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 text-xs font-bold">
                !
              </div>
            </Tooltip>
          )}
        </div>
        <div className="text-xs text-gray-600 text-center">
          Avail: {availableQty}
        </div>
      </div>

      {/* Pricing */}
      <div className="col-span-2 space-y-2">
        <input
          type="number"
          value={form.mrp}
          placeholder="MRP"
          className={getInputClassName('mrp')}
          disabled
          readOnly
        />
        <input
          type="number"
          value={form.disc}
          onChange={(e) => handleInputChange('disc', e.target.value)}
          placeholder="Disc %"
          className={getInputClassName('disc')}
          disabled={isReadOnly}
        />
      </div>

      {/* Amount & Margin */}
      <div className="col-span-2 space-y-2 text-right">
        <div className="px-2 py-1.5 bg-gray-100 rounded text-sm font-semibold text-gray-900">
          ₹{amount.toFixed(2)}
        </div>
        <div
          className={`px-2 py-1.5 rounded text-sm font-semibold ${
            margin >= 20
              ? 'bg-green-100 text-green-700'
              : margin >= 10
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
          }`}
        >
          {margin.toFixed(1)}%
        </div>
      </div>

      {/* Delete Button */}
      <div className="col-span-1 flex items-center justify-center">
        {!isReadOnly && (
          <Tooltip content="Delete" position="top">
            <Button
              variant="ghost"
              onClick={handleDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded"
            >
              <MdDelete size={18} />
            </Button>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default AddSellMedicineRow;
