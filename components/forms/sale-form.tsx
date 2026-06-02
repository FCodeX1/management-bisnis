'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { FileDropzone } from '@/components/ui/file-dropzone';
import { FormField, FormSection } from '@/components/ui/form-field';
import { formatCurrency } from '@/lib/currency';
import { fileToDataUrl, toInputDate } from '@/lib/utils';
import { useBusinessData } from '@/hooks/use-business';

export function SaleForm({ onDone }: { onDone?: () => void }) {
  const { products, locations, addSale } = useBusinessData();
  const activeLocations = useMemo(() => locations.filter((item) => item.isActive !== false && !item.deletedAt), [locations]);
  const firstProduct = products[0];
  const firstLocation = activeLocations[0];
  const [productId, setProductId] = useState(firstProduct?.id || '');
  const [locationId, setLocationId] = useState(firstLocation?.id || '');
  const [manualLocationName, setManualLocationName] = useState(firstLocation?.name || 'Toko utama');
  const [productionQty, setProductionQty] = useState(0);
  const [soldQty, setSoldQty] = useState(1);
  const [unitPrice, setUnitPrice] = useState(firstProduct?.sellingPrice || 0);
  const [soldAt, setSoldAt] = useState(toInputDate());
  const [proofUrl, setProofUrl] = useState<string | undefined>();
  const product = products.find((item) => item.id === productId);
  const selectedLocation = activeLocations.find((item) => item.id === locationId);

  useEffect(() => {
    const selected = products.find((item) => item.id === productId);
    if (selected) setUnitPrice(selected.sellingPrice);
  }, [productId, products]);

  useEffect(() => {
    if (selectedLocation) setManualLocationName(selectedLocation.name);
  }, [selectedLocation]);

  const revenue = Math.max(0, Number(soldQty || 0)) * Math.max(0, Number(unitPrice || 0));
  const cost = Math.max(0, Number(soldQty || 0)) * (product?.costPrice || 0);
  const profit = revenue - cost;
  const remaining = Math.max(Number(productionQty || 0) - Number(soldQty || 0), 0);
  const availableStock = (product?.stock || 0) + Number(productionQty || 0);

  async function onUpload(file?: File) {
    if (!file) return;
    setProofUrl(await fileToDataUrl(file));
  }

  function submit() {
    if (!products.length) { toast.error('Tambahkan produk dulu sebelum mencatat penjualan'); return; }
    if (!productId) { toast.error('Produk wajib dipilih'); return; }
    if (!manualLocationName.trim()) { toast.error('Nama toko/lokasi wajib diisi'); return; }
    if (soldQty <= 0) { toast.error('Jumlah terjual minimal 1'); return; }
    if (soldQty > availableStock) { toast.error(`Stok tidak cukup. Maksimal terjual ${availableStock}`); return; }

    addSale({
      productId,
      locationId: selectedLocation?.id,
      locationName: manualLocationName.trim(),
      productionQty: Math.max(0, Number(productionQty || 0)),
      soldQty: Math.max(0, Number(soldQty || 0)),
      unitPrice: Math.max(0, Number(unitPrice || 0)),
      proofUrl,
      soldAt: new Date(soldAt).toISOString()
    });
    onDone?.();
  }

  if (!products.length) {
    return (
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-100">
        Belum ada produk. Tambahkan produk terlebih dahulu agar penjualan bisa menghitung stok, omzet, dan laba dengan benar.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <FormSection title="Transaksi penjualan" description="Pilih produk dan toko/lokasi. Omzet, laba, dan sisa barang otomatis dihitung.">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Produk" required description="Menentukan harga modal dan stok yang akan dikurangi.">
            <Select value={productId} onChange={(e) => setProductId(e.target.value)}>
              {products.map((item) => <option key={item.id} value={item.id}>{item.name} — stok {item.stock}</option>)}
            </Select>
          </FormField>
          <FormField label="Toko/lokasi" required description="Ambil dari master toko. Pilih Manual jika belum didaftarkan.">
            <Select value={locationId || 'manual'} onChange={(e) => setLocationId(e.target.value === 'manual' ? '' : e.target.value)}>
              {activeLocations.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              <option value="manual">Manual / lokasi baru</option>
            </Select>
          </FormField>
          <FormField label="Nama lokasi manual" required={!locationId} description="Tetap bisa input lokasi baru tanpa membuat master toko dulu.">
            <Input value={manualLocationName} onChange={(e) => setManualLocationName(e.target.value)} placeholder="Toko utama / Online / Bazaar" />
          </FormField>
          <FormField label="Tanggal penjualan" required description="Tanggal transaksi terjadi.">
            <Input type="date" value={soldAt} onChange={(e) => setSoldAt(e.target.value)} />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Jumlah & harga" description="Produksi menambah stok sementara sebelum dihitung barang terjual.">
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField label="Input produksi" description="Isi jika hari ini ada produksi baru. Boleh 0.">
            <Input type="number" min={0} value={productionQty} onChange={(e) => setProductionQty(Number(e.target.value))} placeholder="0" />
          </FormField>
          <FormField label="Jumlah terjual" required description={`Stok tersedia termasuk produksi: ${availableStock}.`}>
            <Input type="number" min={1} value={soldQty} onChange={(e) => setSoldQty(Number(e.target.value))} placeholder="1" />
          </FormField>
          <FormField label="Harga per lokasi" required description="Bisa berbeda antar toko, reseller, atau bazaar.">
            <Input type="number" min={0} value={unitPrice} onChange={(e) => setUnitPrice(Number(e.target.value))} placeholder="18000" />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Bukti transaksi" description="Opsional. Untuk versi cepat deploy, file disimpan lokal di browser.">
        <FileDropzone label="Upload bukti transaksi" description="Pilih foto struk, nota, atau screenshot pembayaran." value={proofUrl} onChange={onUpload} onClear={() => setProofUrl(undefined)} />
      </FormSection>

      <div className="grid gap-3 sm:grid-cols-4">
        <div className="rounded-2xl bg-white/70 p-3 dark:bg-white/10"><p className="text-xs text-slate-500">Omzet</p><p className="font-semibold">{formatCurrency(revenue)}</p></div>
        <div className="rounded-2xl bg-white/70 p-3 dark:bg-white/10"><p className="text-xs text-slate-500">Modal barang</p><p className="font-semibold">{formatCurrency(cost)}</p></div>
        <div className="rounded-2xl bg-white/70 p-3 dark:bg-white/10"><p className="text-xs text-slate-500">Laba</p><p className="font-semibold">{formatCurrency(profit)}</p></div>
        <div className="rounded-2xl bg-white/70 p-3 dark:bg-white/10"><p className="text-xs text-slate-500">Sisa produksi</p><p className="font-semibold">{remaining}</p></div>
      </div>
      <Button type="button" className="w-full" onClick={submit}>Simpan penjualan</Button>
    </div>
  );
}
