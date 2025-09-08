import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input } from './input';

export interface SearchBarProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, label, icon, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label
            htmlFor={props.id}
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <div className="relative w-full">
          {icon && (
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              {icon}
            </span>
          )}
          <Input
            ref={ref}
            className={cn(icon ? 'pl-10' : '', className)}
            {...props}
          />
        </div>
      </div>
    );
  },
);

SearchBar.displayName = 'SearchBar';

export { SearchBar };
