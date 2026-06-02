import { BarChart3 } from 'lucide-react';

export function AuthCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage-600 text-white shadow-soft"><BarChart3 className="h-6 w-6" /></div>
          <div>
            <p className="text-lg font-semibold tracking-tight">Manajemen Bisnis</p>
            <p className="text-xs text-slate-500">UMKM premium dashboard</p>
          </div>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
