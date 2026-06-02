'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AuthCard } from '@/components/auth/auth-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/auth-store';

export default function RegisterPage() {
  const router = useRouter();
  const registerUser = useAuthStore((state) => state.register);

  const onSubmit = (formData: FormData): void => {
    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    if (!name || !email || !password) {
      alert("Lengkapi semua data terlebih dahulu.");
      return;
    }

    localStorage.setItem(
      "mb_user",
      JSON.stringify({
        name,
        email,
        role: "Owner",
      })
    );

    window.location.href = "/dashboard";
  };

  return (
    <AuthCard title="Buat akun owner" description="Mulai dengan akun lokal demo. Bisa disambungkan ke Supabase Auth nanti.">
      <form action={onSubmit} className="space-y-4">
        <Input name="name" placeholder="Nama lengkap" required />
        <Input name="email" placeholder="Email" type="email" required />
        <Input name="password" placeholder="Password" type="password" required />
        <Button className="w-full">Daftar</Button>
      </form>
      <p className="mt-5 text-sm text-slate-500">Sudah punya akun? <Link className="font-semibold text-sage-700 dark:text-sage-300" href="/login">Masuk</Link></p>
    </AuthCard>
  );
}
