import { LucideIcon } from 'lucide-react';
import { Button } from './button';

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: { icon: LucideIcon; title: string; description: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-sage-200 bg-white/55 p-8 text-center dark:border-white/10 dark:bg-white/[0.04]">
      <div className="mb-4 rounded-3xl bg-sage-100 p-4 text-sage-700 dark:bg-sage-400/15 dark:text-sage-100">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
      {actionLabel && onAction ? <Button className="mt-5" onClick={onAction}>{actionLabel}</Button> : null}
    </div>
  );
}
