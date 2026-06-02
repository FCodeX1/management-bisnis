'use client';

import { RotateCcw, Settings } from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { useAppStore } from '@/store/app-store';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const resetDemo = useAppStore((state) => state.resetDemo);
  return (
    <div>
      <PageHeader title="Pengaturan" description="Atur preferensi tampilan, PWA, cache, dan data demo." />
      <div className="grid gap-5 xl:grid-cols-2">
        <Card><div className="mb-4 flex items-center gap-3"><Settings className="h-5 w-5 text-sage-700" /><h3 className="font-semibold">Tampilan</h3></div><Select value={theme} onChange={(e) => setTheme(e.target.value)}><option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option></Select></Card>
        <Card><h3 className="mb-2 font-semibold">Data lokal</h3><p className="mb-4 text-sm text-slate-500">Reset akan mengembalikan seed data awal.</p><Button variant="secondary" onClick={() => { resetDemo(); toast.success('Data demo direset'); }}><RotateCcw className="h-4 w-4" /> Reset demo</Button></Card>
      </div>
    </div>
  );
}
