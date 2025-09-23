'use client';

import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import apiClient from '@/lib/apiClient';

// ✅ Schema
const DistributorSchema = z.object({
  suppliers_name: z.string().min(2, 'Supplier name is required'),
  state: z.string().min(2, 'State is required'),
  district: z.string().min(2, 'District is required'),
  mobile_number: z
    .string()
    .regex(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
  email_id: z.string().email('Invalid email').optional().or(z.literal('')),
  gst_number: z.string().min(5, 'GST Number is required'),
  drug_licence_number: z.string().optional(),
  address: z.string().optional(),
});

type DistributorForm = z.infer<typeof DistributorSchema>;

interface AddDistributorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddDistributorModal({
  isOpen,
  onClose,
}: AddDistributorModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DistributorForm>({
    resolver: zodResolver(DistributorSchema),
    defaultValues: {
      suppliers_name: '',
      state: '',
      district: '',
      mobile_number: '',
      email_id: '',
      gst_number: '',
      drug_licence_number: '',
      address: '',
    },
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const nameValue = watch('suppliers_name');
  const gstValue = watch('gst_number');
  const mobileValue = watch('mobile_number');

  useEffect(() => {
    const term = nameValue || gstValue || mobileValue;
    if (term) setSearchTerm(term);
  }, [nameValue, gstValue, mobileValue]);

  // ✅ Fetch supplier if match found
  useEffect(() => {
    const fetchSupplier = async () => {
      if (!debouncedValue) return;
      try {
        const res = await apiClient.get(
          `/suppliers/search?query=${debouncedValue}`,
        );
        if (res.data) {
          const supplier = res.data;
          Object.keys(supplier).forEach((key) => {
            if (key in supplier) {
              setValue(key as keyof DistributorForm, supplier[key] || '');
            }
          });
        }
      } catch (error) {
        console.error('Supplier search error:', error);
      }
    };
    fetchSupplier();
  }, [debouncedValue, setValue]);

  // ✅ Save Mutation
  const addDistributorMutation = useMutation({
    mutationFn: async (data: DistributorForm) => {
      const response = await apiClient.post('/suppliers/add', data);
      return response.data;
    },
    onSuccess: () => {
      onClose();
    },
    onError: (error) => {
      console.error('Add supplier error:', error);
    },
  });

  const onSubmit = (data: DistributorForm) => {
    addDistributorMutation.mutate(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Distributor"
      backdropEnabled={true}
      className="max-w-3xl"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full"
      >
        <Input
          label="Supplier Name"
          placeholder="Enter supplier name"
          error={errors.suppliers_name?.message}
          {...register('suppliers_name')}
        />

        <Input
          label="Mobile Number"
          placeholder="10 digit mobile"
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
          placeholder="GST Number"
          error={errors.gst_number?.message}
          {...register('gst_number')}
        />

        <Input
          label="Drug Licence (optional)"
          placeholder="Drug Licence Number"
          error={errors.drug_licence_number?.message}
          {...register('drug_licence_number')}
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
            // disabled={addDistributorMutation.isLoading}
          >
            Save Distributor
          </Button>
        </div>
      </form>
    </Modal>
  );
}
