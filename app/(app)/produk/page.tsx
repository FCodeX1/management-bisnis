'use client';

import { useMemo, useState } from 'react';
import { Barcode, Package, Plus, Search, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { ProductForm } from '@/components/forms/product-form';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useBusinessData } from '@/hooks/use-business';
import { formatCurrency } from '@/lib/currency';

export default function ProductsPage() {
  const { products, deleteProduct } = useBusinessData();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const filtered = useMemo(() => products.filter((item) => `${item.name} ${item.sku} ${item.category}`.toLowerCase().includes(search.toLowerCase())), [products, search]);
  return (
    <div>
      <PageHeader title="Sistem Produk" description="Master produk, SKU otomatis, barcode, harga modal, harga jual, margin, stok, dan warning minimum." action={
        <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button><Plus className="h-4 w-4" /> Tambah produk</Button></DialogTrigger><DialogContent><DialogHeader title="Tambah produk" description="SKU dan margin dihitung otomatis." /><ProductForm onDone={() => setOpen(false)} /></DialogContent></Dialog>
      } />
      <Card className="mb-5"><div className="flex items-center gap-3"><Search className="h-4 w-4 text-slate-400" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari produk, SKU, kategori..." /></div></Card>
      {filtered.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map((product) => {
        const margin = product.sellingPrice ? ((product.sellingPrice - product.costPrice) / product.sellingPrice) * 100 : 0;
        return <Card key={product.id} className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage-100 text-sage-700 dark:bg-sage-400/15 dark:text-sage-100"><Package className="h-5 w-5" /></div><div><h3 className="font-semibold">{product.name}</h3><p className="text-xs text-slate-500">{product.sku}</p></div></div>
            <Button variant="ghost" size="icon" onClick={() => deleteProduct(product.id)}><Trash2 className="h-4 w-4" /></Button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-2xl bg-white/60 p-3 dark:bg-white/10"><p className="text-xs text-slate-500">Modal</p><p className="font-semibold">{formatCurrency(product.costPrice)}</p></div>
            <div className="rounded-2xl bg-white/60 p-3 dark:bg-white/10"><p className="text-xs text-slate-500">Jual</p><p className="font-semibold">{formatCurrency(product.sellingPrice)}</p></div>
            <div className="rounded-2xl bg-white/60 p-3 dark:bg-white/10"><p className="text-xs text-slate-500">Stok</p><p className="font-semibold">{product.stock} {product.baseUnit}</p></div>
            <div className="rounded-2xl bg-white/60 p-3 dark:bg-white/10"><p className="text-xs text-slate-500">Margin</p><p className="font-semibold">{margin.toFixed(1)}%</p></div>
          </div>
          <div className="mt-3 flex items-center justify-between"><Badge>{product.category}</Badge><span className="flex items-center gap-1 text-xs text-slate-500"><Barcode className="h-3 w-3" /> {product.barcode || 'No barcode'}</span></div>
        </Card>;
      })}</div> : <EmptyState icon={Package} title="Belum ada produk" description="Tambahkan produk agar stok, penjualan, dan laba bisa dihitung." />}
    </div>
  );
}
