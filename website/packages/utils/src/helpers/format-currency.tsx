export function formatCurrencyBRL(value: number | string): string {
  const number = typeof value === 'string' ? parseFloat(value) : value;
  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });
}