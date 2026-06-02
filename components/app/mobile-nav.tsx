'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Home, Package, Plus, ShoppingBag, WalletCards } from 'lucide-react';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/modal', label: 'Modal', icon: WalletCards },
  { href: '/penjualan', label: 'Jual', icon: ShoppingBag },
  { href: '/produk', label: 'Produk', icon: Package },
  { href: '/analitik', label: 'Grafik', icon: BarChart3 }
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <div className="safe-bottom fixed inset-x-3 bottom-3 z-40 rounded-[2rem] border border-white/70 bg-white/82 p-2 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/82 lg:hidden">
      <div className="grid grid-cols-5 gap-1">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={cn('flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition', active ? 'bg-sage-600 text-white' : 'text-slate-500 dark:text-slate-400')}>
              <Icon className="h-4 w-4" /> {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function FloatingActionButton() {
  return (
    <Link href="/penjualan" className="fixed bottom-24 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-sage-600 text-white shadow-glass transition active:scale-95 lg:hidden" aria-label="Tambah penjualan">
      <Plus className="h-6 w-6" />
    </Link>
  );
}
