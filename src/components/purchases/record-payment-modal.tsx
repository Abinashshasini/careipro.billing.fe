'use client';
import React, { useEffect } from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import 'react-datepicker/dist/react-datepicker.css';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PurchaseOrder } from '@/types/purchases';

// Zod validation schema
const paymentSchema = z.object({
  payment_amount: z.number().min(0.01, 'Payment amount must be greater than 0'),
  payment_date: z
    .date()
    .max(new Date(), 'Payment date cannot be in the future'),
  payment_method: z.enum([
    'cash',
    'bank_transfer',
    'cheque',
    'upi',
    'card',
    'other',
  ]),
  reference_number: z
    .string()
    .max(100, 'Reference number cannot exceed 100 characters')
    .optional()
    .or(z.literal('')),
  notes: z
    .string()
    .max(500, 'Notes cannot exceed 500 characters')
    .optional()
    .or(z.literal('')),
});

export type PaymentData = z.infer<typeof paymentSchema>;

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (paymentData: PaymentData) => void;
  purchaseOrder: PurchaseOrder | null;
  isLoading?: boolean;
}

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'upi', label: 'UPI' },
  { value: 'card', label: 'Card' },
  { value: 'other', label: 'Other' },
] as const;

type PaymentMethodOption = {
  value: PaymentData['payment_method'];
  label: string;
};

const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  purchaseOrder,
  isLoading = false,
}) => {
  // Enhanced Zod schema with dynamic validation based on purchase order
  const enhancedPaymentSchema = paymentSchema.refine(
    (data) => {
      if (
        purchaseOrder &&
        data.payment_amount > purchaseOrder.total_amount_payable
      ) {
        return false;
      }
      return true;
    },
    {
      message: 'Payment amount cannot exceed the payable amount',
      path: ['payment_amount'],
    },
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentData>({
    resolver: zodResolver(enhancedPaymentSchema),
    defaultValues: {
      payment_amount: 0,
      payment_date: new Date(),
      payment_method: 'cash',
      reference_number: '',
      notes: '',
    },
  });

  // Reset form when modal opens with purchase order data
  useEffect(() => {
    if (isOpen && purchaseOrder) {
      reset({
        payment_amount: purchaseOrder.total_amount_payable || 0,
        payment_date: new Date(),
        payment_method: 'cash',
        reference_number: '',
        notes: '',
      });
    }
  }, [isOpen, purchaseOrder, reset]);

  const onSubmit = (data: PaymentData) => {
    onConfirm(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Record Payment for Invoice "${purchaseOrder?.invoice_no}"`}
    >
      <div className="w-full px-1 pb-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4 grid-cols-2"
        >
          {/* Payment Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Amount *
            </label>
            <Controller
              name="payment_amount"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  min="0"
                  max={purchaseOrder?.total_amount_payable || undefined}
                  step="0.01"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                  placeholder="Enter payment amount"
                  error={errors.payment_amount?.message}
                />
              )}
            />
          </div>

          {/* Payment Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 w-full">
              Payment Date *
            </label>
            <Controller
              name="payment_date"
              control={control}
              render={({ field }) => (
                <div>
                  <DatePicker
                    selected={field.value}
                    onChange={(date: Date | null) => field.onChange(date)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                      errors.payment_date
                        ? 'border-red-300 focus:border-red-300 focus:ring-red-500'
                        : 'border-gray-300'
                    }`}
                    dateFormat="MMM dd, yyyy"
                    placeholderText="Select payment date"
                    maxDate={new Date()}
                  />
                  {errors.payment_date && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.payment_date.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium  text-gray-700 mb-1">
              Payment Method *
            </label>
            <Controller
              name="payment_method"
              control={control}
              render={({ field }) => (
                <div>
                  <Select<PaymentMethodOption>
                    value={PAYMENT_METHODS.find(
                      (method) => method.value === field.value,
                    )}
                    onChange={(selectedOption) => {
                      if (selectedOption) {
                        field.onChange(selectedOption.value);
                      }
                    }}
                    options={PAYMENT_METHODS}
                    placeholder="Select payment method"
                    className="react-select-container"
                    classNamePrefix="react-select"
                    isSearchable={false}
                    styles={{
                      option: (base) => ({
                        ...base,
                        fontSize: '0.875rem',
                        fontWeight: '600',
                      }),
                    }}
                  />
                  {errors.payment_method && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.payment_method.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Reference Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reference Number
            </label>
            <Controller
              name="reference_number"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  {...field}
                  placeholder="Cheque number, transaction ID, etc."
                  error={errors.reference_number?.message}
                  maxLength={100}
                />
              )}
            />
          </div>

          {/* Notes */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <div>
                  <Textarea
                    {...field}
                    placeholder="Additional notes about the payment..."
                    rows={3}
                    error={errors.notes?.message}
                    maxLength={100}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {field.value?.length || 0}/100 characters
                  </p>
                </div>
              )}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 justify-end col-span-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="default" disabled={isLoading}>
              {isLoading ? 'Recording...' : 'Record Payment'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default RecordPaymentModal;
