import { WifiOff } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="max-w-md text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-sage-100 text-sage-700"><WifiOff className="h-7 w-7" /></div>
        <h1 className="text-xl font-semibold">Kamu sedang offline</h1>
        <p className="mt-2 text-sm text-slate-500">Data terakhir tetap tersimpan di perangkat. Sinkronisasi bisa ditambahkan saat Supabase diaktifkan.</p>
      </Card>
    </main>
  );
}
