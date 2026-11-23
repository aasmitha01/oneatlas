export function money(value: number | string | null | undefined) {
  if (value === null || value === undefined) return '—';
  return `$${Number(value).toFixed(Number(value) < 1 ? 4 : 2)}`;
}
export function compactNumber(value: number) {
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}
