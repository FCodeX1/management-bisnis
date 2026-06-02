'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Bell, Boxes, Building2, FileText, Home, LineChart, Package, Settings, ShoppingBag, Store, WalletCards } from 'lucide-react';
import { cn } from '@/lib/utils';

export const appNavItems = [
  { href: '/dashboard', label: 'Dashboard', description: 'Ringkasan bisnis', icon: Home },
  { href: '/bisnis', label: 'Bisnis', description: 'Kelola multi bisnis', icon: Building2 },
  { href: '/toko', label: 'Toko', description: 'Outlet dan lokasi jual', icon: Store },
  { href: '/modal', label: 'Modal', description: 'Catatan modal & biaya', icon: WalletCards },
  { href: '/penjualan', label: 'Penjualan', description: 'Transaksi dan omzet', icon: ShoppingBag },
  { href: '/produk', label: 'Produk', description: 'Produk, SKU, harga', icon: Package },
  { href: '/stok', label: 'Stok', description: 'Realtime stok barang', icon: Boxes },
  { href: '/analitik', label: 'Analitik', description: 'Grafik dan insight', icon: LineChart },
  { href: '/laporan', label: 'Laporan', description: 'Export dan print', icon: FileText },
  { href: '/notifikasi', label: 'Notifikasi', description: 'Peringatan bisnis', icon: Bell },
  { href: '/pengaturan', label: 'Pengaturan', description: 'Preferensi aplikasi', icon: Settings }
];

export function SidebarBrand() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sage-600 text-white shadow-soft">
        <BarChart3 className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="truncate font-semibold tracking-tight">Manajemen Bisnis</p>
        <p className="truncate text-xs text-slate-500">UMKM SaaS Dashboard</p>
      </div>
    </div>
  );
}

export function SidebarNavigation({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1" aria-label="Navigasi utama">
      {appNavItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition active:scale-[0.99]',
              active
                ? 'bg-sage-600 text-white shadow-soft'
                : 'text-slate-600 hover:bg-white/70 dark:text-slate-300 dark:hover:bg-white/10'
            )}
            aria-current={active ? 'page' : undefined}
          >
            <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition', active ? 'bg-white/15' : 'bg-slate-100 text-slate-500 group-hover:bg-white dark:bg-white/10 dark:text-slate-300')}>
              <Icon className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block truncate">{item.label}</span>
              <span className={cn('block truncate text-[11px] font-normal', active ? 'text-white/75' : 'text-slate-400 dark:text-slate-500')}>
                {item.description}
              </span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-white/60 bg-white/45 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03] lg:block">
      <div className="mb-8">
        <SidebarBrand />
      </div>
      <SidebarNavigation />
    </aside>
  );
}
