'use client';

import Link from 'next/link';
import { Building2, Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { BusinessForm } from '@/components/forms/business-form';
import { useBusinessData } from '@/hooks/use-business';

export default function BusinessPage() {
  const { businesses, activeBusinessId, switchBusiness } = useBusinessData();
  const activeBusinesses = businesses.filter((item) => !item.deletedAt);
  return (
    <div>
      <PageHeader title="Daftar Bisnis" description="Kelola banyak bisnis dan pindah dashboard dengan cepat." action={
        <Dialog><DialogTrigger asChild><Button><Plus className="h-4 w-4" /> Tambah bisnis</Button></DialogTrigger><DialogContent><DialogHeader title="Tambah bisnis" description="Masukkan profil dasar bisnis." /><BusinessForm /></DialogContent></Dialog>
      } />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {activeBusinesses.map((business) => (
          <Card key={business.id} className="group transition hover:-translate-y-1 hover:shadow-glass">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage-100 text-sage-700 dark:bg-sage-400/15 dark:text-sage-100"><Building2 className="h-5 w-5" /></div>
                <div><h3 className="font-semibold">{business.name}</h3><p className="text-sm text-slate-500">{business.category}</p></div>
              </div>
              {business.id === activeBusinessId ? <Badge>Aktif</Badge> : null}
            </div>
            <p className="mt-4 min-h-10 text-sm text-slate-500 dark:text-slate-400">{business.description || 'Belum ada deskripsi.'}</p>
            <div className="mt-5 flex gap-2">
              <Button variant="secondary" onClick={() => switchBusiness(business.id)}>Pakai</Button>
              <Button asChild variant="ghost"><Link href={`/bisnis/${business.id}`}>Detail</Link></Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
