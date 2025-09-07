'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IoPersonAdd } from 'react-icons/io5';
import apiClient from '@/lib/apiClient';
import { Textarea } from '../ui/textarea';

// ✅ Validation Schema
const RegisterSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  mobile: z.string().regex(/^[0-9]{10}$/, 'Mobile must be 10 digits'),
  email_id: z.string().email('Invalid email'),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
  city: z.string().min(2, 'City is required'),
  market: z.string().min(2, 'Market is required'),
  gst_no: z.string().min(5, 'GST No is required'),
  address: z.string().min(5, 'Address is required'),
  upi_id: z.string().regex(/^[\w.-]+@[\w.-]+$/, 'Invalid UPI ID'),
});

type AuthFlow = 'login' | 'register';

type RegisterProps = {
  onChangeFlow: (flow: AuthFlow) => void;
};

export default function Register({ onChangeFlow }: RegisterProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      mobile: '',
      email_id: '',
      password: '',
      city: '',
      market: '',
      gst_no: '',
      address: '',
      upi_id: '',
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: z.infer<typeof RegisterSchema>) => {
      const response = await apiClient.post('/store/register', data);
      return response.data;
    },
    onSuccess: () => {
      router.push('/dashboard');
    },
    onError: (error) => {
      if (error) {
        console.error(error);
      }
    },
  });

  const onSubmit = (data: z.infer<typeof RegisterSchema>) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="p-8 bg-white shadow rounded-xl w-full max-w-2xl mx-auto">
      <div className="flex flex-col items-center space-y-3 pt-4 mb-6">
        <div className="p-3 rounded-full bg-bg-primary text-primary">
          <IoPersonAdd size={30} />
        </div>
        <h2 className="text-xl font-semibold text-black">Create Account</h2>
        <p className="text-sm text-gray-500 text-center">
          Fill in the details to register your pharmacy
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <Input
          label="Full Name"
          placeholder="Enter your name"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Mobile Number"
          type="number"
          placeholder="10 digit mobile"
          error={errors.mobile?.message}
          {...register('mobile')}
        />

        <Input
          label="Email"
          type="email"
          placeholder="Email address"
          error={errors.email_id?.message}
          {...register('email_id')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter password"
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="City"
          placeholder="City"
          error={errors.city?.message}
          {...register('city')}
        />

        <Input
          label="Market"
          placeholder="Market"
          error={errors.market?.message}
          {...register('market')}
        />

        <Input
          label="GST No"
          placeholder="GST Number"
          error={errors.gst_no?.message}
          {...register('gst_no')}
        />

        <Input
          label="UPI ID"
          placeholder="example@upi"
          error={errors.upi_id?.message}
          {...register('upi_id')}
        />

        <div className="md:col-span-2">
          <Textarea
            label="Address"
            placeholder="Full address"
            error={errors.address?.message?.toString()}
            {...register('address')}
          />
        </div>

        <div
          className="md:col-span-2 text-right"
          onClick={() => onChangeFlow('login')}
        >
          <a href="#" className="text-sm text-gray hover:underline">
            Already have an account? Login
          </a>
        </div>

        <div className="md:col-span-2">
          <Button type="submit" variant="default" className="w-full mt-4">
            Register
          </Button>
        </div>
      </form>
    </div>
  );
}
