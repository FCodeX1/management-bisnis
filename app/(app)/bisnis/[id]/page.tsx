'use client';

import { useParams } from 'next/navigation';
import { Building2, Package, ShoppingBag, WalletCards } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { MetricCard } from '@/components/dashboard/metric-card';
import { useAppStore } from '@/store/app-store';
import { getBusinessMetrics } from '@/lib/analytics';
import { formatCurrency } from '@/lib/currency';

export default function BusinessDetailPage() {
  const params = useParams<{ id: string }>();
  const state = useAppStore();
  const business = state.businesses.find((item) => item.id === params.id);
  const products = state.products.filter((item) => item.businessId === params.id && !item.deletedAt);
  const capitals = state.capitals.filter((item) => item.businessId === params.id && !item.deletedAt);
  const sales = state.sales.filter((item) => item.businessId === params.id && !item.deletedAt);
  const metrics = getBusinessMetrics({ business, products, capitals, sales });
  if (!business) return <PageHeader title="Bisnis tidak ditemukan" />;

  return (
    <div>
      <PageHeader title={business.name} description={business.description || 'Detail profil dan performa bisnis.'} />
      <Card className="mb-5">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-sage-100 text-sage-700 dark:bg-sage-400/15 dark:text-sage-100"><Building2 className="h-7 w-7" /></div>
          <div><p className="font-semibold">{business.category}</p><p className="text-sm text-slate-500">{business.address || 'Alamat belum diisi'} • {business.currency}</p></div>
        </div>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Penjualan" value={formatCurrency(metrics.totalSales)} icon={ShoppingBag} />
        <MetricCard title="Modal" value={formatCurrency(metrics.totalCapital)} icon={WalletCards} />
        <MetricCard title="Produk" value={`${products.length}`} icon={Package} />
        <MetricCard title="Profit" value={`${metrics.profitPercentage.toFixed(1)}%`} icon={ShoppingBag} />
      </div>
    </div>
  );
}
