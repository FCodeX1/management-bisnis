'use client';

import { useMemo, useState } from 'react';
import { Plus, Search, Trash2, WalletCards } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { CapitalForm } from '@/components/forms/capital-form';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useBusinessData } from '@/hooks/use-business';
import { formatCurrency } from '@/lib/currency';
import { formatDate } from '@/lib/utils';

export default function CapitalPage() {
  const { capitals, deleteCapital } = useBusinessData();
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => capitals.filter((item) => `${item.title} ${item.category} ${item.totalAmount}`.toLowerCase().includes(search.toLowerCase())), [capitals, search]);
  return (
    <div>
      <PageHeader title="Manajemen Modal" description="Catat modal, multi item, foto nota, histori, pencarian, dan auto total calculation." action={
        <Dialog><DialogTrigger asChild><Button><Plus className="h-4 w-4" /> Tambah modal</Button></DialogTrigger><DialogContent><DialogHeader title="Tambah modal" description="Input beberapa item sekaligus. Total dihitung otomatis." /><CapitalForm /></DialogContent></Dialog>
      } />
      <Card className="mb-5"><div className="flex items-center gap-3"><Search className="h-4 w-4 text-slate-400" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nominal, judul, kategori..." /></div></Card>
      {filtered.length ? <div className="space-y-3">{filtered.map((item) => (
        <Card key={item.id} className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div><div className="flex items-center gap-2"><h3 className="font-semibold">{item.title}</h3><Badge>{item.category}</Badge></div><p className="mt-1 text-sm text-slate-500">{formatDate(item.recordedAt)} • {item.items.length} item</p></div>
            <div className="flex items-center justify-between gap-3"><p className="text-lg font-semibold">{formatCurrency(item.totalAmount)}</p><Button variant="ghost" size="icon" onClick={() => deleteCapital(item.id)}><Trash2 className="h-4 w-4" /></Button></div>
          </div>
          <div className="mt-3 grid gap-2 md:grid-cols-2">{item.items.map((sub) => <div key={sub.id} className="rounded-2xl bg-white/60 px-3 py-2 text-sm dark:bg-white/10">{sub.name} • {sub.qty} {sub.unit} • {formatCurrency(sub.subtotal)}</div>)}</div>
        </Card>
      ))}</div> : <EmptyState icon={WalletCards} title="Belum ada modal" description="Mulai catat bahan baku, packaging, transport, dan biaya operasional." />}
    </div>
  );
}
