import { LucideIcon, TrendingDown, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function MetricCard({ title, value, icon: Icon, trend, tone = 'default' }: { title: string; value: string; icon: LucideIcon; trend?: number; tone?: 'default' | 'warning' | 'success' }) {
  const positive = (trend || 0) >= 0;
  return (
    <Card className="overflow-hidden p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
        </div>
        <div className={cn('rounded-2xl p-3 text-sage-700 dark:text-sage-100', tone === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-sage-100 dark:bg-sage-400/15')}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {typeof trend === 'number' ? (
        <div className={cn('mt-4 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold', positive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700')}>
          {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {Math.abs(trend).toFixed(1)}% dari periode sebelumnya
        </div>
      ) : null}
    </Card>
  );
}
