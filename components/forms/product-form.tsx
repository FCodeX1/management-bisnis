'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { FormField, FormSection } from '@/components/ui/form-field';
import { PRODUCT_CATEGORIES, UNITS } from '@/lib/constants';
import { productSchema } from '@/lib/validations';
import { formatCurrency } from '@/lib/currency';
import { useBusinessData } from '@/hooks/use-business';
import type { Unit } from '@/types';

type FormValues = z.infer<typeof productSchema>;

export function ProductForm({ onDone }: { onDone?: () => void }) {
  const { business, addProduct } = useBusinessData();
  const { register, watch, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { category: 'Makanan', baseUnit: 'pcs', costPrice: 0, sellingPrice: 0, minStock: 5, stock: 0, barcode: '' }
  });
  const cost = Number(watch('costPrice') || 0);
  const price = Number(watch('sellingPrice') || 0);
  const margin = price ? ((price - cost) / price) * 100 : 0;
  const grossProfit = Math.max(price - cost, 0);

  function onSubmit(data: FormValues) {
    if (!business) return;
    addProduct({
      businessId: business.id,
      name: data.name.trim(),
      category: data.category,
      baseUnit: data.baseUnit as Unit,
      costPrice: Number(data.costPrice || 0),
      sellingPrice: Number(data.sellingPrice || 0),
      minStock: Number(data.minStock || 0),
      stock: Number(data.stock || 0),
      barcode: data.barcode || '',
      photoUrl: ''
    });
    onDone?.();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormSection title="Identitas produk" description="SKU dibuat otomatis agar produk mudah dilacak di stok dan penjualan.">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Nama produk" required error={errors.name?.message} description="Contoh: Kopi Susu Sage, Brownies Mini, Paket Hemat.">
            <Input placeholder="Nama produk" {...register('name')} />
          </FormField>
          <FormField label="Kategori" required error={errors.category?.message} description="Bantu filter produk di laporan.">
            <Select {...register('category')}>{PRODUCT_CATEGORIES.map((item) => <option key={item}>{item}</option>)}</Select>
          </FormField>
          <FormField label="Satuan dasar" required error={errors.baseUnit?.message} description="Dipakai untuk stok, modal, dan penjualan.">
            <Select {...register('baseUnit')}>{UNITS.map((item) => <option key={item}>{item}</option>)}</Select>
          </FormField>
          <FormField label="Barcode" error={errors.barcode?.message} description="Opsional, bisa diisi manual dulu.">
            <Input placeholder="899xxxx / kosongkan" {...register('barcode')} />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Harga & stok" description="Margin, laba per unit, dan warning stok dihitung otomatis.">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Harga modal/unit" required error={errors.costPrice?.message} description="Biaya pokok per 1 satuan produk.">
            <Input type="number" min={0} placeholder="9000" {...register('costPrice')} />
          </FormField>
          <FormField label="Harga jual/unit" required error={errors.sellingPrice?.message} description="Harga normal sebelum promo/lokasi khusus.">
            <Input type="number" min={0} placeholder="18000" {...register('sellingPrice')} />
          </FormField>
          <FormField label="Stok awal" required error={errors.stock?.message} description="Jumlah barang tersedia saat produk dibuat.">
            <Input type="number" min={0} placeholder="50" {...register('stock')} />
          </FormField>
          <FormField label="Minimum stok" required error={errors.minStock?.message} description="Notifikasi muncul saat stok di bawah batas ini.">
            <Input type="number" min={0} placeholder="5" {...register('minStock')} />
          </FormField>
        </div>
      </FormSection>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-sage-50 p-4 text-sm text-sage-900 dark:bg-sage-400/10 dark:text-sage-100">
          Margin otomatis: <strong>{margin.toFixed(1)}%</strong>
        </div>
        <div className="rounded-2xl bg-white/70 p-4 text-sm text-slate-700 dark:bg-white/10 dark:text-slate-200">
          Laba/unit estimasi: <strong>{formatCurrency(grossProfit)}</strong>
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>Simpan produk</Button>
    </form>
  );
}
