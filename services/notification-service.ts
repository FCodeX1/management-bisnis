import type { NotificationItem, Product } from '@/types';
import { uid } from '@/lib/id';

export function createLowStockNotifications(products: Product[], businessId: string): NotificationItem[] {
  return products
    .filter((product) => product.stock <= product.minStock)
    .map((product) => ({
      id: uid('notif'),
      businessId,
      title: `Stok ${product.name} hampir habis`,
      message: `Sisa stok ${product.stock} ${product.baseUnit}, minimum ${product.minStock} ${product.baseUnit}.`,
      type: 'stock',
      isRead: false,
      createdAt: new Date().toISOString()
    }));
}
