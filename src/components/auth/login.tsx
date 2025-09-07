'use client';

import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IoLogIn } from 'react-icons/io5';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';

const FormSchema = z.object({
  mobile: z.string().regex(/^[0-9]{10}$/, 'Mobile must be 10 digits'),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
});

type AuthFlow = 'login' | 'register';

type LoginProps = {
  onChangeFlow: (flow: AuthFlow) => void;
};

export default function Login({ onChangeFlow }: LoginProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      mobile: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (payload: { mobile: string; password: string }) => {
      const { data } = await apiClient.post('/store/login', payload);
      return data;
    },
    onSuccess: () => {
      router.push('/dashboard');
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="p-8 bg-white shadow rounded-xl w-full max-w-sm">
      <div className="flex flex-col items-center space-y-3 pt-6 mb-6">
        <div className="p-3 rounded-full bg-bg-primary text-primary">
          <IoLogIn size={30} />
        </div>
        <h2 className="text-xl font-semibold text-black">Login or Signup</h2>
        <p className="text-sm text-gray text-center">
          Enabling Pharmacies Since 2025
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-w-md mx-auto "
      >
        <Input
          label="Mobile Number"
          type="number"
          placeholder="Phone number"
          className=""
          error={errors.mobile?.message}
          {...register('mobile')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register('password')}
        />
        <div className="text-right" onClick={() => onChangeFlow('register')}>
          <a href="#" className="text-sm text-gray hover:underline">
            Don&apos;t have an account? Signup
          </a>
        </div>

        <Button type="submit" variant="default" className="w-full mt-4">
          Get Started
        </Button>
      </form>
    </div>
  );
}
