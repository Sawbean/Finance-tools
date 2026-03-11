// components/calculator/CalculatorForm.js

export default function CalculatorForm({
  onSubmit,
  onReset,
  children,
  adComponent = null, // optional ad
}) {
  return (
    <>
      <form onSubmit={onSubmit} className="form-box">

        {children}

        <div className="calculator-buttons">
          <button type="submit" className="calc-btn">
            Calculate
          </button>

          <button
            type="button"
            onClick={onReset}
            className="reset-btn"
          >
            Reset
          </button>
        </div>

      </form>

      {/* Optional AdSense placement below buttons */}
      {adComponent && (
        <div className="calculator-ad">
          {adComponent}
        </div>
      )}
    </>
  );
}