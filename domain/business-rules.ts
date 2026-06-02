import type { Product, SalesRecord } from '@/types';

export function calculateMargin(costPrice: number, sellingPrice: number) {
  if (!sellingPrice) return 0;
  return ((sellingPrice - costPrice) / sellingPrice) * 100;
}

export function calculateSale(product: Product, soldQty: number, unitPrice: number, productionQty = 0): Pick<SalesRecord, 'revenue' | 'cost' | 'profit' | 'remainingQty'> {
  const revenue = soldQty * unitPrice;
  const cost = soldQty * product.costPrice;
  return { revenue, cost, profit: revenue - cost, remainingQty: Math.max(productionQty - soldQty, 0) };
}

export function isLowStock(product: Product) {
  return product.stock <= product.minStock;
}

export function canSell(product: Product, soldQty: number, productionQty = 0) {
  return soldQty <= product.stock + productionQty;
}
