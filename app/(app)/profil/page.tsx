'use client';

import { useState } from 'react';
import { LogOut, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateProfile, logout } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  function save() { updateProfile({ name }); toast.success('Profil diperbarui'); }
  function out() { logout(); router.push('/login'); }
  return (
    <div>
      <PageHeader title="Profil User" description="Kelola profil owner dan akses akun." />
      <Card className="max-w-xl">
        <div className="mb-5 flex items-center gap-3"><div className="rounded-3xl bg-sage-100 p-4 text-sage-700 dark:bg-sage-400/15 dark:text-sage-100"><UserRound className="h-7 w-7" /></div><div><h3 className="font-semibold">{user?.email}</h3><p className="text-sm text-slate-500">Role: {user?.role}</p></div></div>
        <div className="space-y-3"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama" /><Input value={user?.email || ''} disabled /><Button onClick={save} className="w-full">Simpan profil</Button><Button variant="secondary" onClick={out} className="w-full"><LogOut className="h-4 w-4" /> Logout</Button></div>
      </Card>
    </div>
  );
}
