'use client';

import { useEffect, useState } from 'react';
import { Boxes, Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FormField } from '@/components/ui/form-field';
import { EmptyState } from '@/components/ui/empty-state';
import { useBusinessData } from '@/hooks/use-business';
import { formatDate } from '@/lib/utils';

export default function StockPage() {
  const { products, stockMovements, adjustStock } = useBusinessData();
  const [productId, setProductId] = useState(products[0]?.id || '');
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState('Adjustment manual');

  useEffect(() => {
    if (!productId && products[0]) setProductId(products[0].id);
  }, [productId, products]);

  function saveAdjustment(mode: 'plus' | 'minus') {
    if (!productId) {
      toast.error('Pilih produk terlebih dahulu');
      return;
    }
    if (qty <= 0) {
      toast.error('Qty harus lebih dari 0');
      return;
    }
    adjustStock(productId, mode === 'plus' ? Math.abs(qty) : -Math.abs(qty), note || 'Adjustment manual');
  }

  return (
    <div>
      <PageHeader title="Stok" description="Pantau stok realtime, minimum stock warning, dan riwayat pergerakan stok." />
      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <h3 className="mb-1 font-semibold">Adjustment stok</h3>
          <p className="mb-4 text-sm text-slate-500">Gunakan untuk koreksi stok karena restock, barang rusak, opname, atau selisih penjualan.</p>
          {products.length ? (
            <div className="space-y-4">
              <FormField label="Produk" required description="Stok produk yang dipilih akan bertambah atau berkurang.">
                <Select value={productId} onChange={(e) => setProductId(e.target.value)}>{products.map((item) => <option key={item.id} value={item.id}>{item.name} — stok {item.stock}</option>)}</Select>
              </FormField>
              <FormField label="Qty adjustment" required description="Isi angka positif. Tombol Tambah/Kurangi yang menentukan arah stok.">
                <Input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} placeholder="Qty" />
              </FormField>
              <FormField label="Catatan" description="Contoh: Restock supplier, stok opname, barang rusak.">
                <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Catatan" />
              </FormField>
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => saveAdjustment('plus')}><Plus className="h-4 w-4" /> Tambah</Button>
                <Button variant="secondary" onClick={() => saveAdjustment('minus')}><Minus className="h-4 w-4" /> Kurangi</Button>
              </div>
            </div>
          ) : <EmptyState icon={Boxes} title="Belum ada produk" description="Tambahkan produk terlebih dahulu agar stok bisa disesuaikan." />}
        </Card>
        <Card>
          <h3 className="mb-1 font-semibold">Ringkasan produk</h3>
          <p className="mb-4 text-sm text-slate-500">Produk dengan stok di bawah minimum akan diberi tanda peringatan.</p>
          <div className="space-y-3">{products.map((product) => <div key={product.id} className="flex items-center justify-between rounded-2xl bg-white/60 p-3 dark:bg-white/10"><div className="flex items-center gap-3"><div className="rounded-xl bg-sage-100 p-2 text-sage-700 dark:bg-sage-400/15 dark:text-sage-100"><Boxes className="h-4 w-4" /></div><div><p className="font-medium">{product.name}</p><p className="text-xs text-slate-500">Minimum {product.minStock} {product.baseUnit}</p></div></div><Badge className={product.stock <= product.minStock ? 'bg-amber-100 text-amber-800' : ''}>{product.stock} {product.baseUnit}</Badge></div>)}</div>
        </Card>
      </div>
      <Card className="mt-5">
        <h3 className="mb-1 font-semibold">Riwayat stok</h3>
        <p className="mb-4 text-sm text-slate-500">Audit sederhana dari transaksi penjualan dan adjustment manual.</p>
        <div className="space-y-2">{stockMovements.map((movement) => { const product = products.find((item) => item.id === movement.productId); return <div key={movement.id} className="flex items-center justify-between rounded-2xl bg-white/60 p-3 text-sm dark:bg-white/10"><div><p className="font-medium">{product?.name || 'Produk'}</p><p className="text-xs text-slate-500">{movement.note || movement.type} • {formatDate(movement.createdAt)}</p></div><Badge>{movement.qty > 0 ? '+' : ''}{movement.qty}</Badge></div>; })}</div>
      </Card>
    </div>
  );
}
