'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { PRODUCT_CATEGORIES, UNITS } from '@/lib/constants';
import { productSchema } from '@/lib/validations';
import { useBusinessData } from '@/hooks/use-business';

type FormValues = z.infer<typeof productSchema>;

export function ProductForm({ onDone }: { onDone?: () => void }) {
  const { business, addProduct } = useBusinessData();
  const { register, watch, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { category: 'Makanan', baseUnit: 'pcs', costPrice: 0, sellingPrice: 0, minStock: 5, stock: 0 }
  });
  const cost = Number(watch('costPrice') || 0);
  const price = Number(watch('sellingPrice') || 0);
  const margin = price ? ((price - cost) / price) * 100 : 0;

  function onSubmit(data: FormValues) {
    if (!business) return;
    addProduct({ businessId: business.id, name: data.name, category: data.category, baseUnit: data.baseUnit as any, costPrice: data.costPrice, sellingPrice: data.sellingPrice, minStock: data.minStock, stock: data.stock, barcode: data.barcode, photoUrl: '' });
    onDone?.();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2"><Input placeholder="Nama produk" {...register('name')} />{errors.name ? <p className="mt-1 text-xs text-red-500">{errors.name.message}</p> : null}</div>
      <Select {...register('category')}>{PRODUCT_CATEGORIES.map((item) => <option key={item}>{item}</option>)}</Select>
      <Select {...register('baseUnit')}>{UNITS.map((item) => <option key={item}>{item}</option>)}</Select>
      <Input type="number" placeholder="Harga modal" {...register('costPrice')} />
      <Input type="number" placeholder="Harga jual" {...register('sellingPrice')} />
      <Input type="number" placeholder="Stok awal" {...register('stock')} />
      <Input type="number" placeholder="Minimum stok" {...register('minStock')} />
      <Input className="sm:col-span-2" placeholder="Barcode opsional" {...register('barcode')} />
      <div className="rounded-2xl bg-sage-50 p-4 text-sm text-sage-800 dark:bg-sage-400/10 dark:text-sage-100 sm:col-span-2">Margin otomatis: <strong>{margin.toFixed(1)}%</strong></div>
      <Button className="sm:col-span-2">Simpan produk</Button>
    </form>
  );
}
