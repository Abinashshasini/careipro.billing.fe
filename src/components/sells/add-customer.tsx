'use client';
import React, { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Success from '@/components/ui/success';
import apiClient from '@/lib/apiClient';
import { ADD_CUSTOMER, UPDATE_CUSTOMER } from '@/utils/api-endpoints';

const CustomerSchema = z.object({
  customer_name: z.string().min(2, 'Customer name is required'),
  mobile_number: z
    .string()
    .regex(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
  email_id: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  gst_number: z.string().optional(),
  opening_balance: z
    .number()
    .max(1000000, 'Opening balance cannot exceed 10,00,000')
    .optional(),
});

type CustomerForm = z.infer<typeof CustomerSchema>;

import { AddCustomerModalProps } from '@/types/sells';

export default function AddCustomerModal({
  isOpen,
  onClose,
  onSuccess,
  editData = null,
  isEditMode = false,
}: AddCustomerModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CustomerForm>({
    resolver: zodResolver(CustomerSchema),
    defaultValues: {
      customer_name: '',
      mobile_number: '',
      email_id: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      gst_number: '',
      opening_balance: undefined,
    },
  });

  useEffect(() => {
    if (isEditMode && editData && isOpen) {
      setValue('customer_name', editData.customer_name || '');
      setValue('mobile_number', editData.mobile_number || '');
      setValue('email_id', editData.email_id || '');
      setValue('address', editData.address || '');
      setValue('city', editData.city || '');
      setValue('state', editData.state || '');
      setValue('pincode', editData.pincode || '');
      setValue('gst_number', editData.gst_number || '');
      setValue('opening_balance', editData.opening_balance || undefined);
    } else if (!isEditMode && isOpen) {
      reset();
    }
  }, [isEditMode, editData, isOpen, setValue, reset]);

  const customerMutation = useMutation({
    mutationFn: async (data: CustomerForm) => {
      if (isEditMode && editData?._id) {
        const response = await apiClient.put(
          `${UPDATE_CUSTOMER}/${editData._id}`,
          data,
        );
        return response.data;
      } else {
        const response = await apiClient.post(ADD_CUSTOMER, data);
        return response.data;
      }
    },
    onSuccess: () => {
      reset();
      onSuccess();
    },
    onError: (error) => {
      console.error('Customer operation error:', error);
    },
  });

  const onSubmit = (data: CustomerForm) => {
    customerMutation.mutate(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        customerMutation.reset();
      }}
      title={isEditMode ? 'Edit Customer' : 'Add Customer'}
      backdropEnabled={true}
      className="max-w-4xl"
    >
      {customerMutation.isSuccess ? (
        <Success
          text={customerMutation.data.message}
          className="py-12"
          iconSize={{ width: 100, height: 100 }}
        />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Customer Name"
                placeholder="Enter customer name"
                error={errors.customer_name?.message}
                {...register('customer_name')}
              />
              <Input
                label="Mobile Number"
                placeholder="Enter 10-digit mobile number"
                error={errors.mobile_number?.message}
                {...register('mobile_number')}
              />
              <Input
                label="Email (Optional)"
                placeholder="email@example.com"
                error={errors.email_id?.message}
                {...register('email_id')}
              />
              <Input
                label="Opening Balance (Optional)"
                type="number"
                placeholder="₹ 0"
                error={errors.opening_balance?.message}
                {...register('opening_balance', {
                  setValueAs: (value) => {
                    if (value === '' || value == null) return undefined;
                    const num = Number(value);
                    return isNaN(num) ? undefined : num;
                  },
                })}
              />
            </div>
          </div>

          {/* Tax Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">
              Tax Information (Optional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="GST Number"
                placeholder="Enter GST number"
                error={errors.gst_number?.message}
                {...register('gst_number')}
              />
            </div>
          </div>

          {/* Location Details */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">
              Location Details (Optional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="City"
                placeholder="Enter city"
                error={errors.city?.message}
                {...register('city')}
              />
              <Input
                label="State"
                placeholder="Enter state"
                error={errors.state?.message}
                {...register('state')}
              />
              <Input
                label="Pincode"
                placeholder="Enter pincode"
                error={errors.pincode?.message}
                {...register('pincode')}
              />
            </div>
            <div className="mt-4">
              <Textarea
                label="Full Address"
                placeholder="Enter complete address"
                error={errors.address?.message}
                {...register('address')}
                rows={3}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                onClose();
                customerMutation.reset();
              }}
              disabled={customerMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              className="flex-1"
              disabled={customerMutation.isPending}
            >
              {customerMutation.isPending
                ? 'Saving...'
                : isEditMode
                  ? 'Update Customer'
                  : 'Save Customer'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
