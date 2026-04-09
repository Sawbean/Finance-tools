// utils/formatters.js

export const formatCurrency = (num) => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(Math.round(num));
};

// Change 'currencyIcon' to 'globalCurrency'
export const globalCurrency = "$";