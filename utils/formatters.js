// utils/formatters.js
export const formatCurrency = (amount, currency) => {
  return new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
    minimumFractionDigits: 2, // Ensures 9.60
    maximumFractionDigits: 2  // Ensures 9.60
  }).format(amount);
};

export const globalCurrency = "$";