'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { AuthCard } from '@/components/auth/auth-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form-field';

export default function ForgotPasswordPage() {
  function onSubmit(formData: FormData): void {
    const email = String(formData.get('email') || '').trim();
    if (!email) {
      toast.error('Email wajib diisi');
      return;
    }
    toast.success('Simulasi reset password berhasil. Untuk production sambungkan ke Supabase Auth.');
  }

  return (
    <AuthCard title="Reset password" description="Fitur ini disiapkan untuk Supabase Auth. Versi lokal menampilkan simulasi agar alur UX tetap lengkap.">
      <form action={onSubmit} className="space-y-4">
        <FormField label="Email akun" required description="Masukkan email yang terdaftar. Link reset akan aktif setelah Supabase Auth disambungkan.">
          <Input name="email" placeholder="owner@demo.com" type="email" autoComplete="email" required />
        </FormField>
        <Button className="w-full">Kirim instruksi reset</Button>
      </form>
      <p className="mt-5 text-sm text-slate-500"><Link className="font-semibold text-sage-700 dark:text-sage-300" href="/login">Kembali login</Link></p>
    </AuthCard>
  );
}
