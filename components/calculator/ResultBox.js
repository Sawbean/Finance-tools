import { useCurrency } from '../../context/CurrencyContext';
import { formatCurrency } from "../../utils/formatters";

export default function ResultBox({ title, results }) {
  const { currency } = useCurrency();

  const formatLabel = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  // Professional formatting based on selected currency
  const formatValue = (val) => {
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
      maximumFractionDigits: 2
    }).format(val);
  };

  return (
    <div className="result-box">
      {title && <h2>{title}</h2>}
      <div className="result-grid">
        {Object.entries(results).map(([key, value]) => (
          <div key={key} className="result-item">
            <span className="result-label">{formatLabel(key)}</span>
            <span className="result-value">
              {typeof value === "number" 
                ? formatValue(value) 
                : value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}