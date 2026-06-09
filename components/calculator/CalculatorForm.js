import { useCurrency } from '../../context/CurrencyContext';

export default function CalculatorForm({
  onSubmit,
  onReset,
  children,
  error,
  adComponent = null,
  hideDefaultButton = false,
  hideDefaultReset = false,
  customButtons = null,
  className = "",
  showCurrencyToggle = true
}) {
  const { currency, updateCurrency } = useCurrency();

  return (
    <>
      <form onSubmit={onSubmit} className={`form-box ${className}`}>
        {showCurrencyToggle && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
          <select 
              className="currency-select"
              value={currency.code} 
              onChange={(e) => updateCurrency(e.target.value)}
            >
            <option value="USD">USD ($)</option>
            <option value="INR">INR (₹)</option>
            <option value="NPR">NPR (Rs.)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>
       )}
        {error && (
          <div className="error-box">
            <span>⚠️</span> {error}
          </div>
        )}

        {children}

        {customButtons ? (
          <div className="calculator-buttons">{customButtons}</div>
        ) : (
          (!hideDefaultButton || !hideDefaultReset) && (
            <div className="calculator-buttons">
              {!hideDefaultButton && (
                <button type="submit" className="calc-btn">Calculate</button>
              )}
              {!hideDefaultReset && (
                <button type="button" onClick={onReset} className="reset-btn">Reset</button>
              )}
            </div>
          )
        )}
        
      </form>
      {adComponent && (
        <div 
          className="calculator-ad" 
          style={{ alignSelf: 'flex-start', width: '100%' }}
        >
          {adComponent}
        </div>
      )}
    </>
  );
}