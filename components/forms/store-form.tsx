'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormSection } from '@/components/ui/form-field';
import { storeSchema } from '@/lib/validations';
import { useBusinessData } from '@/hooks/use-business';
import type { SaleLocation } from '@/types';

type FormValues = z.infer<typeof storeSchema>;

interface StoreFormProps {
  initialData?: SaleLocation;
  businessId?: string;
  onDone?: () => void;
}

export function StoreForm({ initialData, businessId, onDone }: StoreFormProps) {
  const { addLocation, updateLocation } = useBusinessData();
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm<FormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: initialData?.name || '',
      address: initialData?.address || '',
      phone: initialData?.phone || '',
      managerName: initialData?.managerName || '',
      priceNote: initialData?.priceNote || '',
      openingHours: initialData?.openingHours || '08:00 - 21:00',
      targetDailyRevenue: initialData?.targetDailyRevenue || 0,
      isActive: initialData?.isActive ?? true
    }
  });
  const isActive = watch('isActive');

  function onSubmit(data: FormValues) {
    const payload = {
      ...data,
      address: data.address || '',
      phone: data.phone || '',
      managerName: data.managerName || '',
      priceNote: data.priceNote || '',
      openingHours: data.openingHours || '',
      targetDailyRevenue: Number(data.targetDailyRevenue || 0),
      isActive: Boolean(data.isActive)
    };

    if (initialData) updateLocation(initialData.id, payload);
    else addLocation(payload, businessId);
    onDone?.();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormSection title="Identitas toko" description="Toko bisa berupa outlet fisik, marketplace, reseller, bazaar, atau lokasi penjualan lain.">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Nama toko/lokasi" required error={errors.name?.message} description="Contoh: Toko utama, Online, Tokopedia, Bazaar Weekend.">
            <Input placeholder="Toko utama" {...register('name')} />
          </FormField>
          <FormField label="Penanggung jawab" error={errors.managerName?.message} description="Nama PIC outlet atau admin yang mengelola penjualan.">
            <Input placeholder="Nama PIC" {...register('managerName')} />
          </FormField>
          <FormField label="No. telepon" error={errors.phone?.message} description="Opsional, untuk kontak outlet/reseller.">
            <Input placeholder="08xxxxxxxxxx" inputMode="tel" {...register('phone')} />
          </FormField>
          <FormField label="Jam operasional" error={errors.openingHours?.message} description="Dipakai sebagai keterangan di detail toko.">
            <Input placeholder="08:00 - 21:00" {...register('openingHours')} />
          </FormField>
          <FormField label="Alamat" className="sm:col-span-2" error={errors.address?.message} description="Isi alamat lengkap atau nama channel online.">
            <Textarea placeholder="Jl. Contoh No. 10 / Instagram / Marketplace" {...register('address')} />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Pengaturan penjualan" description="Keterangan ini membantu saat input transaksi dan membaca performa per lokasi.">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Target omzet harian" error={errors.targetDailyRevenue?.message} description="Isi 0 jika belum punya target.">
            <Input type="number" min={0} placeholder="500000" {...register('targetDailyRevenue')} />
          </FormField>
          <FormField label="Status toko" description="Nonaktifkan jika toko sedang tidak digunakan, data lama tetap aman.">
            <button
              type="button"
              onClick={() => setValue('isActive', !isActive, { shouldDirty: true })}
              className="flex h-11 w-full items-center justify-between rounded-2xl border border-slate-200 bg-white/80 px-4 text-sm font-semibold transition hover:bg-white dark:border-white/10 dark:bg-white/10"
            >
              <span>{isActive ? 'Aktif' : 'Nonaktif'}</span>
              <span className={isActive ? 'text-sage-700 dark:text-sage-200' : 'text-slate-500'}>{isActive ? 'Siap dipakai' : 'Disembunyikan dari input'}</span>
            </button>
          </FormField>
          <FormField label="Catatan harga/lokasi" className="sm:col-span-2" error={errors.priceNote?.message} description="Contoh: Harga outlet 18rb, online 19rb, bazaar 22rb.">
            <Textarea placeholder="Harga outlet mengikuti harga normal. Marketplace tambah biaya admin." {...register('priceNote')} />
          </FormField>
        </div>
      </FormSection>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {initialData ? 'Simpan perubahan toko' : 'Tambah toko'}
      </Button>
    </form>
  );
}
