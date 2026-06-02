'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatCurrency } from '@/lib/currency';

export function SalesAreaChart({ data }: { data: { date: string; penjualan: number; laba: number }[] }) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Penjualan harian</CardTitle>
          <CardDescription>Omzet dan laba 14 hari terakhir</CardDescription>
        </div>
      </CardHeader>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 0, right: 10, top: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#5E9458" stopOpacity={0.35}/><stop offset="95%" stopColor="#5E9458" stopOpacity={0}/></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${Number(v) / 1000}k`} />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Area type="monotone" dataKey="penjualan" stroke="#5E9458" fill="url(#salesGradient)" strokeWidth={3} />
            <Area type="monotone" dataKey="laba" stroke="#2C432A" fillOpacity={0.08} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function CapitalSalesChart({ data }: { data: { date: string; modal: number; penjualan: number }[] }) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Modal vs Penjualan</CardTitle>
          <CardDescription>Perbandingan cashflow harian</CardDescription>
        </div>
      </CardHeader>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: 0, right: 10, top: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${Number(v) / 1000}k`} />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Bar dataKey="modal" fill="#C9DFC5" radius={[8, 8, 0, 0]} />
            <Bar dataKey="penjualan" fill="#5E9458" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
