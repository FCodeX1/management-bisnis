'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { FileDropzone } from '@/components/ui/file-dropzone';
import { FormField, FormSection } from '@/components/ui/form-field';
import { businessSchema } from '@/lib/validations';
import { fileToDataUrl } from '@/lib/utils';
import { useAppStore } from '@/store/app-store';
import type { Business } from '@/types';

type FormValues = z.infer<typeof businessSchema>;

interface BusinessFormProps {
  initialData?: Business;
  onDone?: () => void;
}

const currencies = ['IDR', 'USD', 'SGD', 'MYR'];

export function BusinessForm({ initialData, onDone }: BusinessFormProps) {
  const addBusiness = useAppStore((state) => state.addBusiness);
  const updateBusiness = useAppStore((state) => state.updateBusiness);
  const [logoUrl, setLogoUrl] = useState(initialData?.logoUrl || '');
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: initialData?.name || '',
      category: initialData?.category || '',
      description: initialData?.description || '',
      address: initialData?.address || '',
      currency: initialData?.currency || 'IDR',
      logoUrl: initialData?.logoUrl || ''
    }
  });

  async function onLogoUpload(file?: File) {
    if (!file) return;
    const nextLogo = await fileToDataUrl(file);
    setLogoUrl(nextLogo);
    setValue('logoUrl', nextLogo, { shouldDirty: true });
  }

  function onSubmit(data: FormValues) {
    const payload = {
      name: data.name.trim(),
      category: data.category.trim(),
      description: data.description?.trim() || '',
      address: data.address?.trim() || '',
      currency: data.currency || 'IDR',
      logoUrl
    };

    if (initialData) updateBusiness(initialData.id, payload);
    else addBusiness(payload);
    onDone?.();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormSection title="Profil bisnis" description="Data ini muncul di dashboard, switch bisnis, laporan, dan halaman detail bisnis.">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Nama bisnis" required error={errors.name?.message} description="Gunakan nama brand/toko yang mudah dikenali.">
            <Input placeholder="Contoh: Kedai Sage UMKM" {...register('name')} />
          </FormField>
          <FormField label="Kategori" required error={errors.category?.message} description="Contoh: Food & Beverage, Fashion, Retail, Jasa.">
            <Input placeholder="Food & Beverage" {...register('category')} />
          </FormField>
          <FormField label="Mata uang" required error={errors.currency?.message} description="Default IDR untuk Rupiah.">
            <Select {...register('currency')}>
              {currencies.map((currency) => <option key={currency} value={currency}>{currency}</option>)}
            </Select>
          </FormField>
          <FormField label="Alamat utama" error={errors.address?.message} description="Alamat pusat, rumah produksi, atau kota operasional.">
            <Input placeholder="Jakarta Selatan" {...register('address')} />
          </FormField>
          <FormField label="Deskripsi" className="sm:col-span-2" error={errors.description?.message} description="Tulis ringkasan pendek agar tim memahami fokus bisnis.">
            <Textarea placeholder="Bisnis minuman dan snack premium minimalis." {...register('description')} />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Logo bisnis" description="Untuk saat ini logo disimpan lokal di browser. Nanti bisa diarahkan ke Supabase Storage.">
        <FileDropzone
          label="Upload logo bisnis"
          description="PNG/JPG, disarankan ukuran kotak agar rapi."
          value={logoUrl}
          onChange={onLogoUpload}
          onClear={() => { setLogoUrl(''); setValue('logoUrl', '', { shouldDirty: true }); }}
        />
      </FormSection>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {initialData ? 'Simpan perubahan bisnis' : 'Simpan bisnis'}
      </Button>
    </form>
  );
}
