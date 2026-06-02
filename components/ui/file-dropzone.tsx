'use client';

import { UploadCloud, X } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface FileDropzoneProps {
  label: string;
  description?: string;
  value?: string;
  accept?: string;
  onChange: (file?: File) => void;
  onClear?: () => void;
}

export function FileDropzone({ label, description, value, accept = 'image/*', onChange, onClear }: FileDropzoneProps) {
  return (
    <div className="space-y-2">
      <label className="relative flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-3xl border border-dashed border-sage-300 bg-white/65 p-4 text-center transition hover:border-sage-500 hover:bg-sage-50/70 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/[0.14]">
        {value ? (
          <div className="flex w-full items-center gap-3 text-left">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-slate-100 dark:bg-white/10">
              <Image src={value} alt={label} fill className="object-cover" unoptimized />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-sage-800 dark:text-sage-100">File siap digunakan</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Klik area ini untuk mengganti gambar.</p>
            </div>
          </div>
        ) : (
          <>
            <UploadCloud className="h-6 w-6 text-sage-700 dark:text-sage-200" />
            <div>
              <p className="text-sm font-semibold text-sage-800 dark:text-sage-100">{label}</p>
              {description ? <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</p> : null}
            </div>
          </>
        )}
        <input className="hidden" type="file" accept={accept} onChange={(e) => onChange(e.target.files?.[0])} />
      </label>
      {value && onClear ? (
        <Button type="button" variant="ghost" size="sm" onClick={onClear} className="w-full">
          <X className="h-4 w-4" /> Hapus gambar
        </Button>
      ) : null}
    </div>
  );
}
