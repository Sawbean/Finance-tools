import { useState, useEffect } from "react";
import Link from "next/link";
import { tools } from '../../data/tools';
import ToolSEO from '../../components/layout/ToolSEO';

// Import global utilities
 import { useCurrency } from "../../context/CurrencyContext";

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";
import { allToolGuides } from '../../data/tool-guides/index';    
export default function CurrencyConverter() {
  const { currency } = useCurrency();
  const [error, setError] = useState("");
  
  // Automatically find the data for THIS tool
  const toolData = tools.find(t => t.link === '/tools/currency');
  const guideData = Object.values(allToolGuides).find(g => g.tool === "currency");
  
  // 1. STATE MANAGEMENT
  const [amount, setAmount] = useState(100);
  const [rate, setRate] = useState(133.50); 
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("NPR");
  const [result, setResult] = useState(null);

  // 2. CALCULATION LOGIC
  const calculateConversion = () => {
    setError("");
    const A = parseFloat(amount) || 0;
    const R = parseFloat(rate) || 0;

    if (A <= 0 || R <= 0) {
      setResult(null);
      return;
    }

    const convertedAmount = A * R;

   setResult({
      [`Amount in ${fromCurrency}`]: `${fromCurrency} ${A.toFixed(2)}`,
      "Exchange Rate": `1 ${fromCurrency} = ${R} ${toCurrency}`,
      // This forces the decimal to 2 places and adds the To Currency sign
      [`Total Value (${toCurrency})`]: `${toCurrency} ${convertedAmount.toFixed(2)}`
    });
  };

  //setResult({
 //   [`Amount in ${fromCurrency}`]: A,
   // "Exchange Rate": `1 ${fromCurrency} = ${R} ${toCurrency}`,
   // [`Total Value (${toCurrency})`]: convertedAmount // Keep as number for formatting
 // });
 // };

  useEffect(() => {
    calculateConversion();
  }, [amount, rate, fromCurrency, toCurrency]);

  const setPreset = (f, t, r) => {
    setFromCurrency(f);
    setToCurrency(t);
    setRate(r);
  };

  const handleSwap = () => {
      const oldFrom = fromCurrency;
      const oldTo = toCurrency;
      setFromCurrency(oldTo);
      setToCurrency(oldFrom);
      if (rate > 0) {
        setRate(parseFloat((1 / rate).toFixed(4)));
      }
    };

  const handleReset = () => {
    setError("");
    setAmount(100);
    setFromCurrency("USD");
    setToCurrency("NPR");
    setRate(133.50);
    setResult(null);
  };

  return (
    <>
      <ToolSEO tool={toolData} guideData={guideData} />

      <div className="container">
        <div className="tool-intro">
            <h1>💱 Currency Converter</h1>
            <p>Quickly convert international currencies with custom or preset exchange rates.</p>
        </div>

        <div className="preset-container">
            <button className="preset-chip" onClick={() => setPreset("USD", "NPR", 133.50)}>🇺🇸 USD to NPR</button>
            <button className="preset-chip" onClick={() => setPreset("INR", "NPR", 1.60)}>🇮🇳 INR to NPR</button>
            <button className="preset-chip" onClick={() => setPreset("EUR", "USD", 1.08)}>🇪🇺 EUR to USD</button>
            <button className="preset-chip" onClick={() => setPreset("GBP", "USD", 1.26)}>🇬🇧 GBP to USD</button>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()} error={error} showCurrencyToggle={false}>
              <div className="input-row currency-row">
                  <div className="amount-col">
                      <CalculatorInput label={`Amount (${fromCurrency})`} value={amount} onChange={setAmount} placeholder="100" />
                  </div>
                  <div className="code-col">
                      <label className="input-label">From Code</label>
                      <div className="input-wrapper">
                      <input className="custom-code-input" value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value.toUpperCase())} maxLength="3" />
                      </div>
                  </div>
              </div>

              <div className="swap-container">
                <button type="button" onClick={handleSwap} className="preset-chip swap-btn">
                  🔄 Swap Direction
                </button>
              </div>

              <div className="input-row currency-row">
                  <div className="amount-col">
                      <CalculatorInput label="Exchange Rate" value={rate} onChange={setRate} placeholder="1.60" step="0.0001" />
                  </div>
                  <div className="code-col">
                      <label className="input-label">To Code</label>
                      <div className="input-wrapper">
                      <input className="custom-code-input" value={toCurrency} onChange={(e) => setToCurrency(e.target.value.toUpperCase())} maxLength="3" />
                      </div>
                  </div>
              </div>

              <p className="helper">
                *Enter the rate for 1 unit of the source currency (e.g., 1 USD = 133.50 NPR).
              </p>
            </CalculatorForm>

            <div className="guide-card-wrapper">
                <Link href="/blog/currency-converter-guide" className="read-guide-card">
                    📖 Explainer: How are global exchange rates determined?
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <>
              <ResultBox title="Conversion Summary" results={result}  currencyCode={toCurrency} locale="en-US" />
              <p className="note-text">
                <strong>Note:</strong> Rates are manual. Check official sources for live market data.
              </p>
              </>
            ) : (
              <div className="result-box-empty">
                Enter amount and current rate to calculate conversion.
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        <div className="info-card currency-info">
            <h3>How Currency Pegs Work</h3>
            <p>
              Some currencies are <strong>pegged</strong> to a more stable currency at a fixed rate. For instance, the Nepali Rupee (NPR) is pegged to the Indian Rupee (INR) at 1.60. This creates stability for trade between the two nations. In contrast, major currencies like the USD, EUR, and GBP use a <strong>floating exchange rate</strong>, where their value changes constantly based on market demand and economic factors.
            </p>
        </div>
      </div>
    </>
  );
}