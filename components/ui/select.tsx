import * as React from 'react';
import { cn } from '@/lib/utils';

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn('h-11 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 text-sm outline-none transition focus:border-sage-400 focus:ring-4 focus:ring-sage-200/50 dark:border-white/10 dark:bg-white/10 dark:text-white', className)}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = 'Select';
