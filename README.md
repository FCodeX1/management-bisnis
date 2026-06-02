# Manajemen Bisnis

Aplikasi website modern untuk mencatat modal, penjualan, laba, stok, dan analitik bisnis UMKM. Versi ini dibuat **local-first** agar bisa langsung berjalan di Vercel/Netlify tanpa database wajib. Struktur database Supabase/PostgreSQL + Prisma tetap disiapkan untuk migrasi ke backend penuh.

## Fitur aktif

- Auth lokal untuk demo: login, register, forgot password.
- Multi business dan switch bisnis cepat.
- Manajemen toko/lokasi: tambah, edit, nonaktif, target omzet, PIC, alamat, jam operasional, dan catatan harga.
- Dashboard KPI: penjualan, modal, laba, profit %, stok rendah, trend.
- Manajemen modal dengan multi item dan upload nota berbasis browser storage.
- Manajemen penjualan multi toko/lokasi, auto omzet, laba, sisa produksi, dan pengurangan stok.
- Master produk, SKU otomatis, margin otomatis, foto produk, minimum stock warning.
- Stok realtime dari produk + pergerakan stok.
- Analitik dengan grafik Recharts.
- Laporan export Excel semua data, export CSV penjualan aktif, dan print browser.
- Notifikasi, profil, pengaturan, dark mode.
- PWA manifest + service worker sederhana.
- Clean architecture: domain, services, repositories, hooks, components, utils, types.

## Mode data

Default menggunakan Zustand persist + localStorage agar deploy cepat tanpa konfigurasi database. Untuk production multi user, aktifkan Supabase/PostgreSQL dan Prisma sesuai `prisma/schema.prisma`.

## Jalankan lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

Akun demo bebas dibuat lewat Register. Data seed otomatis tersedia saat aplikasi pertama dibuka.

## Deploy Vercel

1. Push project ke GitHub.
2. Import repository ke Vercel.
3. Build command: `npm run build`.
4. Output default Next.js.
5. Tambahkan environment variables dari `.env.example` jika memakai Supabase.

## Deploy Netlify

1. Install plugin Next.js jika belum otomatis.
2. Build command: `npm run build`.
3. Publish directory: `.next`.
4. Tambahkan environment variables jika memakai Supabase.

## Catatan AI/OCR

Sesuai permintaan: **AI Agent belum dipasang**. Halaman analitik dan insight memakai rule-based business insight yang berjalan lokal. OCR nota asli butuh layanan OCR/AI tambahan; form modal sudah mendukung upload nota dan siap disambungkan ke endpoint OCR.


## Struktur folder

```txt
app/                 Next.js App Router pages, termasuk dashboard, bisnis, toko, modal, penjualan, stok, dan API routes
components/app/      Layout SaaS, sidebar, bottom nav, topbar
components/forms/    Form bisnis, toko/lokasi, produk, modal, penjualan
components/ui/       shadcn-style reusable UI components
components/dashboard/Chart dan KPI cards
data/                Dummy seed local-first
hooks/               Hook UX mobile, business data, infinite list, swipe
lib/                 Utils, analytics, currency, validation, Supabase/Prisma client
store/               Zustand state management
services/            Business logic service layer
repositories/        Local/Supabase-ready data access helpers
domain/              Business rules murni
prisma/              Database schema dan seed production
public/              PWA manifest, service worker, icons
types/               TypeScript domain types
```


## Update versi toko & form rapi

- Halaman baru: `/toko` untuk mengelola toko, outlet, marketplace, reseller, dan bazaar.
- Form bisnis, produk, modal, penjualan, dan stok sudah memakai label, deskripsi/keterangan, validasi, dan guard sederhana agar input lebih minim bug.
- Dialog tambah data otomatis tertutup setelah data berhasil disimpan.
- Persist lokal naik ke `mb-app-v2` agar struktur toko baru tidak bentrok dengan cache versi lama.
- Penjualan sekarang bisa memilih toko/lokasi dari master toko atau input manual jika lokasinya belum terdaftar.
- Schema Prisma `sale_locations` sudah ditambah field `phone`, `managerName`, `openingHours`, `targetDailyRevenue`, dan `isActive`.

## Update export Excel semua data

- Tombol **Export Semua Data** tersedia di halaman `/laporan` dan `/pengaturan`.
- File yang diunduh berbentuk Excel-compatible `.xls` agar bisa langsung dibuka di Microsoft Excel, LibreOffice, atau diimpor ke Google Sheets.
- Isi workbook: Ringkasan, Keterangan, User, Bisnis, Toko Lokasi, Produk, Modal, Detail Item Modal, Penjualan, Riwayat Stok, dan Notifikasi.
- Export mengambil semua data lokal dari browser/device yang sedang dipakai, termasuk data multi bisnis.
- File ini adalah backup manual. Untuk data permanen multi-device, gunakan Supabase/PostgreSQL.

## Update mobile sidebar

- Sidebar desktop tetap tampil di layar besar.
- Di mobile, sidebar tersedia sebagai drawer dari tombol menu hamburger di topbar kiri.
- Bottom navigation tetap ada sebagai shortcut cepat untuk halaman yang paling sering dipakai.
