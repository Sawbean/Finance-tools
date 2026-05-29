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
}) {
  const { currency, updateCurrency } = useCurrency();

  return (
    <>
      <form onSubmit={onSubmit} className={`form-box ${className}`}>
        {/* Currency Toggle inside the form */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
          <select 
            value={currency.code} 
            onChange={(e) => updateCurrency(e.target.value)}
            style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '12px' }}
          >
            <option value="USD">USD ($)</option>
            <option value="INR">INR (₹)</option>
            <option value="NPR">NPR (Rs.)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>
        {error && (
          <div style={{ 
            padding: '12px', 
            marginBottom: '20px', 
            background: '#fff1f2', 
            border: '1px solid #fda4af', 
            borderRadius: '10px', 
            color: '#be123c', 
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
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