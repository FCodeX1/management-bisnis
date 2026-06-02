export function formatCurrency(value: number, currency = 'IDR') {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('id-ID').format(Number.isFinite(value) ? value : 0);
}

export function parseNumber(value: string | number) {
  if (typeof value === 'number') return value;
  const normalized = value.replace(/[^0-9,-]/g, '').replace(',', '.');
  return Number(normalized || 0);
}
