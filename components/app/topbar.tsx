'use client';

import Link from 'next/link';
import { Moon, Search, Sun, UserRound } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuthStore } from '@/store/auth-store';
import { useBusinessData } from '@/hooks/use-business';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuthStore();
  const { businesses, activeBusinessId, switchBusiness } = useBusinessData();
  const activeBusinesses = businesses.filter((item) => !item.deletedAt);

  return (
    <header className="sticky top-0 z-30 -mx-4 mb-6 border-b border-white/50 bg-bone/70 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="flex items-center gap-3">
        <div className="hidden min-w-0 flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-white/65 px-4 py-2 dark:border-white/10 dark:bg-white/10 md:flex">
          <Search className="h-4 w-4 text-slate-400" />
          <input className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" placeholder="Cari penjualan, produk, modal..." />
        </div>
        <div className="min-w-0 flex-1 md:max-w-xs">
          <Select value={activeBusinessId} onChange={(e) => switchBusiness(e.target.value)} aria-label="Pilih bisnis">
            {activeBusinesses.map((business) => <option key={business.id} value={business.id}>{business.name}</option>)}
          </Select>
        </div>
        <Button variant="secondary" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle dark mode">
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
  );
}
