'use client';
import { useState } from 'react';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Select from 'react-select';

import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Success from '@/components/ui/success';
import apiClient from '@/lib/apiClient';

type DistributorOption = {
  value: string;
  label: string;
  distributor: DistributorForm;
};

type SearchDistributorsResponse = {
  success: boolean;
  data: {
    distributors: DistributorForm[];
  };
};

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

interface AddDistributorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddDistributorModal({
  isOpen,
  onClose,
}: AddDistributorModalProps) {
  const [distributorOptions, setDistributorOptions] = useState<
    DistributorOption[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
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

  // Search distributors function
  const searchDistributors = async (inputValue: string) => {
    if (!inputValue || inputValue.length < 2) {
      setDistributorOptions([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await apiClient.get<SearchDistributorsResponse>(
        `/billing-dashboard/search-distributors?search=${inputValue}`,
      );

      if (response.data.data?.distributors) {
        const options: DistributorOption[] =
          response.data.data.distributors.map((dist) => ({
            value: dist.distributor_name,
            label: `${dist.distributor_name} | ${dist.gst_number} | ${dist.mobile_number}`,
            distributor: dist,
          }));
        setDistributorOptions(options);
      } else {
        setDistributorOptions([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setDistributorOptions([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle distributor selection
  const handleDistributorSelect = (
    selectedOption: DistributorOption | null,
  ) => {
    if (selectedOption) {
      const { distributor } = selectedOption;
      Object.keys(distributor).forEach((key) => {
        if (key in distributor) {
          setValue(
            key as keyof DistributorForm,
            distributor[key as keyof DistributorForm] || '',
          );
        }
      });
    }
  };

  const addDistributorMutation = useMutation({
    mutationFn: async (data: DistributorForm) => {
      const response = await apiClient.post(
        '/billing-dashboard/add-distributor',
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      reset();
    },
    onError: (error) => {
      console.error('Add distributor error:', error);
    },
  });

  const onSubmit = (data: DistributorForm) => {
    addDistributorMutation.mutate(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        addDistributorMutation.reset();
      }}
      title={'Add Distributor'}
      backdropEnabled={true}
      className="max-w-3xl"
    >
      {addDistributorMutation.isSuccess ? (
        <Success
          text={addDistributorMutation.data.message}
          className="py-12"
          iconSize={{ width: 100, height: 100 }}
        />
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full px-1"
        >
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Distributor Name
            </label>
            <Controller
              name="distributor_name"
              control={control}
              render={({ field }) => (
                <Select<DistributorOption>
                  value={
                    field.value
                      ? {
                          value: field.value,
                          label: field.value,
                          distributor: {} as DistributorForm,
                        }
                      : null
                  }
                  options={distributorOptions}
                  isLoading={isSearching}
                  onInputChange={(inputValue, { action }) => {
                    if (action === 'input-change') {
                      field.onChange(inputValue);
                      searchDistributors(inputValue);
                    }
                  }}
                  onChange={(selectedOption) => {
                    if (selectedOption && 'distributor' in selectedOption) {
                      field.onChange(selectedOption.value);
                      handleDistributorSelect(selectedOption);
                    }
                  }}
                  inputValue={field.value || ''}
                  placeholder="Enter distributor name"
                  isClearable
                  isSearchable
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.value}
                  noOptionsMessage={({ inputValue }) =>
                    inputValue.length < 2
                      ? 'Type to search existing distributors'
                      : 'No existing distributors found - you can add as new'
                  }
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    option: (base) => ({
                      ...base,
                      fontSize: '0.875rem',
                      fontWeight: '600',
                    }),
                  }}
                />
              )}
            />
            {errors.distributor_name && (
              <span className="text-sm text-red-500 mt-1">
                {errors.distributor_name.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <Controller
              name="mobile_number"
              control={control}
              render={({ field }) => (
                <Select<DistributorOption>
                  value={
                    field.value
                      ? {
                          value: field.value,
                          label: field.value,
                          distributor: {} as DistributorForm,
                        }
                      : null
                  }
                  options={distributorOptions}
                  isLoading={isSearching}
                  onInputChange={(inputValue, { action }) => {
                    if (action === 'input-change') {
                      field.onChange(inputValue);
                      searchDistributors(inputValue);
                    }
                  }}
                  onChange={(selectedOption) => {
                    if (selectedOption && 'distributor' in selectedOption) {
                      field.onChange(
                        selectedOption.distributor.mobile_number || '',
                      );
                      handleDistributorSelect(selectedOption);
                    }
                  }}
                  inputValue={field.value || ''}
                  placeholder="Enter mobile number"
                  isClearable
                  isSearchable
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) =>
                    option.distributor.mobile_number || ''
                  }
                  noOptionsMessage={({ inputValue }) =>
                    inputValue.length < 2
                      ? 'Type to search existing distributors'
                      : 'No existing distributors found - you can add as new'
                  }
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    option: (base) => ({
                      ...base,
                      fontSize: '0.875rem',
                      fontWeight: '600',
                    }),
                  }}
                />
              )}
            />
            {errors.mobile_number && (
              <span className="text-sm text-red-500 mt-1">
                {errors.mobile_number.message}
              </span>
            )}
          </div>

          <Input
            label="Email (optional)"
            placeholder="Email"
            error={errors.email_id?.message}
            {...register('email_id')}
          />

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              GST Number
            </label>
            <Controller
              name="gst_number"
              control={control}
              render={({ field }) => (
                <Select<DistributorOption>
                  value={
                    field.value
                      ? {
                          value: field.value,
                          label: field.value,
                          distributor: {} as DistributorForm,
                        }
                      : null
                  }
                  options={distributorOptions}
                  isLoading={isSearching}
                  onInputChange={(inputValue, { action }) => {
                    if (action === 'input-change') {
                      field.onChange(inputValue);
                      searchDistributors(inputValue);
                    }
                  }}
                  onChange={(selectedOption) => {
                    if (selectedOption && 'distributor' in selectedOption) {
                      field.onChange(
                        selectedOption.distributor.gst_number || '',
                      );
                      handleDistributorSelect(selectedOption);
                    }
                  }}
                  inputValue={field.value || ''}
                  placeholder="Enter GST number"
                  isClearable
                  isSearchable
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) =>
                    option.distributor.gst_number || ''
                  }
                  noOptionsMessage={({ inputValue }) =>
                    inputValue.length < 2
                      ? 'Type to search existing distributors'
                      : 'No existing distributors found - you can add as new'
                  }
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    option: (base) => ({
                      ...base,
                      fontSize: '0.875rem',
                      fontWeight: '600',
                    }),
                  }}
                />
              )}
            />
            {errors.gst_number && (
              <span className="text-sm text-red-500 mt-1">
                {errors.gst_number.message}
              </span>
            )}
          </div>

          <Input
            label="Drug Licence (optional)"
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
              disabled={addDistributorMutation.isPending}
            >
              Save Distributor
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
