import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string | undefined;
  rows?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, rows = 4, ...props }, ref) => {
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

        <textarea
          ref={ref}
          rows={rows}
          className={cn(
            'w-full min-h-[96px] rounded-md border border-border bg-bgLight px-3 py-2 text-sm text-darkStrong',
            'placeholder:text-grayLight focus-visible:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-danger focus-visible:ring-danger',
            className,
          )}
          style={{ boxShadow: 'inset 3px 3px 4px 1px rgba(0, 0, 0, 0.04)' }}
          {...props}
        />

        {error && <span className="text-xs text-danger">{error}</span>}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export { Textarea };
