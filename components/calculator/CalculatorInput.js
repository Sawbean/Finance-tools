// components/calculator/CalculatorInput.js

export default function CalculatorInput({
  label,
  type = "number",
  step,
  placeholder,
  value,
  onChange,
  required = true,
}) {
  return (
    <div className="calculator-input">
      {/* Label hidden via CSS for placeholder-only design */}
      {label && <label>{label}</label>}
      <input
        type={type}
        step={step}
        placeholder={placeholder || label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  );
}