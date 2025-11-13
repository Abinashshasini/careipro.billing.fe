import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface SuccessProps {
  text: string;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  iconSize?: {
    width: number;
    height: number;
  };
  subtitle?: string;
  subtitleClassName?: string;
}

export default function Success({
  text,
  className,
  iconClassName,
  textClassName,
  iconSize = { width: 80, height: 80 },
  subtitle,
  subtitleClassName,
}: SuccessProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center',
        className,
      )}
    >
      {/* Success Icon */}
      <div className={cn('mb-6 animate-zoom-in', iconClassName)}>
        <Image
          src="/assets/success.svg"
          alt="Success"
          width={iconSize.width}
          height={iconSize.height}
          className="object-contain"
        />
      </div>

      {/* Main Text */}
      <h2
        className={cn(
          'text-xl font-semibold text-gray-800 mb-2',
          textClassName,
        )}
      >
        {text}
      </h2>

      {/* Subtitle (optional) */}
      {subtitle && (
        <p className={cn('text-sm text-gray-600 max-w-md', subtitleClassName)}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
