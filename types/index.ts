export type Role = 'OWNER' | 'ADMIN' | 'CASHIER' | 'STAFF';
export type Unit = 'kg' | 'gram' | 'pack' | 'pcs' | 'liter' | 'meter' | 'box' | 'botol' | 'porsi';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: Role;
}

export interface Business {
  id: string;
  name: string;
  logoUrl?: string;
  category: string;
  description?: string;
  address?: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
}

export interface Product {
  id: string;
  businessId: string;
  name: string;
  sku: string;
  barcode?: string;
  category: string;
  photoUrl?: string;
  baseUnit: Unit;
  costPrice: number;
  sellingPrice: number;
  minStock: number;
  stock: number;
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CapitalItem {
  id: string;
  name: string;
  qty: number;
  unit: Unit;
  price: number;
  subtotal: number;
}

export interface CapitalRecord {
  id: string;
  businessId: string;
  title: string;
  category: string;
  totalAmount: number;
  noteUrl?: string;
  items: CapitalItem[];
  recordedAt: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface SaleLocation {
  id: string;
  businessId: string;
  name: string;
  address?: string;
  phone?: string;
  managerName?: string;
  priceNote?: string;
  openingHours?: string;
  targetDailyRevenue?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface SalesRecord {
  id: string;
  businessId: string;
  productId: string;
  locationId?: string;
  locationName: string;
  productionQty: number;
  soldQty: number;
  remainingQty: number;
  unitPrice: number;
  revenue: number;
  cost: number;
  profit: number;
  proofUrl?: string;
  soldAt: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export type StockMovementType = 'IN' | 'OUT' | 'ADJUSTMENT';
export interface StockMovement {
  id: string;
  businessId: string;
  productId: string;
  type: StockMovementType;
  qty: number;
  note?: string;
  refType?: string;
  refId?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  businessId: string;
  title: string;
  message: string;
  type: 'stock' | 'profit' | 'target' | 'expense' | 'sales' | 'reminder';
  isRead: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  businessId?: string;
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface DashboardMetrics {
  totalSales: number;
  totalCapital: number;
  totalProfit: number;
  profitPercentage: number;
  bestProduct?: string;
  lowStockCount: number;
  stockValue: number;
  trendSales: number;
}
