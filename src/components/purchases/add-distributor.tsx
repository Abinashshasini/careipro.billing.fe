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
import { ADD_DISTRIBUTOR, UPDATE_DISTRIBUTOR } from '@/utils/api-endpoints';

const DistributorSchema = z.object({
  distributor_name: z.string().min(2, 'Distributor name is required'),
  state: z.string().min(2, 'State is required'),
  district: z.string().min(2, 'District is required'),
  mobile_number: z
    .string()
    .regex(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
  email_id: z.string().email('Invalid email').optional().or(z.literal('')),
  gst_number: z.string().min(5, 'GST Number is required'),
  drug_license_number: z.string().min(5, 'Drug Licence Number is required'),
  address: z.string().optional(),
  opening_balance: z
    .number()
    .max(1000000, 'Opening balance cannot exceed 10,00,000')
    .optional(),
});

type DistributorForm = z.infer<typeof DistributorSchema>;

import { AddDistributorModalProps } from '@/types/purchases';

export default function AddDistributorModal({
  isOpen,
  onClose,
  onSuccess,
  editData = null,
  isEditMode = false,
}: AddDistributorModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DistributorForm>({
    resolver: zodResolver(DistributorSchema),
    defaultValues: {
      distributor_name: '',
      state: '',
      district: '',
      mobile_number: '',
      email_id: '',
      gst_number: '',
      drug_license_number: '',
      address: '',
      opening_balance: undefined,
    },
  });

  useEffect(() => {
    if (isEditMode && editData && isOpen) {
      setValue('distributor_name', editData.distributor_name || '');
      setValue('state', editData.state || '');
      setValue('district', editData.district || '');
      setValue('mobile_number', editData.mobile_number || '');
      setValue('email_id', editData.email_id || '');
      setValue('gst_number', editData.gst_number || '');
      setValue('drug_license_number', editData.drug_license_number || '');
      setValue('address', editData.address || '');
      setValue('opening_balance', editData.opening_balance || undefined);
    } else if (!isEditMode && isOpen) {
      reset();
    }
  }, [isEditMode, editData, isOpen, setValue, reset]);

  const distributorMutation = useMutation({
    mutationFn: async (data: DistributorForm) => {
      if (isEditMode && editData?._id) {
        const response = await apiClient.put(
          `${UPDATE_DISTRIBUTOR}/${editData._id}`,
          data,
        );
        return response.data;
      } else {
        const response = await apiClient.post(ADD_DISTRIBUTOR, data);
        return response.data;
      }
    },
    onSuccess: () => {
      reset();
      onSuccess();
    },
    onError: (error) => {
      console.error('Distributor operation error:', error);
    },
  });

  const onSubmit = (data: DistributorForm) => {
    distributorMutation.mutate(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        distributorMutation.reset();
      }}
      title={isEditMode ? 'Edit Distributor' : 'Add Distributor'}
      backdropEnabled={true}
      className="max-w-3xl"
    >
      {distributorMutation.isSuccess ? (
        <Success
          text={distributorMutation.data.message}
          className="py-12"
          iconSize={{ width: 100, height: 100 }}
        />
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full px-1"
        >
          <Input
            label="Distributor Name"
            placeholder="Enter distributor name"
            error={errors.distributor_name?.message}
            {...register('distributor_name')}
          />

          <Input
            label="Mobile Number"
            placeholder="Enter mobile number"
            error={errors.mobile_number?.message}
            {...register('mobile_number')}
          />

          <Input
            label="Email (optional)"
            placeholder="Email"
            error={errors.email_id?.message}
            {...register('email_id')}
          />

          <Input
            label="GST Number"
            placeholder="Enter GST number"
            error={errors.gst_number?.message}
            {...register('gst_number')}
          />

          <Input
            label="Drug Licence"
            placeholder="Drug Licence Number"
            error={errors.drug_license_number?.message}
            {...register('drug_license_number')}
          />

          <Input
            label="State"
            placeholder="State"
            error={errors.state?.message}
            {...register('state')}
          />

          <Input
            label="District"
            placeholder="District"
            error={errors.district?.message}
            {...register('district')}
          />

          <Input
            label="Opening Balance (optional)"
            type="number"
            placeholder="Enter opening balance"
            error={errors.opening_balance?.message}
            {...register('opening_balance', {
              setValueAs: (value) => {
                if (value === '' || value == null) return undefined;
                const num = Number(value);
                return isNaN(num) ? undefined : num;
              },
            })}
          />

          <div className="md:col-span-2">
            <Textarea
              label="Address"
              placeholder="Full address"
              error={errors.address?.message}
              {...register('address')}
            />
          </div>

          <div className="md:col-span-2">
            <Button
              type="submit"
              variant="default"
              className="w-full mt-4"
              disabled={distributorMutation.isPending}
            >
              {isEditMode ? 'Update Distributor' : 'Save Distributor'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
