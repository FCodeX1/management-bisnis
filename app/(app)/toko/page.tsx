'use client';

import { useMemo, useState } from 'react';
import { Clock, MapPin, Pencil, Phone, Plus, Search, Store, Trash2, UserRound } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StoreForm } from '@/components/forms/store-form';
import { useBusinessData } from '@/hooks/use-business';
import { formatCurrency } from '@/lib/currency';

export default function StoresPage() {
  const { locations, sales, deleteLocation } = useBusinessData();
  const [search, setSearch] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const filtered = useMemo(() => locations.filter((item) => {
    const text = `${item.name} ${item.address || ''} ${item.phone || ''} ${item.managerName || ''}`.toLowerCase();
    return text.includes(search.toLowerCase());
  }), [locations, search]);

  const activeCount = locations.filter((item) => item.isActive !== false).length;
  const totalTarget = locations.reduce((sum, item) => sum + Number(item.targetDailyRevenue || 0), 0);

  return (
    <div>
      <PageHeader
        title="Toko & Lokasi"
        description="Kelola outlet, marketplace, reseller, bazaar, dan lokasi penjualan agar laporan per toko lebih akurat."
        action={
          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4" /> Tambah toko</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader title="Tambah toko/lokasi" description="Isi data toko dengan rapi agar bisa dipakai saat input penjualan." />
              <StoreForm onDone={() => setOpenCreate(false)} />
            </DialogContent>
          </Dialog>
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <Card className="p-4"><p className="text-xs text-slate-500">Total toko</p><p className="mt-1 text-2xl font-semibold">{locations.length}</p></Card>
        <Card className="p-4"><p className="text-xs text-slate-500">Toko aktif</p><p className="mt-1 text-2xl font-semibold">{activeCount}</p></Card>
        <Card className="p-4"><p className="text-xs text-slate-500">Target harian</p><p className="mt-1 text-2xl font-semibold">{formatCurrency(totalTarget)}</p></Card>
      </div>

      <Card className="mb-5">
        <div className="flex items-center gap-3">
          <Search className="h-4 w-4 text-slate-400" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama toko, alamat, PIC, atau nomor telepon..." />
        </div>
      </Card>

      {filtered.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((location) => {
            const outletSales = sales.filter((sale) => sale.locationId === location.id || sale.locationName === location.name);
            const revenue = outletSales.reduce((sum, sale) => sum + sale.revenue, 0);
            const editOpen = editId === location.id;
            return (
              <Card key={location.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage-100 text-sage-700 dark:bg-sage-400/15 dark:text-sage-100"><Store className="h-5 w-5" /></div>
                    <div>
                      <h3 className="font-semibold">{location.name}</h3>
                      <p className="text-xs text-slate-500">{location.managerName || 'PIC belum diisi'}</p>
                    </div>
                  </div>
                  <Badge className={location.isActive !== false ? '' : 'bg-slate-200 text-slate-600'}>{location.isActive !== false ? 'Aktif' : 'Nonaktif'}</Badge>
                </div>

                <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sage-700" /><span>{location.address || 'Alamat belum diisi'}</span></div>
                  <div className="flex gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-sage-700" /><span>{location.phone || 'Telepon belum diisi'}</span></div>
                  <div className="flex gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-sage-700" /><span>{location.openingHours || 'Jam operasional belum diisi'}</span></div>
                  <div className="flex gap-2"><UserRound className="mt-0.5 h-4 w-4 shrink-0 text-sage-700" /><span>{location.priceNote || 'Catatan harga belum diisi'}</span></div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-2xl bg-white/60 p-3 dark:bg-white/10"><p className="text-xs text-slate-500">Omzet tercatat</p><p className="font-semibold">{formatCurrency(revenue)}</p></div>
                  <div className="rounded-2xl bg-white/60 p-3 dark:bg-white/10"><p className="text-xs text-slate-500">Target/hari</p><p className="font-semibold">{formatCurrency(location.targetDailyRevenue || 0)}</p></div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Dialog open={editOpen} onOpenChange={(open) => setEditId(open ? location.id : null)}>
                    <DialogTrigger asChild><Button variant="secondary" className="flex-1"><Pencil className="h-4 w-4" /> Edit</Button></DialogTrigger>
                    <DialogContent>
                      <DialogHeader title="Edit toko/lokasi" description="Perbarui data toko. Histori penjualan lama tetap aman." />
                      <StoreForm initialData={location} onDone={() => setEditId(null)} />
                    </DialogContent>
                  </Dialog>
                  <Button variant="ghost" size="icon" onClick={() => deleteLocation(location.id)} aria-label="Hapus toko"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : <EmptyState icon={Store} title="Belum ada toko/lokasi" description="Tambahkan toko utama, online, marketplace, reseller, atau bazaar agar penjualan bisa dianalisa per lokasi." />}
    </div>
  );
}
