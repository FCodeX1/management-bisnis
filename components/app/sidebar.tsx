'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Bell, Boxes, Building2, FileText, Home, LineChart, Package, Settings, ShoppingBag, WalletCards } from 'lucide-react';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/bisnis', label: 'Bisnis', icon: Building2 },
  { href: '/modal', label: 'Modal', icon: WalletCards },
  { href: '/penjualan', label: 'Penjualan', icon: ShoppingBag },
  { href: '/produk', label: 'Produk', icon: Package },
  { href: '/stok', label: 'Stok', icon: Boxes },
  { href: '/analitik', label: 'Analitik', icon: LineChart },
  { href: '/laporan', label: 'Laporan', icon: FileText },
  { href: '/notifikasi', label: 'Notifikasi', icon: Bell },
  { href: '/pengaturan', label: 'Pengaturan', icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-white/60 bg-white/45 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03] lg:block">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sage-600 text-white shadow-soft"><BarChart3 className="h-5 w-5" /></div>
        <div>
          <p className="font-semibold tracking-tight">Manajemen Bisnis</p>
          <p className="text-xs text-slate-500">UMKM SaaS Dashboard</p>
        </div>
      </div>
      <nav className="space-y-1">
        {nav.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={cn('flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition', active ? 'bg-sage-600 text-white shadow-soft' : 'text-slate-600 hover:bg-white/70 dark:text-slate-300 dark:hover:bg-white/10')}>
              <Icon className="h-4 w-4" /> {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
