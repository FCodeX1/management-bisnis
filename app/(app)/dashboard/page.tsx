'use client';

import { AlertTriangle, Banknote, Boxes, LineChart, ShoppingBag, WalletCards } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { MetricCard } from '@/components/dashboard/metric-card';
import { CapitalSalesChart, SalesAreaChart } from '@/components/dashboard/chart-card';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBusinessData } from '@/hooks/use-business';
import { buildCapitalVsSales, buildDailySales, generateRuleBasedInsights, getBusinessMetrics } from '@/lib/analytics';
import { formatCurrency } from '@/lib/currency';

export default function DashboardPage() {
  const { business, products, capitals, sales, notifications } = useBusinessData();
  const metrics = getBusinessMetrics({ business, products, capitals, sales });
  const daily = buildDailySales(sales);
  const cash = buildCapitalVsSales(capitals, sales);
  const insights = generateRuleBasedInsights(metrics, products);
  const lowProducts = products.filter((item) => item.stock <= item.minStock);

  return (
    <div>
      <PageHeader title="Dashboard Pintar" description="Pantau penjualan, modal, laba, stok, cashflow, dan insight bisnis secara realtime." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total penjualan" value={formatCurrency(metrics.totalSales)} icon={ShoppingBag} trend={metrics.trendSales} />
        <MetricCard title="Total modal" value={formatCurrency(metrics.totalCapital)} icon={WalletCards} />
        <MetricCard title="Total laba" value={formatCurrency(metrics.totalProfit)} icon={Banknote} trend={metrics.profitPercentage} tone="success" />
        <MetricCard title="Stok rendah" value={`${metrics.lowStockCount} produk`} icon={AlertTriangle} tone="warning" />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <SalesAreaChart data={daily} />
        <Card>
          <CardHeader><div><CardTitle>Business Insight</CardTitle><CardDescription>Rekomendasi rule-based tanpa AI agent.</CardDescription></div><Badge>{metrics.profitPercentage.toFixed(1)}% profit</Badge></CardHeader>
          <div className="space-y-3">
            {insights.map((item) => <div key={item} className="rounded-2xl bg-sage-50 p-4 text-sm text-sage-900 dark:bg-sage-400/10 dark:text-sage-100">{item}</div>)}
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <CapitalSalesChart data={cash} />
        <Card>
          <CardHeader><div><CardTitle>Ringkasan stok</CardTitle><CardDescription>Nilai stok: {formatCurrency(metrics.stockValue)}</CardDescription></div><Boxes className="h-5 w-5 text-sage-700" /></CardHeader>
          <div className="space-y-3">
            {lowProducts.length ? lowProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between rounded-2xl bg-white/70 p-3 dark:bg-white/10">
                <div><p className="font-medium">{product.name}</p><p className="text-xs text-slate-500">Min. {product.minStock} {product.baseUnit}</p></div>
                <Badge className="bg-amber-100 text-amber-800">Stok {product.stock}</Badge>
              </div>
            )) : <p className="text-sm text-slate-500">Semua stok aman.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}
