'use client';

import { Bell } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { useBusinessData } from '@/hooks/use-business';
import { formatDate } from '@/lib/utils';

export default function NotificationsPage() {
  const { notifications, markNotificationRead } = useBusinessData();
  return (
    <div>
      <PageHeader title="Notifikasi" description="Stok hampir habis, profit turun, target tercapai, dan reminder harian." />
      {notifications.length ? <div className="space-y-3">{notifications.map((item) => <Card key={item.id} className="p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-2"><h3 className="font-semibold">{item.title}</h3>{!item.isRead ? <Badge>Baru</Badge> : null}</div><p className="mt-1 text-sm text-slate-500">{item.message}</p><p className="mt-1 text-xs text-slate-400">{formatDate(item.createdAt)}</p></div><Button variant="secondary" onClick={() => markNotificationRead(item.id)}>Tandai dibaca</Button></div></Card>)}</div> : <EmptyState icon={Bell} title="Belum ada notifikasi" description="Notifikasi otomatis akan muncul saat ada stok rendah atau target tercapai." />}
    </div>
  );
}
