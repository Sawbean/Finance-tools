// components/calculator/CalculatorForm.js

export default function CalculatorForm({
  onSubmit,
  onReset,
  children,
  adComponent = null,
  hideDefaultButton = false,
  hideDefaultReset = false,
  customButtons = null,
  className = "",
}) {
  return (
    <>
      <form onSubmit={onSubmit} className={`form-box ${className}`}>
        {children}

        {/* If you pass custom buttons in emi.js, we render ONLY those.
           If not, we show the default ones based on your hide/show props.
        */}
        {customButtons ? (
          <div className="calculator-buttons">{customButtons}</div>
        ) : (
          /* Only show this div if there is at least one button to show */
          (!hideDefaultButton || !hideDefaultReset) && (
            <div className="calculator-buttons">
              {!hideDefaultButton && (
                <button type="submit" className="calc-btn">
                  Calculate
                </button>
              )}
              {!hideDefaultReset && (
                <button type="button" onClick={onReset} className="reset-btn">
                  Reset
                </button>
              )}
            </div>
          )
        )}
      </form>

      {adComponent && <div className="calculator-ad">{adComponent}</div>}
    </>
  );
}