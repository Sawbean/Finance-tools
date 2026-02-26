export default function ResultBox({ title, results, formatCurrency }) {
  return (
    <div className="result-box">
      <h2>{title}</h2>

      {Object.entries(results).map(([label, value]) => (
        <p key={label}>
          <strong>
            {label.replace(/([A-Z])/g, " $1")}:
          </strong>{" "}
          {typeof value === "number" && formatCurrency
            ? `Rs. ${formatCurrency(value)}`
            : value}
        </p>
      ))}
    </div>
  );
}