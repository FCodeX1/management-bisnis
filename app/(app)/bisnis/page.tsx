'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Building2, Plus, Store } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { BusinessForm } from '@/components/forms/business-form';
import { useBusinessData } from '@/hooks/use-business';
import { useAppStore } from '@/store/app-store';

export default function BusinessPage() {
  const { businesses, activeBusinessId, switchBusiness } = useBusinessData();
  const allLocations = useAppStore((state) => state.locations);
  const [open, setOpen] = useState(false);
  const activeBusinesses = businesses.filter((item) => !item.deletedAt);
  const locationCountByBusiness = useMemo(() => allLocations.filter((item) => !item.deletedAt).reduce<Record<string, number>>((acc, item) => {
    acc[item.businessId] = (acc[item.businessId] || 0) + 1;
    return acc;
  }, {}), [allLocations]);

  return (
    <div>
      <PageHeader
        title="Daftar Bisnis"
        description="Kelola banyak bisnis, detail profil, dan pindah dashboard dengan cepat."
        action={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="secondary"><Link href="/toko"><Store className="h-4 w-4" /> Kelola toko</Link></Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild><Button><Plus className="h-4 w-4" /> Tambah bisnis</Button></DialogTrigger>
              <DialogContent><DialogHeader title="Tambah bisnis" description="Isi profil dasar bisnis. Setelah tersimpan, kamu bisa menambahkan toko/lokasi penjualan." /><BusinessForm onDone={() => setOpen(false)} /></DialogContent>
            </Dialog>
          </div>
        }
      />
      {activeBusinesses.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {activeBusinesses.map((business) => (
            <Card key={business.id} className="group transition hover:-translate-y-1 hover:shadow-glass">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-sage-100 text-sage-700 dark:bg-sage-400/15 dark:text-sage-100">
                    {business.logoUrl ? <Image src={business.logoUrl} alt={business.name} fill className="object-cover" unoptimized /> : <Building2 className="h-5 w-5" />}
                  </div>
                  <div><h3 className="font-semibold">{business.name}</h3><p className="text-sm text-slate-500">{business.category}</p></div>
                </div>
                {business.id === activeBusinessId ? <Badge>Aktif</Badge> : null}
              </div>
              <p className="mt-4 min-h-10 text-sm text-slate-500 dark:text-slate-400">{business.description || 'Belum ada deskripsi.'}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-2xl bg-white/60 p-3 dark:bg-white/10"><p className="text-xs text-slate-500">Mata uang</p><p className="font-semibold">{business.currency}</p></div>
                <div className="rounded-2xl bg-white/60 p-3 dark:bg-white/10"><p className="text-xs text-slate-500">Toko</p><p className="font-semibold">{locationCountByBusiness[business.id] || 0}</p></div>
              </div>
              <div className="mt-5 flex gap-2">
                <Button variant="secondary" onClick={() => switchBusiness(business.id)}>Pakai</Button>
                <Button asChild variant="ghost"><Link href={`/bisnis/${business.id}`}>Detail</Link></Button>
              </div>
            </Card>
          ))}
        </div>
      ) : <EmptyState icon={Building2} title="Belum ada bisnis" description="Tambahkan bisnis pertama agar dashboard, produk, modal, dan penjualan punya ruang kerja sendiri." />}
    </div>
  );
}
