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
      [`Amount in ${fromCurrency}`]: A, // Send as raw number
      "Exchange Rate": `1 ${fromCurrency} = ${R} ${toCurrency}`,
      [`Total Value (${toCurrency})`]: convertedAmount.toFixed(2), // Keep as string for precision
      "Note": "Rates are manual. Check official sources for live market data."
    });
  };

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
      // Calculate the inverse rate: 1 / current rate
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
        <div className="tool-intro" style={{textAlign: 'center', marginBottom: '30px'}}>
            <h1 style={{fontSize: '2.5rem', color: 'var(--primary)'}}>💱 Currency Converter</h1>
            <p style={{color: '#666'}}>Quickly convert international currencies with custom or preset exchange rates.</p>
        </div>

        {/* Global Preset Chips */}
        <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '25px'}}>
            <button className="preset-chip" onClick={() => setPreset("USD", "NPR", 133.50)}>🇺🇸 USD to NPR</button>
            <button className="preset-chip" onClick={() => setPreset("INR", "NPR", 1.60)}>🇮🇳 INR to NPR</button>
            <button className="preset-chip" onClick={() => setPreset("EUR", "USD", 1.08)}>🇪🇺 EUR to USD</button>
            <button className="preset-chip" onClick={() => setPreset("GBP", "USD", 1.26)}>🇬🇧 GBP to USD</button>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()} error={error}>
              {/* Row 1: Amount and From Code */}
              <div className="input-row" style={{alignItems: 'flex-end'}}>
                  <div style={{flex: '2'}}>
                      <CalculatorInput label={`Amount (${fromCurrency})`} value={amount} onChange={setAmount} placeholder="100" />
                  </div>
                  <div style={{flex: '1'}}>
                      <label className="input-label" style={{fontSize: '0.8rem'}}>From Code</label>
                      <input className="custom-code-input" value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value.toUpperCase())} maxLength="3" />
                  </div>
              </div>

              {/* Swap Button: Centered between rows */}
              <div style={{ textAlign: 'center', margin: '15px 0' }}>
                <button 
                  type="button" 
                  onClick={handleSwap}
                  className="preset-chip" 
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: '600', border: '1px solid var(--primary)' }}
                >
                  🔄 Swap Direction
                </button>
              </div>

              {/* Row 2: Rate and To Code */}
              <div className="input-row" style={{alignItems: 'flex-end'}}>
                  <div style={{flex: '2'}}>
                      <CalculatorInput label="Exchange Rate" value={rate} onChange={setRate} placeholder="1.60" step="0.0001" />
                  </div>
                  <div style={{flex: '1'}}>
                      <label className="input-label" style={{fontSize: '0.8rem'}}>To Code</label>
                      <input className="custom-code-input" value={toCurrency} onChange={(e) => setToCurrency(e.target.value.toUpperCase())} maxLength="3" />
                  </div>
              </div>

              <p style={{fontSize: '0.75rem', color: '#64748b', textAlign: 'center', marginTop: '15px', fontStyle: 'italic'}}>
                *Enter the rate for 1 unit of the source currency (e.g., 1 USD = 133.50 NPR).
              </p>
            </CalculatorForm>

            <div style={{marginTop: '25px'}}>
                <Link href="/blog/currency-converter-guide" className="read-guide-card" style={{display: 'block', textDecoration: 'none'}}>
                    📖 Explainer: How are global exchange rates determined?
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox title="Conversion Summary" results={result} />
            ) : (
              <div className="result-box" style={{background: '#f8fafc', color: '#64748b', textAlign: 'center'}}>
                Enter amount and current rate to calculate conversion.
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        <div className="info-card" style={{marginTop: '40px', padding: '25px', background: '#f0f9ff', borderRadius: '12px', border: '1px solid #bae6fd'}}>
            <h3 style={{color: '#0369a1', marginBottom: '10px'}}>How Currency Pegs Work</h3>
            <p style={{fontSize: '0.9rem', color: '#475569', lineHeight: '1.6'}}>
                Some currencies are <strong>pegged</strong> to a more stable currency at a fixed rate. For instance, the Nepali Rupee (NPR) is pegged to the Indian Rupee (INR) at 1.60. This creates stability for trade between the two nations. In contrast, major currencies like the USD, EUR, and GBP use a <strong>floating exchange rate</strong>, where their value changes constantly based on market demand and economic factors.
            </p>
            
        </div>
      </div>

      <style jsx>{`
        .preset-chip {
            padding: 8px 16px;
            background: #fff;
            border: 1px solid #e2e8f0;
            border-radius: 20px;
            cursor: pointer;
            font-size: 0.85rem;
            transition: all 0.2s;
            color: #475569;
        }
        .preset-chip:hover {
            border-color: var(--primary);
            color: var(--primary);
            background: #f0fdf4;
        }
        .custom-code-input {
            width: 100%;
            padding: 12px;
            border: 1px solid #d1d5db;
            border-radius: 10px;
            font-weight: bold;
            text-align: center;
            text-transform: uppercase;
        }
      `}</style>
    </>
  );
}