import type { CapitalRecord, Product, SalesRecord } from '@/types';

export interface LocalReportSnapshot {
  products: Product[];
  capitals: CapitalRecord[];
  sales: SalesRecord[];
}

export function createReportSnapshot(data: LocalReportSnapshot) {
  const totalSales = data.sales.reduce((sum, sale) => sum + sale.revenue, 0);
  const totalCapital = data.capitals.reduce((sum, capital) => sum + capital.totalAmount, 0);
  const totalProfit = data.sales.reduce((sum, sale) => sum + sale.profit, 0);
  return {
    generatedAt: new Date().toISOString(),
    totalSales,
    totalCapital,
    totalProfit,
    profitPercentage: totalSales ? (totalProfit / totalSales) * 100 : 0,
    lowStock: data.products.filter((product) => product.stock <= product.minStock)
  };
}
