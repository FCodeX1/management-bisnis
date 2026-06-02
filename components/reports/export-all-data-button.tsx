'use client';

import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { exportAllDataExcel, getFullExportCount } from '@/lib/export';
import { useAppStore } from '@/store/app-store';
import { useAuthStore } from '@/store/auth-store';

export function ExportAllDataButton({ variant = 'default' }: { variant?: 'default' | 'secondary' | 'outline' | 'ghost' }) {
  const user = useAuthStore((state) => state.user);
  const businesses = useAppStore((state) => state.businesses);
  const locations = useAppStore((state) => state.locations);
  const products = useAppStore((state) => state.products);
  const capitals = useAppStore((state) => state.capitals);
  const sales = useAppStore((state) => state.sales);
  const stockMovements = useAppStore((state) => state.stockMovements);
  const notifications = useAppStore((state) => state.notifications);

  const exportData = { user, businesses, locations, products, capitals, sales, stockMovements, notifications };
  const totalRows = getFullExportCount(exportData);

  return (
    <Button
      variant={variant}
      onClick={() => {
        const filename = exportAllDataExcel(exportData);
        toast.success(`Export Excel berhasil: ${filename}`);
      }}
      disabled={totalRows === 0}
      title="Download semua data lokal ke file Excel"
    >
      <Download className="h-4 w-4" />
      Export Semua Data
    </Button>
  );
}
