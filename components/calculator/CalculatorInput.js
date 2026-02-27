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
    <input
      type={type}
      step={step}
      placeholder={placeholder || label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
    />
  );
}