import React, { createContext, useState, useContext } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  // Defaulting to USD
  const [currency, setCurrency] = useState({ 
    code: 'USD', 
    symbol: '$', 
    locale: 'en-US' 
  });

  const updateCurrency = (code) => {
    const currencyMap = {
      'USD': { symbol: '$', locale: 'en-US' },
      'INR': { symbol: '₹', locale: 'en-IN' },
      'NPR': { symbol: 'Rs.', locale: 'en-IN' }, // Using IN locale for Lakh/Crore format
      'GBP': { symbol: '£', locale: 'en-GB' }
    };
    
    if (currencyMap[code]) {
      setCurrency({ 
        code, 
        symbol: currencyMap[code].symbol, 
        locale: currencyMap[code].locale 
      });
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, updateCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);