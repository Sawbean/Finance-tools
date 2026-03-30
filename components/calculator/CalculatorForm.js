// components/calculator/CalculatorForm.js

export default function CalculatorForm({
  onSubmit,
  onReset,
  children,
  adComponent = null,        // optional ad component
  hideDefaultButton = false, // hide default Calculate button
  hideDefaultReset = false,  // hide default Reset button
  customButtons = null,      // provide fully custom buttons
  className = "",            // extra CSS class for customization
}) {
  return (
    <>
      <form onSubmit={onSubmit} className={`form-box ${className}`}>
        {/* All form inputs go here */}
        {children}

        {/* Buttons area */}
        {customButtons ? (
          // If custom buttons are passed, render them instead
          <div className="calculator-buttons">{customButtons}</div>
        ) : (
          <div className="calculator-buttons">
            {/* Default Calculate button */}
            {!hideDefaultButton && (
              <button type="submit" className="calc-btn">
                Calculate
              </button>
            )}
            {/* Default Reset button */}
            {!hideDefaultReset && (
              <button type="button" onClick={onReset} className="reset-btn">
                Reset
              </button>
            )}
          </div>
        )}
      </form>

      {/* Optional ad block */}
      {adComponent && <div className="calculator-ad">{adComponent}</div>}
    </>
  );
}