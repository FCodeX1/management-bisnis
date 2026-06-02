# Deployment Guide

## Vercel tanpa database

```bash
npm install
npm run build
```

Upload repository ke GitHub lalu import ke Vercel. Aplikasi akan berjalan memakai browser storage.

## Vercel dengan Supabase + Prisma

1. Buat project Supabase.
2. Ambil `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Isi environment variable di Vercel.
4. Jalankan migrasi dari lokal:

```bash
npx prisma generate
npx prisma migrate deploy
npm run db:seed
```

## Netlify

Gunakan Next.js runtime Netlify. Jika build bermasalah karena mode standalone, hapus `output` dari `next.config.mjs`.

## Security Checklist

- Jangan expose `SUPABASE_SERVICE_ROLE_KEY` ke client.
- Aktifkan Row Level Security di Supabase.
- Gunakan HTTPS.
- Validasi semua form dengan Zod.
- Batasi upload gambar di Supabase Storage.
- Gunakan audit log untuk mutasi penting.
