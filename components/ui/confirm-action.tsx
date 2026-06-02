'use client';

import { ReactNode, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from './dialog';
import { Button } from './button';

export function ConfirmAction({ children, title = 'Konfirmasi aksi', description = 'Aksi ini akan memproses perubahan data.', onConfirm, danger }: { children: ReactNode; title?: string; description?: string; onConfirm: () => void; danger?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader title={title} description={description} />
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)}>Batal</Button>
          <Button variant={danger ? 'danger' : 'default'} onClick={() => { onConfirm(); setOpen(false); }}>Ya, lanjutkan</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
