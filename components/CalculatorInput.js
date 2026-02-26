export default function CalculatorInput({
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
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
    />
  );
}