'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import type { Business, CapitalItem, CapitalRecord, NotificationItem, Product, SaleLocation, SalesRecord, StockMovement } from '@/types';
import { seedBusinesses, seedCapitals, seedLocations, seedMovements, seedNotifications, seedProducts, seedSales } from '@/data/seed';
import { createSku, uid } from '@/lib/id';

interface AppState {
  businesses: Business[];
  activeBusinessId: string;
  products: Product[];
  capitals: CapitalRecord[];
  sales: SalesRecord[];
  locations: SaleLocation[];
  stockMovements: StockMovement[];
  notifications: NotificationItem[];
  hydrated: boolean;
  setHydrated: () => void;
  switchBusiness: (id: string) => void;
  addBusiness: (data: Omit<Business, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBusiness: (id: string, data: Partial<Business>) => void;
  deleteBusiness: (id: string) => void;
  addProduct: (data: Omit<Product, 'id' | 'sku' | 'variants' | 'createdAt' | 'updatedAt'> & { sku?: string }) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCapital: (data: { title: string; category: string; items: CapitalItem[]; noteUrl?: string; recordedAt: string }) => void;
  updateCapital: (id: string, data: Partial<CapitalRecord>) => void;
  deleteCapital: (id: string) => void;
  addSale: (data: { productId: string; locationName: string; productionQty: number; soldQty: number; unitPrice: number; proofUrl?: string; soldAt: string }) => void;
  updateSale: (id: string, data: Partial<SalesRecord>) => void;
  deleteSale: (id: string) => void;
  adjustStock: (productId: string, qty: number, note: string) => void;
  markNotificationRead: (id: string) => void;
  resetDemo: () => void;
}

const now = () => new Date().toISOString();
const active = <T extends { businessId: string; deletedAt?: string | null }>(rows: T[], businessId: string) => rows.filter((row) => row.businessId === businessId && !row.deletedAt);

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      businesses: seedBusinesses,
      activeBusinessId: seedBusinesses[0].id,
      products: seedProducts,
      capitals: seedCapitals,
      sales: seedSales,
      locations: seedLocations,
      stockMovements: seedMovements,
      notifications: seedNotifications,
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      switchBusiness: (id) => set({ activeBusinessId: id }),
      addBusiness: (data) => {
        const business: Business = { ...data, id: uid('biz'), createdAt: now(), updatedAt: now() };
        set((state) => ({ businesses: [business, ...state.businesses], activeBusinessId: business.id }));
        toast.success('Bisnis berhasil dibuat');
      },
      updateBusiness: (id, data) => set((state) => ({
        businesses: state.businesses.map((item) => item.id === id ? { ...item, ...data, updatedAt: now() } : item)
      })),
      deleteBusiness: (id) => set((state) => ({
        businesses: state.businesses.map((item) => item.id === id ? { ...item, deletedAt: now() } : item),
        activeBusinessId: state.activeBusinessId === id ? state.businesses.find((item) => item.id !== id && !item.deletedAt)?.id || '' : state.activeBusinessId
      })),
      addProduct: (data) => {
        const count = active(get().products, data.businessId).length + 1;
        const product: Product = {
          ...data,
          id: uid('prd'),
          sku: data.sku || createSku(data.name, count),
          variants: [],
          createdAt: now(),
          updatedAt: now()
        };
        set((state) => ({ products: [product, ...state.products] }));
        toast.success('Produk berhasil ditambahkan');
      },
      updateProduct: (id, data) => set((state) => ({ products: state.products.map((item) => item.id === id ? { ...item, ...data, updatedAt: now() } : item) })),
      deleteProduct: (id) => set((state) => ({ products: state.products.map((item) => item.id === id ? { ...item, deletedAt: now() } : item) })),
      addCapital: ({ title, category, items, noteUrl, recordedAt }) => {
        const businessId = get().activeBusinessId;
        const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
        const capital: CapitalRecord = { id: uid('cap'), businessId, title, category, items, noteUrl, totalAmount, recordedAt, createdAt: now(), updatedAt: now() };
        set((state) => ({ capitals: [capital, ...state.capitals] }));
        toast.success('Catatan modal tersimpan');
      },
      updateCapital: (id, data) => set((state) => ({ capitals: state.capitals.map((item) => item.id === id ? { ...item, ...data, updatedAt: now() } : item) })),
      deleteCapital: (id) => set((state) => ({ capitals: state.capitals.map((item) => item.id === id ? { ...item, deletedAt: now() } : item) })),
      addSale: ({ productId, locationName, productionQty, soldQty, unitPrice, proofUrl, soldAt }) => {
        const state = get();
        const product = state.products.find((item) => item.id === productId);
        if (!product) return toast.error('Produk tidak ditemukan');
        if (soldQty > product.stock + productionQty) return toast.error('Stok tidak cukup untuk jumlah terjual');
        const businessId = state.activeBusinessId;
        const revenue = soldQty * unitPrice;
        const cost = soldQty * product.costPrice;
        const sale: SalesRecord = {
          id: uid('sale'), businessId, productId, locationName, productionQty, soldQty,
          remainingQty: Math.max(productionQty - soldQty, 0), unitPrice, revenue, cost, profit: revenue - cost,
          proofUrl, soldAt, createdAt: now(), updatedAt: now()
        };
        const movement: StockMovement = { id: uid('mov'), businessId, productId, type: 'OUT', qty: soldQty, note: `Penjualan ${locationName}`, refType: 'sale', refId: sale.id, createdAt: now() };
        set((s) => ({
          sales: [sale, ...s.sales],
          stockMovements: [movement, ...s.stockMovements],
          products: s.products.map((item) => item.id === productId ? { ...item, stock: item.stock + productionQty - soldQty, updatedAt: now() } : item),
          notifications: product.stock + productionQty - soldQty <= product.minStock ? [{ id: uid('notif'), businessId, title: `Stok ${product.name} hampir habis`, message: 'Produk berada di bawah batas minimum stok.', type: 'stock', isRead: false, createdAt: now() }, ...s.notifications] : s.notifications
        }));
        toast.success('Penjualan berhasil dicatat');
      },
      updateSale: (id, data) => set((state) => ({ sales: state.sales.map((item) => item.id === id ? { ...item, ...data, updatedAt: now() } : item) })),
      deleteSale: (id) => set((state) => ({ sales: state.sales.map((item) => item.id === id ? { ...item, deletedAt: now() } : item) })),
      adjustStock: (productId, qty, note) => {
        const businessId = get().activeBusinessId;
        const movement: StockMovement = { id: uid('mov'), businessId, productId, type: 'ADJUSTMENT', qty, note, createdAt: now() };
        set((state) => ({
          stockMovements: [movement, ...state.stockMovements],
          products: state.products.map((item) => item.id === productId ? { ...item, stock: Math.max(0, item.stock + qty), updatedAt: now() } : item)
        }));
        toast.success('Stok berhasil disesuaikan');
      },
      markNotificationRead: (id) => set((state) => ({ notifications: state.notifications.map((item) => item.id === id ? { ...item, isRead: true } : item) })),
      resetDemo: () => set({ businesses: seedBusinesses, activeBusinessId: seedBusinesses[0].id, products: seedProducts, capitals: seedCapitals, sales: seedSales, locations: seedLocations, stockMovements: seedMovements, notifications: seedNotifications })
    }),
    {
      name: 'mb-app-v1',
      onRehydrateStorage: () => (state) => state?.setHydrated()
    }
  )
);
