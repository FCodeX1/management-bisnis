import type { Business, CapitalRecord, Product, SalesRecord } from '@/types';
import { getBusinessMetrics, generateRuleBasedInsights } from '@/lib/analytics';

export function buildReportPayload(params: { business?: Business; products: Product[]; capitals: CapitalRecord[]; sales: SalesRecord[] }) {
  const metrics = getBusinessMetrics(params);
  return {
    business: params.business,
    metrics,
    insights: generateRuleBasedInsights(metrics, params.products),
    generatedAt: new Date().toISOString()
  };
}
