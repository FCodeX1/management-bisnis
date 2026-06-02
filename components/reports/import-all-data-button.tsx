'use client';

import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { parseAllDataExcelFile } from '@/lib/import';
import { useAppStore } from '@/store/app-store';
import { useAuthStore } from '@/store/auth-store';

export function ImportAllDataButton({ variant = 'outline' }: { variant?: 'default' | 'secondary' | 'outline' | 'ghost' }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const replaceAllData = useAppStore((state) => state.replaceAllData);
  const setUserFromImport = useAuthStore((state) => state.setUserFromImport);

  async function handleFile(file?: File) {
    if (!file) return;

    const approved = window.confirm(
      'Import akan mengganti semua data lokal di browser ini dengan isi file Excel. Pastikan file berasal dari Export Semua Data atau format sheet-nya sama. Lanjutkan?'
    );
    if (!approved) {
      if (inputRef.current) inputRef.current.value = '';
      return;
    }

    setIsImporting(true);
    try {
      const result = await parseAllDataExcelFile(file);
      const totalRows = result.stats.businesses + result.stats.locations + result.stats.products + result.stats.capitals + result.stats.sales + result.stats.stockMovements + result.stats.notifications;

      if (!totalRows) {
        toast.error('File berhasil dibaca, tapi tidak ada data bisnis/produk/transaksi yang bisa diimport.');
        return;
      }

      replaceAllData(result.payload);
      if (result.payload.user) setUserFromImport(result.payload.user);

      toast.success(`Pakai Data Sendiri berhasil: ${result.stats.businesses} bisnis, ${result.stats.locations} toko, ${result.stats.products} produk, ${result.stats.sales} penjualan.`);
      if (result.warnings.length) {
        toast.info(`${result.warnings.length} catatan import: sebagian relasi dibuat otomatis. Cek data setelah import.`);
        console.info('Catatan import Manajemen Bisnis:', result.warnings);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'File tidak bisa diimport.';
      toast.error(message);
    } finally {
      setIsImporting(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".xls,.xml,application/vnd.ms-excel,text/xml,application/xml"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
      <Button
        type="button"
        variant={variant}
        onClick={() => inputRef.current?.click()}
        disabled={isImporting}
        title="Import file Excel hasil Export Semua Data agar data pribadi tampil di aplikasi"
      >
        <Upload className="h-4 w-4" />
        {isImporting ? 'Mengimport...' : 'Pakai Data Sendiri'}
      </Button>
    </>
  );
}
