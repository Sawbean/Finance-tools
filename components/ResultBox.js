// components/ResultBox.js
export default function ResultBox({ title, results, formatCurrency }) {
  return (
    <div className="result-box">
      <h2>{title}</h2>
      {Object.keys(results).map((key) => (
        <p key={key}>
          <strong>{key.replace(/([A-Z])/g, ' $1')}:</strong>{' '}
          {formatCurrency && typeof results[key] === 'number' ? `Rs. ${formatCurrency(results[key])}` : results[key]}
        </p>
      ))}
    </div>
  );
}