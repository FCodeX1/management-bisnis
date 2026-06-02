'use client';

import { FileText, Printer } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useBusinessData } from '@/hooks/use-business';
import { getBusinessMetrics } from '@/lib/analytics';
import { formatCurrency } from '@/lib/currency';
import { exportCsv } from '@/lib/export';
import { ExportAllDataButton } from '@/components/reports/export-all-data-button';
import { ImportAllDataButton } from '@/components/reports/import-all-data-button';

export default function ReportsPage() {
  const { business, products, capitals, sales } = useBusinessData();
  const metrics = getBusinessMetrics({ business, products, capitals, sales });
  const rows = sales.map((sale) => ({ tanggal: sale.soldAt.slice(0, 10), lokasi: sale.locationName, qty: sale.soldQty, omzet: sale.revenue, laba: sale.profit }));

  return (
    <div>
      <PageHeader
        title="Laporan"
        description="Export Excel, import Pakai Data Sendiri, CSV penjualan aktif, print laporan, dan ringkasan performa bisnis."
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print</Button>
            <Button variant="secondary" onClick={() => exportCsv('laporan-penjualan.csv', rows)}>CSV Penjualan</Button>
            <ExportAllDataButton />
            <ImportAllDataButton />
          </div>
        }
      />
      <Card className="mb-5 border-sage-200/70 bg-sage-50/70 dark:border-white/10 dark:bg-sage-400/10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-slate-950 dark:text-white">Backup spreadsheet lengkap</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Tombol Export Semua Data akan mengunduh file Excel berisi sheet Ringkasan, Keterangan, User, Bisnis, Toko, Produk, Modal, Detail Item Modal, Penjualan, Riwayat Stok, dan Notifikasi. Tombol Pakai Data Sendiri bisa mengimport lagi file dengan format sama agar data di Excel tampil di aplikasi.
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Catatan: import akan mengganti data lokal pada browser ini. Edit isi kolom, jangan ubah nama sheet dan header agar terbaca benar.</p>
          </div>
          <div className="flex flex-wrap gap-2"><ExportAllDataButton variant="secondary" /><ImportAllDataButton variant="outline" /></div>
        </div>
      </Card>

      <Card className="print-card">
        <div className="mb-6 flex items-center gap-3"><div className="rounded-2xl bg-sage-100 p-3 text-sage-700"><FileText className="h-5 w-5" /></div><div><h2 className="text-xl font-semibold">Laporan {business?.name}</h2><p className="text-sm text-slate-500">Ringkasan otomatis dari data lokal.</p></div></div>
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="rounded-2xl bg-white/60 p-4 dark:bg-white/10"><p className="text-xs text-slate-500">Penjualan</p><p className="text-lg font-semibold">{formatCurrency(metrics.totalSales)}</p></div>
          <div className="rounded-2xl bg-white/60 p-4 dark:bg-white/10"><p className="text-xs text-slate-500">Modal</p><p className="text-lg font-semibold">{formatCurrency(metrics.totalCapital)}</p></div>
          <div className="rounded-2xl bg-white/60 p-4 dark:bg-white/10"><p className="text-xs text-slate-500">Laba</p><p className="text-lg font-semibold">{formatCurrency(metrics.totalProfit)}</p></div>
          <div className="rounded-2xl bg-white/60 p-4 dark:bg-white/10"><p className="text-xs text-slate-500">Profit %</p><p className="text-lg font-semibold">{metrics.profitPercentage.toFixed(1)}%</p></div>
        </div>
        <div className="mt-6 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-slate-200 dark:border-white/10"><th className="py-3">Tanggal</th><th>Lokasi</th><th>Qty</th><th>Omzet</th><th>Laba</th></tr></thead><tbody>{rows.map((row, index) => <tr key={index} className="border-b border-slate-100 dark:border-white/10"><td className="py-3">{row.tanggal}</td><td>{row.lokasi}</td><td>{row.qty}</td><td>{formatCurrency(row.omzet)}</td><td>{formatCurrency(row.laba)}</td></tr>)}</tbody></table></div>
      </Card>
    </div>
  );
}
