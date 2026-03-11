// components/calculator/ResultBox.js

export default function ResultBox({ title, results, formatCurrency }) {
  // Helper to format result labels like 'Monthly EMI', 'Total Payment', etc.
  const formatLabel = (key) => {
    return key
      .replace(/([A-Z])/g, " $1") // insert space before uppercase letters
      .replace(/^./, (str) => str.toUpperCase()) // capitalize first letter
      .trim();
  };

  return (
    <div className="result-box">
      {title && <h2>{title}</h2>}

      <div className="result-grid">
        {Object.entries(results).map(([key, value]) => (
          <div key={key} className="result-item">

            {/* Label with proper spacing and capitalization */}
            <span className="result-label">{formatLabel(key)}</span>

            {/* Value formatted as currency if number */}
            <span className="result-value">
              {typeof value === "number" && formatCurrency
                ? `Rs. ${formatCurrency(value)}`
                : value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}