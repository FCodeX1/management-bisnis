import * as React from 'react';
import { cn } from '@/lib/utils';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn('min-h-24 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sage-400 focus:ring-4 focus:ring-sage-200/50 dark:border-white/10 dark:bg-white/10 dark:text-white', className)}
    {...props}
  />
));
Textarea.displayName = 'Textarea';
