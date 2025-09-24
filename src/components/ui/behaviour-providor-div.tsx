'use client';
import React, { useState, ReactNode, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface BehaviourProvidorDivProps {
  children: ReactNode;
  className?: string;
  error?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const BehaviourProvidorDiv: React.FC<BehaviourProvidorDivProps> = ({
  children,
  className,
  error = false,
  disabled = false,
  onClick,
}) => {
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close focus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFocus = () => {
    if (!disabled) setFocused(true);
    if (onClick) onClick();
  };

  return (
    <div
      ref={ref}
      onClick={handleFocus}
      className={cn(
        'rounded-md border bg-bgLight transition-all duration-150 h-10',
        focused ? 'border-primary ring-1  ring-primary' : 'border-input-border',
        error && 'border-danger ring-1 ring-danger',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      {children}
    </div>
  );
};
