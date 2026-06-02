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
        <div>
          <Input placeholder="Email" type="email" {...register('email')} />
          {errors.email ? <p className="mt-1 text-xs text-red-500">{errors.email.message}</p> : null}
        </div>
        <div>
          <Input placeholder="Password" type="password" {...register('password')} />
          {errors.password ? <p className="mt-1 text-xs text-red-500">{errors.password.message}</p> : null}
        </div>
        <Button className="w-full" disabled={isSubmitting}>Masuk</Button>
      </form>
      <div className="mt-5 flex items-center justify-between text-sm">
        <Link className="text-sage-700 hover:underline dark:text-sage-300" href="/forgot-password">Lupa password?</Link>
        <Link className="font-semibold text-sage-700 hover:underline dark:text-sage-300" href="/register">Daftar</Link>
      </div>
    </AuthCard>
  );
}
