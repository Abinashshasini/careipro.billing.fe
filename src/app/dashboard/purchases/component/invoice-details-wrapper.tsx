'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react';

const InvoiceDetailsWrapper = () => {
  const router = useRouter();
  return (
    <div>
      <Button onClick={() => router.push('purchases/add-purchase')}>
        Add Purchase
      </Button>
    </div>
  );
};

export default InvoiceDetailsWrapper;
