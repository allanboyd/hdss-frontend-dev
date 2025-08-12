'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, ...props }, ref) => {
    return (
      <div className='flex items-start space-x-3'>
        <input
          type='checkbox'
          className={cn(
            'h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500 focus:ring-offset-0',
            className
          )}
          ref={ref}
          {...props}
        />
        {(label || description) && (
          <div className='flex flex-col'>
            {label && (
              <label className='text-sm font-medium text-gray-900 cursor-pointer'>
                {label}
              </label>
            )}
            {description && (
              <p className='text-sm text-gray-500 mt-1'>{description}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
