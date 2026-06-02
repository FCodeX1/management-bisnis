'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { businessSchema } from '@/lib/validations';
import { useAppStore } from '@/store/app-store';

type FormValues = z.infer<typeof businessSchema>;

export function BusinessForm({ onDone }: { onDone?: () => void }) {
  const addBusiness = useAppStore((state) => state.addBusiness);
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(businessSchema), defaultValues: { currency: 'IDR' } });

  function onSubmit(data: FormValues) {
    addBusiness({ ...data, logoUrl: '' });
    onDone?.();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input placeholder="Nama bisnis" {...register('name')} />
        {errors.name ? <p className="mt-1 text-xs text-red-500">{errors.name.message}</p> : null}
      </div>
      <Input placeholder="Kategori" {...register('category')} />
      <Textarea placeholder="Deskripsi singkat" {...register('description')} />
      <Input placeholder="Alamat" {...register('address')} />
      <Input placeholder="Mata uang" {...register('currency')} />
      <Button className="w-full">Simpan bisnis</Button>
    </form>
  );
}
