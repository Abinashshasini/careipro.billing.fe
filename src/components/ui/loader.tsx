import * as React from 'react';
import { cn } from '@/lib/utils';

interface LoaderProps {
  size?: number;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = 24, className }) => {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-primary',
        className,
      )}
      style={{
        width: size,
        height: size,
        borderTopColor: 'currentColor',
      }}
    />
  );
};
