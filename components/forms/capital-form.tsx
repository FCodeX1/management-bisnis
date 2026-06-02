'use client';

import { useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { FileDropzone } from '@/components/ui/file-dropzone';
import { FormField, FormSection } from '@/components/ui/form-field';
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
    next.qty = Math.max(0, Number(next.qty || 0));
    next.price = Math.max(0, Number(next.price || 0));
    next.subtotal = next.qty * next.price;
    return next;
  }));

  async function onUpload(file?: File) {
    if (!file) return;
    setNoteUrl(await fileToDataUrl(file));
  }

  function removeItem(id: string) {
    setItems((rows) => rows.length === 1 ? rows : rows.filter((row) => row.id !== id));
  }

  function submit() {
    const cleanItems = items
      .filter((item) => item.name.trim())
      .map((item) => ({ ...item, name: item.name.trim(), subtotal: Number(item.qty || 0) * Number(item.price || 0) }));

    if (!title.trim()) {
      toast.error('Judul modal wajib diisi');
      return;
    }
    if (!cleanItems.length) {
      toast.error('Minimal isi 1 item modal');
      return;
    }

    addCapital({ title: title.trim(), category, recordedAt: new Date(recordedAt).toISOString(), noteUrl, items: cleanItems });
    onDone?.();
  }

  return (
    <div className="space-y-4">
      <FormSection title="Informasi modal" description="Gunakan untuk mencatat belanja bahan baku, packaging, transport, gaji, dan biaya operasional.">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Judul catatan" required description="Contoh: Belanja bahan baku minggu 1.">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul modal" />
          </FormField>
          <FormField label="Kategori modal" required description="Kategori membantu analisa biaya terbesar.">
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>{CAPITAL_CATEGORIES.map((item) => <option key={item}>{item}</option>)}</Select>
          </FormField>
          <FormField label="Tanggal modal" required description="Tanggal transaksi/belanja dilakukan.">
            <Input type="date" value={recordedAt} onChange={(e) => setRecordedAt(e.target.value)} />
          </FormField>
          <FormField label="Foto nota" description="Opsional. Saat ini disimpan lokal agar bisa deploy cepat tanpa storage.">
            <FileDropzone label="Upload foto nota" description="Klik untuk pilih gambar nota." value={noteUrl} onChange={onUpload} onClear={() => setNoteUrl(undefined)} />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Rincian item modal" description="Isi beberapa item sekaligus. Subtotal dan total otomatis dihitung.">
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={item.id} className="rounded-3xl border border-slate-200 bg-white/65 p-3 dark:border-white/10 dark:bg-white/[0.04]">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold">Item #{index + 1}</p>
                <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(item.id)} disabled={items.length === 1} aria-label="Hapus item modal">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-[1.4fr_0.7fr_0.8fr_1fr_1fr]">
                <FormField label="Nama item" required>
                  <Input value={item.name} onChange={(e) => updateItem(item.id, { name: e.target.value })} placeholder="Susu UHT" />
                </FormField>
                <FormField label="Qty" required>
                  <Input type="number" min={0} value={item.qty} onChange={(e) => updateItem(item.id, { qty: Number(e.target.value) })} placeholder="1" />
                </FormField>
                <FormField label="Satuan" required>
                  <Select value={item.unit} onChange={(e) => updateItem(item.id, { unit: e.target.value as Unit })}>{UNITS.map((unit) => <option key={unit}>{unit}</option>)}</Select>
                </FormField>
                <FormField label="Harga/unit" required>
                  <Input type="number" min={0} value={item.price} onChange={(e) => updateItem(item.id, { price: Number(e.target.value) })} placeholder="18000" />
                </FormField>
                <FormField label="Subtotal">
                  <div className="flex h-11 items-center rounded-2xl bg-sage-50 px-4 text-sm font-semibold text-sage-900 dark:bg-sage-400/10 dark:text-sage-100">
                    {formatCurrency(item.subtotal)}
                  </div>
                </FormField>
              </div>
            </div>
          ))}
        </div>
      </FormSection>

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <Button type="button" variant="secondary" onClick={() => setItems((rows) => [...rows, emptyItem()])}><Plus className="h-4 w-4" /> Tambah item</Button>
        <div className="rounded-2xl bg-sage-600 px-4 py-3 text-right text-white shadow-soft">Total modal: <strong>{formatCurrency(total)}</strong></div>
      </div>
      <Button type="button" className="w-full" onClick={submit}>Simpan modal</Button>
    </div>
  );
}
