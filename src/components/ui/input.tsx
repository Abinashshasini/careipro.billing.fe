import * as React from 'react';
import { cn } from '@/lib/utils';
import { FaEye } from 'react-icons/fa';
import { FaEyeSlash } from 'react-icons/fa6';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

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
          <input
            ref={ref}
            type={inputType}
            className={cn(
              'flex h-10 w-full rounded-md border border-input-border bg-bgLight px-3 py-2 text-sm text-darkStrong',
              'placeholder:text-grayLight focus-visible:outline-none focus-visible:ring-0 focus-visible:border-primary focus-visible:border-2',
              'hover:border-primary hover:border-1',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-danger focus-visible:border-danger',
              className,
            )}
            style={{ boxShadow: 'inset 3px 3px 4px 1px rgba(0, 0, 0, 0.04)' }}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          )}
        </div>

        {error && <span className="text-xs text-danger">{error}</span>}
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
