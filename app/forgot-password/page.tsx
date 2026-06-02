'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { AuthCard } from '@/components/auth/auth-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ForgotPasswordPage() {
  function onSubmit() {
    toast.success('Instruksi reset password demo ditampilkan. Untuk production, sambungkan Supabase Auth reset email.');
  }

  return (
    <AuthCard title="Reset password" description="Masukkan email untuk mendapatkan instruksi reset password.">
      <form action={onSubmit} className="space-y-4">
        <Input name="email" type="email" placeholder="Email" required />
        <Button className="w-full">Kirim instruksi</Button>
      </form>
      <p className="mt-5 text-sm"><Link className="text-sage-700 hover:underline dark:text-sage-300" href="/login">Kembali ke login</Link></p>
    </AuthCard>
  );
}
