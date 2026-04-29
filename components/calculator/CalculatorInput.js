// components/calculator/CalculatorInput.js
export default function CalculatorInput({
  label,
  type = "number",
  step = "any",
  placeholder,
  value,
  onChange,
  required = true,
  icon,
  suffix
}) {
  return (
    <div className="calculator-input-group">
      {label && <label className="input-label">{label}</label>}
      <div className="input-wrapper">
        {/* Render Icon (e.g., $, Rs, +) if provided */}
        {icon && <span className="input-icon">{icon}</span>}
        
        <input
          type={type}
          inputMode={type === "number" ? "decimal" : "text"}
          step={step}
          placeholder={placeholder || label}
          value={value ?? ""} // Fallback to empty string to keep input controlled
          onChange={(e) => onChange(e.target.value)}
          required={required}
          // Dynamic class: adds padding-left only if an icon exists
          className={icon ? "has-icon" : ""}
        />

        {/* Render Suffix (e.g., %, Years) if provided */}
        {suffix && <span className="input-suffix">{suffix}</span>}
      </div>
    </div>
  );
}