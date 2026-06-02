import type { Business, CapitalRecord, NotificationItem, Product, SaleLocation, SalesRecord, StockMovement, UserProfile } from '@/types';
import { uid } from '@/lib/id';

const now = new Date();
const day = (n: number) => new Date(now.getTime() - n * 86400000).toISOString();

export const demoUser: UserProfile = {
  id: 'user_demo',
  name: 'Owner UMKM',
  email: 'owner@demo.com',
  role: 'OWNER'
};

export const seedBusinesses: Business[] = [
  {
    id: 'biz_sage',
    name: 'Kedai Sage UMKM',
    category: 'Food & Beverage',
    description: 'Kedai minuman dan snack premium minimalis.',
    address: 'Jakarta Selatan',
    currency: 'IDR',
    logoUrl: '',
    createdAt: day(20),
    updatedAt: day(1)
  },
  {
    id: 'biz_craft',
    name: 'Craft Linen Studio',
    category: 'Fashion',
    description: 'Produk linen handmade skala rumahan.',
    address: 'Bandung',
    currency: 'IDR',
    logoUrl: '',
    createdAt: day(12),
    updatedAt: day(2)
  }
];

export const seedProducts: Product[] = [
  { id: 'prd_kopi', businessId: 'biz_sage', name: 'Kopi Susu Sage', sku: 'KOP-SAG-001', category: 'Minuman', baseUnit: 'pcs', costPrice: 9000, sellingPrice: 18000, minStock: 15, stock: 80, variants: [], createdAt: day(20), updatedAt: day(1) },
  { id: 'prd_brownies', businessId: 'biz_sage', name: 'Brownies Mini', sku: 'BRW-MIN-001', category: 'Snack', baseUnit: 'pcs', costPrice: 7000, sellingPrice: 15000, minStock: 10, stock: 34, variants: [], createdAt: day(18), updatedAt: day(1) },
  { id: 'prd_matcha', businessId: 'biz_sage', name: 'Matcha Latte', sku: 'MAT-LAT-001', category: 'Minuman', baseUnit: 'pcs', costPrice: 11000, sellingPrice: 22000, minStock: 12, stock: 11, variants: [], createdAt: day(15), updatedAt: day(1) },
  { id: 'prd_totebag', businessId: 'biz_craft', name: 'Totebag Linen', sku: 'TOT-LIN-001', category: 'Fashion', baseUnit: 'pcs', costPrice: 32000, sellingPrice: 75000, minStock: 8, stock: 27, variants: [], createdAt: day(10), updatedAt: day(2) }
];

export const seedLocations: SaleLocation[] = [
  { id: 'loc_online', businessId: 'biz_sage', name: 'Online', address: 'Instagram & WhatsApp', phone: '0812-0000-1111', managerName: 'Admin Online', priceNote: 'Harga online bisa menyesuaikan biaya platform.', openingHours: '09:00 - 22:00', targetDailyRevenue: 750000, isActive: true, createdAt: day(20), updatedAt: day(1) },
  { id: 'loc_store', businessId: 'biz_sage', name: 'Toko utama', address: 'Jakarta Selatan', phone: '0812-0000-2222', managerName: 'Kasir Utama', priceNote: 'Harga outlet mengikuti harga normal.', openingHours: '08:00 - 21:00', targetDailyRevenue: 1000000, isActive: true, createdAt: day(20), updatedAt: day(1) },
  { id: 'loc_bazaar', businessId: 'biz_sage', name: 'Bazaar', address: 'Event weekend', phone: '', managerName: 'Tim Event', priceNote: 'Harga bazaar bisa lebih tinggi karena biaya booth.', openingHours: '10:00 - 23:00', targetDailyRevenue: 1500000, isActive: true, createdAt: day(15), updatedAt: day(1) }
];

export const seedCapitals: CapitalRecord[] = [
  {
    id: 'cap_1', businessId: 'biz_sage', title: 'Belanja bahan baku minggu 1', category: 'Bahan baku', totalAmount: 875000,
    items: [
      { id: uid('item'), name: 'Susu UHT', qty: 20, unit: 'liter', price: 18000, subtotal: 360000 },
      { id: uid('item'), name: 'Kopi blend', qty: 5, unit: 'kg', price: 65000, subtotal: 325000 },
      { id: uid('item'), name: 'Cup 16oz', qty: 10, unit: 'pack', price: 19000, subtotal: 190000 }
    ],
    recordedAt: day(8), createdAt: day(8), updatedAt: day(8)
  },
  {
    id: 'cap_2', businessId: 'biz_sage', title: 'Packaging dan label', category: 'Packaging', totalAmount: 320000,
    items: [{ id: uid('item'), name: 'Sticker label', qty: 4, unit: 'pack', price: 80000, subtotal: 320000 }],
    recordedAt: day(4), createdAt: day(4), updatedAt: day(4)
  }
];

export const seedSales: SalesRecord[] = [
  { id: 'sale_1', businessId: 'biz_sage', productId: 'prd_kopi', locationId: 'loc_store', locationName: 'Toko utama', productionQty: 30, soldQty: 25, remainingQty: 5, unitPrice: 18000, revenue: 450000, cost: 225000, profit: 225000, soldAt: day(6), createdAt: day(6), updatedAt: day(6) },
  { id: 'sale_2', businessId: 'biz_sage', productId: 'prd_brownies', locationId: 'loc_online', locationName: 'Online', productionQty: 24, soldQty: 20, remainingQty: 4, unitPrice: 15000, revenue: 300000, cost: 140000, profit: 160000, soldAt: day(5), createdAt: day(5), updatedAt: day(5) },
  { id: 'sale_3', businessId: 'biz_sage', productId: 'prd_matcha', locationId: 'loc_bazaar', locationName: 'Bazaar', productionQty: 25, soldQty: 18, remainingQty: 7, unitPrice: 22000, revenue: 396000, cost: 198000, profit: 198000, soldAt: day(3), createdAt: day(3), updatedAt: day(3) },
  { id: 'sale_4', businessId: 'biz_sage', productId: 'prd_kopi', locationId: 'loc_online', locationName: 'Online', productionQty: 40, soldQty: 32, remainingQty: 8, unitPrice: 19000, revenue: 608000, cost: 288000, profit: 320000, soldAt: day(1), createdAt: day(1), updatedAt: day(1) }
];

export const seedMovements: StockMovement[] = [
  { id: 'mov_1', businessId: 'biz_sage', productId: 'prd_kopi', type: 'OUT', qty: 25, note: 'Penjualan toko utama', refType: 'sale', refId: 'sale_1', createdAt: day(6) },
  { id: 'mov_2', businessId: 'biz_sage', productId: 'prd_brownies', type: 'OUT', qty: 20, note: 'Penjualan online', refType: 'sale', refId: 'sale_2', createdAt: day(5) }
];

export const seedNotifications: NotificationItem[] = [
  { id: 'notif_1', businessId: 'biz_sage', title: 'Stok Matcha hampir habis', message: 'Matcha Latte berada di bawah batas minimum stok.', type: 'stock', isRead: false, createdAt: day(1) },
  { id: 'notif_2', businessId: 'biz_sage', title: 'Target omzet tercapai', message: 'Omzet minggu ini melewati target awal.', type: 'target', isRead: false, createdAt: day(2) }
];
