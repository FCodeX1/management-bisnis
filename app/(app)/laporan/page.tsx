'use client';

import { Download, FileText, Printer } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useBusinessData } from '@/hooks/use-business';
import { getBusinessMetrics } from '@/lib/analytics';
import { formatCurrency } from '@/lib/currency';
import { exportCsv } from '@/lib/export';

export default function ReportsPage() {
  const { business, products, capitals, sales } = useBusinessData();
  const metrics = getBusinessMetrics({ business, products, capitals, sales });
  const rows = sales.map((sale) => ({ tanggal: sale.soldAt.slice(0, 10), lokasi: sale.locationName, qty: sale.soldQty, omzet: sale.revenue, laba: sale.profit }));

  return (
    <div>
      <PageHeader title="Laporan" description="Export CSV, print laporan, dan ringkasan performa bisnis." action={<div className="flex gap-2"><Button variant="secondary" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print</Button><Button onClick={() => exportCsv('laporan-penjualan.csv', rows)}><Download className="h-4 w-4" /> CSV</Button></div>} />
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
