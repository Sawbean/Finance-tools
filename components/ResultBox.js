// components/ResultBox.js
export default function ResultBox({ title, results = {}, formatCurrency }) {
  const defaultFormatCurrency = (num) => {
    num = Math.round(num);
    let str = num.toString();
    if (str.length <= 3) return str;
    let lastThree = str.slice(-3);
    let remaining = str.slice(0, -3);
    let parts = [];
    while (remaining.length > 2) {
      parts.unshift(remaining.slice(-2));
      remaining = remaining.slice(0, -2);
    }
    if (remaining.length) parts.unshift(remaining);
    return parts.join(",") + "," + lastThree;
  };

  const format = formatCurrency || defaultFormatCurrency;

  return (
    <div className="result-box">
      <h2>{title}</h2>
      {Object.keys(results).map((key) => (
        <p key={key}>
          <strong>{key.replace(/([A-Z])/g, " $1")}:</strong>{" "}
          {typeof results[key] === "number" ? `Rs. ${format(results[key])}` : results[key]}
        </p>
      ))}
    </div>
  );
}