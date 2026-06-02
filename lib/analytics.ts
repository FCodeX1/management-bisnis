import type { Business, CapitalRecord, DashboardMetrics, Product, SalesRecord } from '@/types';
import { percentageChange } from './utils';

function isActive<T extends { deletedAt?: string | null }>(item: T) {
  return !item.deletedAt;
}

export function getBusinessMetrics(params: {
  business?: Business;
  products: Product[];
  capitals: CapitalRecord[];
  sales: SalesRecord[];
}): DashboardMetrics {
  const { business, products, capitals, sales } = params;
  if (!business) {
    return { totalSales: 0, totalCapital: 0, totalProfit: 0, profitPercentage: 0, lowStockCount: 0, stockValue: 0, trendSales: 0 };
  }

  const totalSales = sales.filter(isActive).reduce((sum, sale) => sum + sale.revenue, 0);
  const totalCapital = capitals.filter(isActive).reduce((sum, item) => sum + item.totalAmount, 0);
  const totalProfit = sales.filter(isActive).reduce((sum, sale) => sum + sale.profit, 0);
  const profitPercentage = totalSales ? (totalProfit / totalSales) * 100 : 0;
  const lowStockCount = products.filter((product) => isActive(product) && product.stock <= product.minStock).length;
  const stockValue = products.filter(isActive).reduce((sum, product) => sum + product.stock * product.costPrice, 0);

  const sortedSales = sales.filter(isActive).sort((a, b) => +new Date(a.soldAt) - +new Date(b.soldAt));
  const mid = Math.floor(sortedSales.length / 2);
  const previous = sortedSales.slice(0, mid).reduce((sum, sale) => sum + sale.revenue, 0);
  const current = sortedSales.slice(mid).reduce((sum, sale) => sum + sale.revenue, 0);

  const productProfit = new Map<string, number>();
  sales.filter(isActive).forEach((sale) => productProfit.set(sale.productId, (productProfit.get(sale.productId) || 0) + sale.profit));
  const bestProductId = [...productProfit.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  const bestProduct = products.find((product) => product.id === bestProductId)?.name;

  return {
    totalSales,
    totalCapital,
    totalProfit,
    profitPercentage,
    bestProduct,
    lowStockCount,
    stockValue,
    trendSales: percentageChange(current, previous)
  };
}

export function buildDailySales(sales: SalesRecord[]) {
  const map = new Map<string, { date: string; penjualan: number; laba: number }>();
  sales.filter((sale) => !sale.deletedAt).forEach((sale) => {
    const date = sale.soldAt.slice(0, 10);
    const row = map.get(date) || { date, penjualan: 0, laba: 0 };
    row.penjualan += sale.revenue;
    row.laba += sale.profit;
    map.set(date, row);
  });
  return [...map.values()].sort((a, b) => a.date.localeCompare(b.date)).slice(-14);
}

export function buildCapitalVsSales(capitals: CapitalRecord[], sales: SalesRecord[]) {
  const map = new Map<string, { date: string; modal: number; penjualan: number }>();
  capitals.filter((item) => !item.deletedAt).forEach((item) => {
    const date = item.recordedAt.slice(0, 10);
    const row = map.get(date) || { date, modal: 0, penjualan: 0 };
    row.modal += item.totalAmount;
    map.set(date, row);
  });
  sales.filter((item) => !item.deletedAt).forEach((item) => {
    const date = item.soldAt.slice(0, 10);
    const row = map.get(date) || { date, modal: 0, penjualan: 0 };
    row.penjualan += item.revenue;
    map.set(date, row);
  });
  return [...map.values()].sort((a, b) => a.date.localeCompare(b.date)).slice(-14);
}

export function generateRuleBasedInsights(metrics: DashboardMetrics, products: Product[]) {
  const insights: string[] = [];
  if (metrics.profitPercentage > 35) insights.push('Margin bisnis sehat. Pertahankan produk dengan kontribusi laba tertinggi.');
  if (metrics.profitPercentage > 0 && metrics.profitPercentage < 15) insights.push('Margin masih tipis. Cek ulang harga jual, biaya bahan, dan promo.');
  if (metrics.lowStockCount > 0) insights.push(`${metrics.lowStockCount} produk berada di bawah stok minimum. Prioritaskan restock.`);
  const deadStock = products.filter((product) => product.stock > product.minStock * 5 && product.minStock > 0);
  if (deadStock.length) insights.push(`${deadStock.length} produk berpotensi overstock. Pertimbangkan bundling atau promo.`);
  if (!insights.length) insights.push('Operasional stabil. Lanjutkan pencatatan harian agar tren lebih akurat.');
  return insights;
}
