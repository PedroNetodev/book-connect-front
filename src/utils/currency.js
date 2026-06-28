export function parseCurrencyValue(value) {
  if (typeof value === 'number') {
    return value;
  }

  const normalized = String(value || '')
    .replace('R$', '')
    .replace(/\./g, '')
    .replace(',', '.')
    .trim();

  const parsed = Number.parseFloat(normalized);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function formatCurrencyBRL(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value || 0));
}
