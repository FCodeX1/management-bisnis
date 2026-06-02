import * as React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn('h-11 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-sage-400 focus:ring-4 focus:ring-sage-200/50 dark:border-white/10 dark:bg-white/10 dark:text-white', className)}
    {...props}
  />
));
Input.displayName = 'Input';
