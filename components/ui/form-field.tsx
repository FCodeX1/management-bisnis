import * as React from 'react';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function FormField({ label, description, error, required, className, children }: FormFieldProps) {
  return (
    <div className={cn('block space-y-2', className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          {label} {required ? <span className="text-red-500">*</span> : null}
        </span>
      </div>
      {children}
      {description ? <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{description}</p> : null}
      {error ? <p className="text-xs font-medium text-red-500">{error}</p> : null}
    </div>
  );
}

export function FormSection({ title, description, children, className }: { title: string; description?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn('rounded-3xl border border-slate-200/80 bg-white/55 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]', className)}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
        {description ? <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
