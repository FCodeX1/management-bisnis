'use client';

import { useMemo, useState } from 'react';
import { Plus, Search, ShoppingBag, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { SaleForm } from '@/components/forms/sale-form';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useBusinessData } from '@/hooks/use-business';
import { formatCurrency } from '@/lib/currency';
import { formatDate } from '@/lib/utils';

export default function SalesPage() {
  const { sales, products, deleteSale } = useBusinessData();
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => sales.filter((sale) => {
    const product = products.find((item) => item.id === sale.productId)?.name || '';
    return `${product} ${sale.locationName} ${sale.revenue}`.toLowerCase().includes(search.toLowerCase());
  }), [sales, products, search]);
  return (
    <div>
      <PageHeader title="Manajemen Penjualan" description="Input produksi, lokasi, harga per lokasi, sisa barang, omzet, laba, dan histori penjualan." action={
        <Dialog><DialogTrigger asChild><Button><Plus className="h-4 w-4" /> Tambah penjualan</Button></DialogTrigger><DialogContent><DialogHeader title="Tambah penjualan" description="Omzet, laba, dan stok dihitung otomatis." /><SaleForm /></DialogContent></Dialog>
      } />
      <Card className="mb-5"><div className="flex items-center gap-3"><Search className="h-4 w-4 text-slate-400" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari lokasi, produk, omzet..." /></div></Card>
      {filtered.length ? <div className="space-y-3">{filtered.map((sale) => {
        const product = products.find((item) => item.id === sale.productId);
        return <Card key={sale.id} className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div><div className="flex items-center gap-2"><h3 className="font-semibold">{product?.name || 'Produk'}</h3><Badge>{sale.locationName}</Badge></div><p className="mt-1 text-sm text-slate-500">{formatDate(sale.soldAt)} • Terjual {sale.soldQty} • Sisa produksi {sale.remainingQty}</p></div>
            <div className="flex items-center justify-between gap-3"><div className="text-right"><p className="text-lg font-semibold">{formatCurrency(sale.revenue)}</p><p className="text-xs text-emerald-600">Laba {formatCurrency(sale.profit)}</p></div><Button variant="ghost" size="icon" onClick={() => deleteSale(sale.id)}><Trash2 className="h-4 w-4" /></Button></div>
          </div>
        </Card>;
      })}</div> : <EmptyState icon={ShoppingBag} title="Belum ada penjualan" description="Catat transaksi pertama agar dashboard dan analitik mulai hidup." />}
    </div>
  );
}
