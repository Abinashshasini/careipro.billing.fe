'use client';
import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PaymentModalProps } from '@/types/sells';

const paymentSchema = z.object({
  payment_method: z.enum(['cash', 'card', 'upi', 'bank_transfer', 'other']),
  amount_paid: z.number().min(0, 'Amount must be at least 0'),
  reference_number: z.string().optional(),
  notes: z.string().optional(),
});

type PaymentForm = z.infer<typeof paymentSchema>;

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash', icon: '💵' },
  { value: 'card', label: 'Card', icon: '💳' },
  { value: 'upi', label: 'UPI', icon: '📱' },
  { value: 'bank_transfer', label: 'Bank Transfer', icon: '🏦' },
  { value: 'other', label: 'Other', icon: '📝' },
] as const;

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  totalAmount,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      payment_method: 'cash',
      amount_paid: totalAmount,
      reference_number: '',
      notes: '',
    },
  });

  const [selectedMethod, setSelectedMethod] = useState<string>('cash');
  const amountPaid = watch('amount_paid');

  useEffect(() => {
    if (isOpen) {
      setValue('amount_paid', totalAmount);
    }
  }, [isOpen, totalAmount, setValue]);

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
    setValue(
      'payment_method',
      method as 'cash' | 'card' | 'upi' | 'bank_transfer' | 'other',
    );
  };

  const onSubmit = (data: PaymentForm) => {
    onConfirm({
      payment_method: data.payment_method,
      amount: data.amount_paid,
      reference_number: data.reference_number,
      notes: data.notes,
    });
  };

  const handleClose = () => {
    reset();
    setSelectedMethod('cash');
    onClose();
  };

  const balance = (amountPaid || 0) - totalAmount;
  const isPending = (amountPaid || 0) < totalAmount;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Collect Payment"
      backdropEnabled={true}
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Amount Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-600 font-medium mb-1">
                Total Amount
              </p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{totalAmount.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium mb-1">
                Amount Paying
              </p>
              <p className="text-2xl font-bold text-primary">
                ₹{(amountPaid || 0).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium mb-1">
                {balance >= 0 ? 'Change' : 'Due'}
              </p>
              <p
                className={`text-2xl font-bold ${
                  balance >= 0 ? 'text-green-600' : 'text-orange-600'
                }`}
              >
                ₹{Math.abs(balance).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select Payment Method
          </label>
          <div className="grid grid-cols-5 gap-3">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.value}
                type="button"
                onClick={() => handleMethodSelect(method.value)}
                className={`p-4 rounded-lg border-2 transition-all text-center ${
                  selectedMethod === method.value
                    ? 'border-primary bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="text-3xl mb-2">{method.icon}</div>
                <div className="text-xs font-semibold text-gray-700">
                  {method.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <Input
            label="Amount Paying"
            type="number"
            step="0.01"
            placeholder="Enter amount"
            error={errors.amount_paid?.message}
            {...register('amount_paid', {
              setValueAs: (value) => parseFloat(value) || 0,
            })}
          />
        </div>

        {/* Reference Number (for non-cash payments) */}
        {selectedMethod !== 'cash' && (
          <div>
            <Input
              label="Reference Number (Optional)"
              placeholder="Enter transaction reference"
              {...register('reference_number')}
            />
          </div>
        )}

        {/* Notes */}
        <div>
          <Textarea
            label="Notes (Optional)"
            placeholder="Add any notes about this payment"
            {...register('notes')}
            rows={2}
          />
        </div>

        {/* Warning for pending payment */}
        {isPending && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-sm text-orange-800 font-medium">
              ⚠️ Partial payment detected. ₹{Math.abs(balance).toFixed(2)} will
              be marked as pending.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Confirm & Save'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PaymentModal;
