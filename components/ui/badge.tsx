import { cn } from '@/lib/utils';

export function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return <span className={cn('inline-flex items-center rounded-full bg-sage-100 px-3 py-1 text-xs font-semibold text-sage-800 dark:bg-sage-400/15 dark:text-sage-100', className)}>{children}</span>;
}
