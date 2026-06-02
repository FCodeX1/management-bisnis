'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { FloatingActionButton, MobileNav } from './mobile-nav';
import { useAuthStore } from '@/store/auth-store';

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login');
  }, [isAuthenticated, router, pathname]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="min-w-0 flex-1 px-4 pb-32 sm:px-6 lg:px-8 lg:pb-8">
        <Topbar />
        {children}
      </main>
      <FloatingActionButton />
      <MobileNav />
    </div>
  );
}
