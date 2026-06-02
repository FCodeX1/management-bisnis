'use client';

import { LineChart } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { CapitalSalesChart, SalesAreaChart } from '@/components/dashboard/chart-card';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBusinessData } from '@/hooks/use-business';
import { buildCapitalVsSales, buildDailySales, generateRuleBasedInsights, getBusinessMetrics } from '@/lib/analytics';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/currency';

export default function AnalyticsPage() {
  const { business, products, capitals, sales } = useBusinessData();
  const metrics = getBusinessMetrics({ business, products, capitals, sales });
  const insights = generateRuleBasedInsights(metrics, products);
  const bestLocations = Object.values(sales.reduce<Record<string, { name: string; revenue: number; profit: number }>>((acc, sale) => {
    acc[sale.locationName] = acc[sale.locationName] || { name: sale.locationName, revenue: 0, profit: 0 };
    acc[sale.locationName].revenue += sale.revenue;
    acc[sale.locationName].profit += sale.profit;
    return acc;
  }, {})).sort((a, b) => b.profit - a.profit);

  return (
    <div>
      <PageHeader title="Analitik Canggih" description="Grafik profit, modal vs penjualan, produk menguntungkan, lokasi terbaik, dan prediksi stok berbasis rule lokal." />
      <div className="grid gap-5 xl:grid-cols-2"><SalesAreaChart data={buildDailySales(sales)} /><CapitalSalesChart data={buildCapitalVsSales(capitals, sales)} /></div>
      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Card><CardHeader><div><CardTitle>Lokasi penjualan terbaik</CardTitle><CardDescription>Diurutkan berdasarkan profit.</CardDescription></div><LineChart className="h-5 w-5 text-sage-700" /></CardHeader><div className="space-y-3">{bestLocations.map((loc) => <div key={loc.name} className="flex items-center justify-between rounded-2xl bg-white/60 p-3 dark:bg-white/10"><div><p className="font-medium">{loc.name}</p><p className="text-xs text-slate-500">Omzet {formatCurrency(loc.revenue)}</p></div><Badge>{formatCurrency(loc.profit)}</Badge></div>)}</div></Card>
        <Card><CardHeader><div><CardTitle>Forecast & insight</CardTitle><CardDescription>Belum memakai AI agent; ini rekomendasi otomatis dari data transaksi.</CardDescription></div></CardHeader><div className="space-y-3">{insights.map((item) => <div key={item} className="rounded-2xl bg-sage-50 p-4 text-sm text-sage-900 dark:bg-sage-400/10 dark:text-sage-100">{item}</div>)}</div></Card>
      </div>
    </div>
  );
}
