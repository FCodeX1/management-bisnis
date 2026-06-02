import { z } from 'zod';

export const authSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter')
});

export const businessSchema = z.object({
  name: z.string().min(2, 'Nama bisnis wajib diisi'),
  category: z.string().min(2, 'Kategori wajib diisi'),
  description: z.string().optional(),
  address: z.string().optional(),
  currency: z.string().default('IDR')
});

export const productSchema = z.object({
  name: z.string().min(2, 'Nama produk wajib diisi'),
  category: z.string().min(2, 'Kategori wajib diisi'),
  baseUnit: z.string().min(1),
  costPrice: z.coerce.number().min(0),
  sellingPrice: z.coerce.number().min(0),
  minStock: z.coerce.number().min(0),
  stock: z.coerce.number().min(0),
  barcode: z.string().optional()
});

export const saleSchema = z.object({
  productId: z.string().min(1, 'Produk wajib dipilih'),
  locationName: z.string().min(2, 'Lokasi wajib diisi'),
  productionQty: z.coerce.number().min(0),
  soldQty: z.coerce.number().min(1, 'Jumlah terjual minimal 1'),
  unitPrice: z.coerce.number().min(0),
  soldAt: z.string().min(1)
});
