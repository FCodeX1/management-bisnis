'use client';

import { useState } from 'react';
import { Boxes, Minus, Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useBusinessData } from '@/hooks/use-business';
import { formatDate } from '@/lib/utils';

export default function StockPage() {
  const { products, stockMovements, adjustStock } = useBusinessData();
  const [productId, setProductId] = useState(products[0]?.id || '');
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState('Adjustment manual');
  return (
    <div>
      <PageHeader title="Stok" description="Pantau stok realtime, minimum stock warning, dan riwayat pergerakan stok." />
      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <h3 className="mb-4 font-semibold">Adjustment stok</h3>
          <div className="space-y-3">
            <Select value={productId} onChange={(e) => setProductId(e.target.value)}>{products.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</Select>
            <Input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} placeholder="Qty" />
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Catatan" />
            <div className="grid grid-cols-2 gap-2"><Button onClick={() => adjustStock(productId, Math.abs(qty), note)}><Plus className="h-4 w-4" /> Tambah</Button><Button variant="secondary" onClick={() => adjustStock(productId, -Math.abs(qty), note)}><Minus className="h-4 w-4" /> Kurangi</Button></div>
          </div>
        </Card>
        <Card>
          <h3 className="mb-4 font-semibold">Ringkasan produk</h3>
          <div className="space-y-3">{products.map((product) => <div key={product.id} className="flex items-center justify-between rounded-2xl bg-white/60 p-3 dark:bg-white/10"><div className="flex items-center gap-3"><div className="rounded-xl bg-sage-100 p-2 text-sage-700 dark:bg-sage-400/15 dark:text-sage-100"><Boxes className="h-4 w-4" /></div><div><p className="font-medium">{product.name}</p><p className="text-xs text-slate-500">Minimum {product.minStock}</p></div></div><Badge className={product.stock <= product.minStock ? 'bg-amber-100 text-amber-800' : ''}>{product.stock} {product.baseUnit}</Badge></div>)}</div>
        </Card>
      </div>
      <Card className="mt-5">
        <h3 className="mb-4 font-semibold">Riwayat stok</h3>
        <div className="space-y-2">{stockMovements.map((movement) => { const product = products.find((item) => item.id === movement.productId); return <div key={movement.id} className="flex items-center justify-between rounded-2xl bg-white/60 p-3 text-sm dark:bg-white/10"><div><p className="font-medium">{product?.name || 'Produk'}</p><p className="text-xs text-slate-500">{movement.note || movement.type} • {formatDate(movement.createdAt)}</p></div><Badge>{movement.qty > 0 ? '+' : ''}{movement.qty}</Badge></div>; })}</div>
      </Card>
    </div>
  );
}
