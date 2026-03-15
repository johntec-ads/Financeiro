export const parseCurrencyValue = (formattedValue) => {
  if (!formattedValue) return 0;

  const normalizedValue = String(formattedValue)
    .replace(/\./g, '')
    .replace(',', '.');

  return Number(normalizedValue) || 0;
};

export const formatCurrencyInput = (inputValue) => {
  const digitsOnly = String(inputValue).replace(/\D/g, '');

  if (!digitsOnly) return '';

  const numericValue = Number(digitsOnly) / 100;

  return numericValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export const formatCurrencyFromNumber = (numericValue) => {
  if (numericValue === null || numericValue === undefined || numericValue === '') {
    return '';
  }

  return Number(numericValue).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};