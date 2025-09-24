'use client';
import React, { useState, ReactNode, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SelectProps {
  value: string;
  placeholder?: string;
  icon?: ReactNode; // right side icon
  onChange: (val: string) => void;
  searchable?: boolean;
  children: (props: {
    searchTerm: string;
    setValue: (val: string) => void;
    close: () => void;
  }) => ReactNode;
  className?: string;
  error?: string;
  disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  value,
  placeholder = 'Select...',
  icon,
  onChange,
  searchable = false,
  children,
  error,
  className,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
    setSearchTerm('');
    setFocused(false);
  };

  // close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
        setFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // handle focus when dropdown opens
  const handleOpen = () => {
    if (disabled) return;
    setOpen(!open);
    setFocused(true);
    if (searchable && !open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  return (
    <div className="relative w-full" ref={ref}>
      {/* Trigger */}
      <div
        onClick={handleOpen}
        className={cn(
          'h-10 rounded-md border bg-bgLight pl-3 pr-6 py-2 text-sm text-darkStrong relative cursor-pointer',
          disabled && 'cursor-not-allowed opacity-50',
          focused ? 'border-primary ring-1' : 'border-input-border',
          error && 'border-danger ring-1 ring-danger',
          className,
        )}
        style={{ boxShadow: 'inset 3px 3px 4px 1px rgba(0, 0, 0, 0.04)' }}
      >
        <span className={cn(value ? 'text-gray-900' : 'text-gray-400')}>
          {value || placeholder}
        </span>
        {icon && <span className="ml-2 absolute right-2">{icon}</span>}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-10 mt-1 w-full rounded-lg bg-white shadow-lg light-border">
          {searchable && (
            <input
              ref={inputRef}
              type="text"
              className="w-full border-b border-gray-200 px-3 py-2 text-sm focus:outline-none"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
          )}

          <div className="max-h-60 overflow-auto">
            {children({
              searchTerm,
              setValue: handleSelect,
              close: () => {
                setOpen(false);
                setFocused(false);
              },
            })}
          </div>
        </div>
      )}
    </div>
  );
};
