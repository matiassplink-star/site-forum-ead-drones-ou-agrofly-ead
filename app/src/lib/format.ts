/**
 * Formata um valor numérico para representação de moeda brasileira (R$).
 * @param value Valor numérico a ser formatado.
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formata um valor numérico inteiro ou decimal conforme padrão brasileiro.
 * @param value Valor numérico a ser formatado.
 * @param fractionDigits Número opcional de casas decimais.
 */
export function formatNumber(value: number, fractionDigits = 0): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}
