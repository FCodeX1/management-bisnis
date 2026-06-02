'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <Card className="mx-auto mt-20 max-w-lg text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-red-100 text-red-700"><AlertTriangle className="h-7 w-7" /></div>
      <h2 className="text-xl font-semibold">Terjadi kesalahan</h2>
      <p className="mt-2 text-sm text-slate-500">Silakan coba muat ulang halaman.</p>
      <Button className="mt-5" onClick={reset}>Coba lagi</Button>
    </Card>
  );
}
