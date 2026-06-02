'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Building2, MapPin, Package, Pencil, Plus, ShoppingBag, Store, WalletCards } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { MetricCard } from '@/components/dashboard/metric-card';
import { BusinessForm } from '@/components/forms/business-form';
import { StoreForm } from '@/components/forms/store-form';
import { useAppStore } from '@/store/app-store';
import { getBusinessMetrics } from '@/lib/analytics';
import { formatCurrency } from '@/lib/currency';

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-2xl bg-white/60 p-3 dark:bg-white/10">
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{value || '-'}</p>
    </div>
  );
}

export default function BusinessDetailPage() {
  const params = useParams<{ id: string }>();
  const state = useAppStore();
  const [editOpen, setEditOpen] = useState(false);
  const [storeOpen, setStoreOpen] = useState(false);
  const business = state.businesses.find((item) => item.id === params.id && !item.deletedAt);
  const products = state.products.filter((item) => item.businessId === params.id && !item.deletedAt);
  const capitals = state.capitals.filter((item) => item.businessId === params.id && !item.deletedAt);
  const sales = state.sales.filter((item) => item.businessId === params.id && !item.deletedAt);
  const locations = state.locations.filter((item) => item.businessId === params.id && !item.deletedAt);
  const metrics = useMemo(() => getBusinessMetrics({ business, products, capitals, sales }), [business, products, capitals, sales]);

  if (!business) return <PageHeader title="Bisnis tidak ditemukan" description="Data mungkin sudah dihapus atau bukan bagian dari akun aktif." />;

  return (
    <div>
      <PageHeader
        title={business.name}
        description={business.description || 'Detail profil, toko, dan performa bisnis.'}
        action={
          <div className="flex flex-wrap gap-2">
            <Dialog open={storeOpen} onOpenChange={setStoreOpen}>
              <DialogTrigger asChild><Button variant="secondary"><Plus className="h-4 w-4" /> Tambah toko</Button></DialogTrigger>
              <DialogContent><DialogHeader title="Tambah toko untuk bisnis ini" description="Toko baru akan langsung masuk ke bisnis ini." /><StoreForm businessId={business.id} onDone={() => setStoreOpen(false)} /></DialogContent>
            </Dialog>
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild><Button><Pencil className="h-4 w-4" /> Edit bisnis</Button></DialogTrigger>
              <DialogContent><DialogHeader title="Edit detail bisnis" description="Rapihkan identitas bisnis untuk laporan dan dashboard." /><BusinessForm initialData={business} onDone={() => setEditOpen(false)} /></DialogContent>
            </Dialog>
          </div>
        }
      />

      <Card className="mb-5">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-sage-100 text-sage-700 dark:bg-sage-400/15 dark:text-sage-100">
              {business.logoUrl ? <Image src={business.logoUrl} alt={business.name} fill className="object-cover" unoptimized /> : <Building2 className="h-7 w-7" />}
            </div>
            <div>
              <p className="font-semibold">{business.category}</p>
              <p className="text-sm text-slate-500">{business.address || 'Alamat belum diisi'} • {business.currency}</p>
            </div>
          </div>
          <Badge>{locations.filter((item) => item.isActive !== false).length} toko aktif</Badge>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <DetailRow label="Nama bisnis" value={business.name} />
          <DetailRow label="Kategori" value={business.category} />
          <DetailRow label="Mata uang" value={business.currency} />
          <DetailRow label="Alamat utama" value={business.address} />
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Penjualan" value={formatCurrency(metrics.totalSales)} icon={ShoppingBag} />
        <MetricCard title="Modal" value={formatCurrency(metrics.totalCapital)} icon={WalletCards} />
        <MetricCard title="Produk" value={`${products.length}`} icon={Package} />
        <MetricCard title="Profit" value={`${metrics.profitPercentage.toFixed(1)}%`} icon={ShoppingBag} />
      </div>

      <Card className="mt-5">
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-semibold">Toko/lokasi bisnis</h3>
            <p className="text-sm text-slate-500">Outlet, marketplace, reseller, atau bazaar yang terhubung ke penjualan.</p>
          </div>
          <Button asChild variant="secondary"><Link href="/toko"><Store className="h-4 w-4" /> Kelola toko</Link></Button>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {locations.length ? locations.map((location) => (
            <div key={location.id} className="rounded-2xl bg-white/60 p-4 dark:bg-white/10">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div><p className="font-semibold">{location.name}</p><p className="text-xs text-slate-500">{location.managerName || 'PIC belum diisi'}</p></div>
                <Badge className={location.isActive !== false ? '' : 'bg-slate-200 text-slate-600'}>{location.isActive !== false ? 'Aktif' : 'Nonaktif'}</Badge>
              </div>
              <p className="flex gap-2 text-sm text-slate-600 dark:text-slate-300"><MapPin className="h-4 w-4 shrink-0 text-sage-700" />{location.address || 'Alamat belum diisi'}</p>
            </div>
          )) : <p className="text-sm text-slate-500">Belum ada toko. Klik “Tambah toko” untuk membuat lokasi penjualan pertama.</p>}
        </div>
      </Card>
    </div>
  );
}
