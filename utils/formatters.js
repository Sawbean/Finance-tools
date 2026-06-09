// utils/formatters.js

export const formatCurrency = (amount, currency) => {
  // 1. Fallback: If currency object is missing, use defaults
  const locale = currency?.locale || 'en-US';
  const currencyCode = currency?.code || 'USD';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const globalCurrency = "$";