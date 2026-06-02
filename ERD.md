# ERD Manajemen Bisnis

```mermaid
erDiagram
  users ||--o{ businesses : owns
  businesses ||--o{ products : has
  businesses ||--o{ capital_records : records
  businesses ||--o{ sales_records : records
  businesses ||--o{ sale_locations : has
  businesses ||--o{ stock_movements : tracks
  businesses ||--o{ reports : generates
  businesses ||--o{ notifications : sends
  businesses ||--o{ activity_logs : logs
  products ||--o{ product_variants : has
  products ||--o{ sales_records : sold_as
  sale_locations ||--o{ sales_records : records_at
  products ||--o{ stock_movements : moves
  users ||--o{ activity_logs : performs
```

## Relasi utama

- `users` menyimpan profil owner/staff.
- `businesses` adalah tenant bisnis; semua data operasional terkait ke bisnis.
- `products` dan `product_variants` menyimpan master produk, harga modal, harga jual, margin, stok.
- `capital_records` menyimpan pengeluaran/modal dan item pembelian.
- `sale_locations` menyimpan toko/outlet/channel penjualan, PIC, alamat, target omzet, jam operasional, status aktif, dan catatan harga.
- `sales_records` menyimpan transaksi penjualan, omzet, laba, lokasi/toko, dan bukti transaksi.
- `stock_movements` menjadi audit stok masuk/keluar/adjustment.
- `reports`, `notifications`, `activity_logs` untuk pelaporan, reminder, dan audit.
