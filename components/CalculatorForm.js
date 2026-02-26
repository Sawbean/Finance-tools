// components/CalculatorForm.js
export default function CalculatorForm({ fields, onSubmit, onReset }) {
  return (
    <form onSubmit={onSubmit} className="form-box">
      {fields.map(({ type, placeholder, value, onChange, step, required }, idx) => (
        <input
          key={idx}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          step={step}
          required={required}
        />
      ))}

      <div style={{ display: "flex", gap: "10px" }}>
        <button type="submit" style={{ flex: 1 }}>
          Calculate
        </button>
        <button
          type="button"
          onClick={onReset}
          style={{ flex: 1, background: "#f0e68c", color: "#0a2a66" }}
        >
          Reset
        </button>
      </div>
    </form>
  );
}