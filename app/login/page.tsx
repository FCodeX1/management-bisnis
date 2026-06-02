'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { AuthCard } from '@/components/auth/auth-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form-field';
import { authSchema } from '@/lib/validations';
import { useAuthStore } from '@/store/auth-store';

type FormValues = z.infer<typeof authSchema>;

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(authSchema), defaultValues: { email: 'owner@demo.com', password: 'password' } });

  const onSubmit = (data: FormValues) => {
    login(data.email, data.password);
    toast.success('Login berhasil');
    router.push('/dashboard');
  };

  return (
    <AuthCard title="Masuk ke dashboard" description="Kelola modal, penjualan, stok, dan laba bisnis dalam satu tempat.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Email" required error={errors.email?.message} description="Akun demo sudah terisi otomatis, bisa langsung masuk.">
          <Input placeholder="owner@demo.com" type="email" autoComplete="email" {...register('email')} />
        </FormField>
        <FormField label="Password" required error={errors.password?.message} description="Minimal 6 karakter. Demo: password.">
          <Input placeholder="password" type="password" autoComplete="current-password" {...register('password')} />
        </FormField>
        <Button className="w-full" disabled={isSubmitting}>Masuk</Button>
      </form>
      <div className="mt-5 flex items-center justify-between text-sm">
        <Link className="text-sage-700 hover:underline dark:text-sage-300" href="/forgot-password">Lupa password?</Link>
        <Link className="font-semibold text-sage-700 hover:underline dark:text-sage-300" href="/register">Daftar</Link>
      </div>
    </AuthCard>
  );
}
