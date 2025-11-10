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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const divElement = ref.current;
    if (!divElement) return;

    const handleChildFocus = (event: FocusEvent) => {
      if (divElement.contains(event.target as Node)) {
        if (!disabled) setFocused(true);
      }
    };

    const handleChildBlur = (event: FocusEvent) => {
      if (!divElement.contains(event.relatedTarget as Node)) {
        setFocused(false);
      }
    };

    document.addEventListener('focusin', handleChildFocus);
    document.addEventListener('focusout', handleChildBlur);

    return () => {
      document.removeEventListener('focusin', handleChildFocus);
      document.removeEventListener('focusout', handleChildBlur);
    };
  }, [disabled]);

  const handleFocus = () => {
    if (!disabled) setFocused(true);
    if (onClick) onClick();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !disabled) {
      handleFocus();
    }
  };

  return (
    <div
      ref={ref}
      onClick={handleFocus}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      className={cn(
        'border bg-bgLight transition-all duration-150 h-10 relative',
        focused ? 'border-primary ring-1  ring-primary' : 'border-input-border',
        error && 'border-danger ring-1 ring-danger',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
      style={{ boxShadow: 'inset 3px 3px 4px 1px rgba(0, 0, 0, 0.04)' }}
    >
      {children}
    </div>
  );
};
