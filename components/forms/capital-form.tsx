'use client';

import { useMemo, useState } from 'react';
import { Plus, Trash2, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { CAPITAL_CATEGORIES, UNITS } from '@/lib/constants';
import { formatCurrency } from '@/lib/currency';
import { fileToDataUrl, toInputDate } from '@/lib/utils';
import { uid } from '@/lib/id';
import { useBusinessData } from '@/hooks/use-business';
import type { CapitalItem, Unit } from '@/types';

const emptyItem = (): CapitalItem => ({ id: uid('item'), name: '', qty: 1, unit: 'pcs', price: 0, subtotal: 0 });

export function CapitalForm({ onDone }: { onDone?: () => void }) {
  const { addCapital } = useBusinessData();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CAPITAL_CATEGORIES[0]);
  const [recordedAt, setRecordedAt] = useState(toInputDate());
  const [noteUrl, setNoteUrl] = useState<string | undefined>();
  const [items, setItems] = useState<CapitalItem[]>([emptyItem()]);
  const total = useMemo(() => items.reduce((sum, item) => sum + item.subtotal, 0), [items]);

  const updateItem = (id: string, patch: Partial<CapitalItem>) => setItems((rows) => rows.map((row) => {
    if (row.id !== id) return row;
    const next = { ...row, ...patch };
    next.subtotal = Number(next.qty || 0) * Number(next.price || 0);
    return next;
  }));

  async function onUpload(file?: File) {
    if (!file) return;
    setNoteUrl(await fileToDataUrl(file));
  }

  function submit() {
    const cleanItems = items.filter((item) => item.name.trim());
    if (!title || !cleanItems.length) return;
    addCapital({ title, category, recordedAt: new Date(recordedAt).toISOString(), noteUrl, items: cleanItems });
    onDone?.();
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul modal" />
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>{CAPITAL_CATEGORIES.map((item) => <option key={item}>{item}</option>)}</Select>
        <Input type="date" value={recordedAt} onChange={(e) => setRecordedAt(e.target.value)} />
        <label className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-sage-300 bg-white/70 text-sm font-semibold text-sage-700 dark:border-white/10 dark:bg-white/10 dark:text-sage-100">
          <UploadCloud className="h-4 w-4" /> Upload foto nota
          <input className="hidden" type="file" accept="image/*" onChange={(e) => onUpload(e.target.files?.[0])} />
        </label>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="grid gap-2 rounded-3xl border border-slate-200 bg-white/60 p-3 dark:border-white/10 dark:bg-white/[0.04] sm:grid-cols-[1.4fr_0.7fr_0.8fr_1fr_auto]">
            <Input value={item.name} onChange={(e) => updateItem(item.id, { name: e.target.value })} placeholder="Nama item" />
            <Input type="number" value={item.qty} onChange={(e) => updateItem(item.id, { qty: Number(e.target.value) })} placeholder="Qty" />
            <Select value={item.unit} onChange={(e) => updateItem(item.id, { unit: e.target.value as Unit })}>{UNITS.map((unit) => <option key={unit}>{unit}</option>)}</Select>
            <Input type="number" value={item.price} onChange={(e) => updateItem(item.id, { price: Number(e.target.value) })} placeholder="Harga" />
            <Button variant="ghost" size="icon" onClick={() => setItems((rows) => rows.filter((row) => row.id !== item.id))}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
      </div>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <Button variant="secondary" onClick={() => setItems((rows) => [...rows, emptyItem()])}><Plus className="h-4 w-4" /> Tambah item</Button>
        <div className="rounded-2xl bg-sage-600 px-4 py-3 text-right text-white shadow-soft">Total modal: <strong>{formatCurrency(total)}</strong></div>
      </div>
      <Button className="w-full" onClick={submit}>Simpan modal</Button>
    </div>
  );
}
