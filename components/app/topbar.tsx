'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, Moon, Search, Sun, UserRound, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuthStore } from '@/store/auth-store';
import { useBusinessData } from '@/hooks/use-business';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { SidebarBrand, SidebarNavigation } from './sidebar';

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuthStore();
  const { businesses, activeBusinessId, switchBusiness } = useBusinessData();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const activeBusinesses = businesses.filter((item) => !item.deletedAt);

  useEffect(() => {
    document.body.style.overflow = mobileSidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileSidebarOpen]);

  return (
    <>
      <header className="sticky top-0 z-30 -mx-4 mb-6 border-b border-white/50 bg-bone/70 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Buka menu utama"
            aria-expanded={mobileSidebarOpen}
          >
            <Menu className="h-4 w-4" />
          </Button>

          <div className="hidden min-w-0 flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-white/65 px-4 py-2 dark:border-white/10 dark:bg-white/10 md:flex">
            <Search className="h-4 w-4 text-slate-400" />
            <input className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" placeholder="Cari penjualan, produk, modal..." />
          </div>

          <div className="min-w-0 flex-1 md:max-w-xs">
            <Select value={activeBusinessId} onChange={(e) => switchBusiness(e.target.value)} aria-label="Pilih bisnis aktif">
              {activeBusinesses.map((business) => <option key={business.id} value={business.id}>{business.name}</option>)}
            </Select>
          </div>

          <Button variant="secondary" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Ganti dark mode">
            <Sun className="hidden h-4 w-4 dark:block" />
            <Moon className="h-4 w-4 dark:hidden" />
          </Button>

          <Button asChild variant="secondary" size="icon" aria-label="Profil user">
            <Link href="/profil"><UserRound className="h-4 w-4" /></Link>
          </Button>

          <div className="hidden text-right md:block">
            <p className="text-sm font-semibold leading-none">{user?.name || 'Owner'}</p>
            <p className="mt-1 text-xs text-slate-500">{user?.role || 'OWNER'}</p>
          </div>
        </div>
      </header>

      {mobileSidebarOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu utama mobile">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
            aria-label="Tutup menu"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="relative flex h-full w-[86vw] max-w-[22rem] flex-col overflow-y-auto border-r border-white/70 bg-bone/95 p-5 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/95">
            <div className="mb-6 flex items-center justify-between gap-3">
              <SidebarBrand />
              <Button variant="secondary" size="icon" onClick={() => setMobileSidebarOpen(false)} aria-label="Tutup menu utama">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="mb-5 rounded-3xl border border-white/70 bg-white/60 p-4 shadow-soft dark:border-white/10 dark:bg-white/[0.05]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-700 dark:text-sage-300">Bisnis aktif</p>
              <p className="mt-1 truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                {activeBusinesses.find((item) => item.id === activeBusinessId)?.name || 'Belum ada bisnis'}
              </p>
              <p className="mt-1 text-xs text-slate-500">Pilih bisnis bisa lewat bagian atas halaman.</p>
            </div>

            <SidebarNavigation onNavigate={() => setMobileSidebarOpen(false)} />
          </aside>
        </div>
      ) : null}
    </>
  );
}
