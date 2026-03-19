// components/calculator/CalculatorForm.js

export default function CalculatorForm({
  onSubmit,
  onReset,
  children,
  adComponent = null, // optional ad
  hideDefaultButton = false, // NEW: hide the default Calculate button
}) {
  return (
    <>
      <form onSubmit={onSubmit} className="form-box">

        {children}

        <div className="calculator-buttons">
          {!hideDefaultButton && (
            <button type="submit" className="calc-btn">
              Calculate
            </button>
          )}

          <button
            type="button"
            onClick={onReset}
            className="reset-btn"
          >
            Reset
          </button>
        </div>

      </form>

      {adComponent && (
        <div className="calculator-ad">{adComponent}</div>
      )}
    </>
  );
}