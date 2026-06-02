import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const sales = Array.isArray(body.sales) ? body.sales : [];
  const totalSales = sales.reduce((sum: number, item: any) => sum + Number(item.revenue || 0), 0);
  const totalProfit = sales.reduce((sum: number, item: any) => sum + Number(item.profit || 0), 0);
  return NextResponse.json({ totalSales, totalProfit, profitPercentage: totalSales ? (totalProfit / totalSales) * 100 : 0 });
}
