export default function ResultBox({ title, results, formatCurrency }) {
  return (
    <div className="result-box">
      <h2>{title}</h2>

      {Object.entries(results).map(([key, value]) => (
        <p key={key}>
          <strong>{key.replace(/([A-Z])/g, " $1")}:</strong>{" "}
          {typeof value === "number" && formatCurrency
            ? `Rs. ${formatCurrency(value)}`
            : value}
        </p>
      ))}
    </div>
  );
}