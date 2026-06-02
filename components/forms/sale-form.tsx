'use client';

import { useEffect, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { formatCurrency } from '@/lib/currency';
import { fileToDataUrl, toInputDate } from '@/lib/utils';
import { useBusinessData } from '@/hooks/use-business';

export function SaleForm({ onDone }: { onDone?: () => void }) {
  const { products, addSale } = useBusinessData();
  const firstProduct = products[0];
  const [productId, setProductId] = useState(firstProduct?.id || '');
  const [locationName, setLocationName] = useState('Toko utama');
  const [productionQty, setProductionQty] = useState(0);
  const [soldQty, setSoldQty] = useState(1);
  const [unitPrice, setUnitPrice] = useState(firstProduct?.sellingPrice || 0);
  const [soldAt, setSoldAt] = useState(toInputDate());
  const [proofUrl, setProofUrl] = useState<string | undefined>();
  const product = products.find((item) => item.id === productId);

  useEffect(() => {
    const selected = products.find((item) => item.id === productId);
    if (selected) setUnitPrice(selected.sellingPrice);
  }, [productId, products]);

  const revenue = soldQty * unitPrice;
  const cost = soldQty * (product?.costPrice || 0);
  const profit = revenue - cost;
  const remaining = Math.max(productionQty - soldQty, 0);

  async function onUpload(file?: File) {
    if (!file) return;
    setProofUrl(await fileToDataUrl(file));
  }

  function submit() {
    if (!productId || soldQty <= 0) return;
    addSale({ productId, locationName, productionQty, soldQty, unitPrice, proofUrl, soldAt: new Date(soldAt).toISOString() });
    onDone?.();
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Select value={productId} onChange={(e) => setProductId(e.target.value)}>{products.map((item) => <option key={item.id} value={item.id}>{item.name} — stok {item.stock}</option>)}</Select>
        <Input value={locationName} onChange={(e) => setLocationName(e.target.value)} placeholder="Lokasi penjualan" />
        <Input type="number" value={productionQty} onChange={(e) => setProductionQty(Number(e.target.value))} placeholder="Input produksi" />
        <Input type="number" value={soldQty} onChange={(e) => setSoldQty(Number(e.target.value))} placeholder="Jumlah terjual" />
        <Input type="number" value={unitPrice} onChange={(e) => setUnitPrice(Number(e.target.value))} placeholder="Harga lokasi" />
        <Input type="date" value={soldAt} onChange={(e) => setSoldAt(e.target.value)} />
      </div>
      <label className="flex h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-sage-300 bg-white/60 text-sm font-semibold text-sage-700 dark:border-white/10 dark:bg-white/10 dark:text-sage-100">
        <UploadCloud className="h-5 w-5" /> Upload bukti transaksi
        <input className="hidden" type="file" accept="image/*" onChange={(e) => onUpload(e.target.files?.[0])} />
      </label>
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="rounded-2xl bg-white/70 p-3 dark:bg-white/10"><p className="text-xs text-slate-500">Omzet</p><p className="font-semibold">{formatCurrency(revenue)}</p></div>
        <div className="rounded-2xl bg-white/70 p-3 dark:bg-white/10"><p className="text-xs text-slate-500">Modal barang</p><p className="font-semibold">{formatCurrency(cost)}</p></div>
        <div className="rounded-2xl bg-white/70 p-3 dark:bg-white/10"><p className="text-xs text-slate-500">Laba</p><p className="font-semibold">{formatCurrency(profit)}</p></div>
        <div className="rounded-2xl bg-white/70 p-3 dark:bg-white/10"><p className="text-xs text-slate-500">Sisa produksi</p><p className="font-semibold">{remaining}</p></div>
      </div>
      <Button className="w-full" onClick={submit}>Simpan penjualan</Button>
    </div>
  );
}
