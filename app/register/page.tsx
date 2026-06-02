'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AuthCard } from '@/components/auth/auth-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form-field';
import { useAuthStore } from '@/store/auth-store';

export default function RegisterPage() {
  const router = useRouter();
  const registerUser = useAuthStore((state) => state.register);

  function onSubmit(formData: FormData): void {
    const name = String(formData.get('name') || 'Owner UMKM').trim();
    const email = String(formData.get('email') || 'owner@demo.com').trim();
    const password = String(formData.get('password') || '');
    if (password.length < 6) {
      toast.error('Password minimal 6 karakter');
      return;
    }
    registerUser(name, email, password);
    toast.success('Akun berhasil dibuat');
    router.push('/dashboard');
  }

  return (
    <AuthCard title="Buat akun owner" description="Mulai dengan akun lokal demo. Bisa disambungkan ke Supabase Auth nanti.">
      <form action={onSubmit} className="space-y-4">
        <FormField label="Nama lengkap" required description="Nama ini tampil sebagai owner di dashboard.">
          <Input name="name" placeholder="Owner UMKM" autoComplete="name" required />
        </FormField>
        <FormField label="Email" required description="Untuk login demo lokal dan nanti bisa dipakai Supabase Auth.">
          <Input name="email" placeholder="owner@demo.com" type="email" autoComplete="email" required />
        </FormField>
        <FormField label="Password" required description="Minimal 6 karakter.">
          <Input name="password" placeholder="Minimal 6 karakter" type="password" autoComplete="new-password" required />
        </FormField>
        <Button className="w-full">Daftar</Button>
      </form>
      <p className="mt-5 text-sm text-slate-500">Sudah punya akun? <Link className="font-semibold text-sage-700 dark:text-sage-300" href="/login">Masuk</Link></p>
    </AuthCard>
  );
}
