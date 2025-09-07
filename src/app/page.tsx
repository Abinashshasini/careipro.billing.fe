'use client';
import Login from '@/components/auth/login';
import Register from '@/components/auth/register';
import { useState } from 'react';

type AuthFlow = 'login' | 'register';

export default function ColorDemo() {
  const [flow, setFlow] = useState<AuthFlow>('login');

  const handleChangeFlow = (_flow: AuthFlow) => setFlow(_flow);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-light to-white relative">
      {flow === 'login' ? (
        <Login onChangeFlow={handleChangeFlow} />
      ) : (
        <Register onChangeFlow={handleChangeFlow} />
      )}
    </div>
  );
}
