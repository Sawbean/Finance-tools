import { useCurrency } from '../../context/CurrencyContext';
import { formatCurrency } from "../../utils/formatters";

export default function ResultBox({ title, results }) {
  const { currency } = useCurrency();

  const formatLabel = (key) => {
    return key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()).trim();
  };

  const formatValue = (key, val) => {
    if (typeof val !== "number") return val;

    const lowerKey = key.toLowerCase();

    // 1. Percentage/Rate handling (Adds %)
    if (lowerKey.includes("rate") || lowerKey.includes("percent") || lowerKey.includes("surge")) {
      return `${val.toLocaleString(currency.locale, { maximumFractionDigits: 2 })}%`;
    }

    // 2. Time/Tenure handling (Whole numbers, no currency symbol)
    if (lowerKey.includes("tenure") || lowerKey.includes("period") || lowerKey.includes("months") || lowerKey.includes("years")) {
      return val.toLocaleString(currency.locale, { maximumFractionDigits: 0 });
    }

    // 3. Default: Currency formatting (Calls the utility updated above)
    return formatCurrency(val, currency);
  };

  if (!results) return null;

  return (
    <div className="result-box">
      {title && <h2>{title}</h2>}
      <div className="result-grid">
        {Object.entries(results).map(([key, value]) => (
          <div key={key} className="result-item">
            <span className="result-label">{formatLabel(key)}</span>
            <span className="result-value">{formatValue(key, value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}