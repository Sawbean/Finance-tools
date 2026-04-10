import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

// Import global utilities
import { formatCurrency } from "../../utils/formatters"; 

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function CurrencyConverter() {
  // 1. STATE MANAGEMENT
  const [amount, setAmount] = useState(100);
  const [rate, setRate] = useState(133.50); 
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("NPR");
  const [result, setResult] = useState(null);

  // 2. CALCULATION LOGIC
  const calculateConversion = () => {
    const A = parseFloat(amount) || 0;
    const R = parseFloat(rate) || 0;

    if (A <= 0 || R <= 0) {
      setResult(null);
      return;
    }

    const convertedAmount = A * R;

    setResult({
      [`Amount in ${fromCurrency}`]: A,
      "Exchange Rate Used": R,
      "Total Converted Value": convertedAmount,
      "Current Unit Value": `1 ${fromCurrency} = ${R} ${toCurrency}`
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

  const handleReset = () => {
    setAmount(100);
    setFromCurrency("USD");
    setToCurrency("NPR");
    setRate(133.50);
    setResult(null);
  };

  return (
    <>
      <Head>
        <title>Currency Converter | Global Exchange Rates | ToolFinance</title>
        <meta 
          name="description" 
          content="Fast and accurate currency converter for international exchange. Calculate USD, EUR, INR, and NPR conversions with custom rates." 
        />
      </Head>

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
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()}>
              <div className="input-row" style={{alignItems: 'flex-end'}}>
                <div style={{flex: '2'}}>
                    <CalculatorInput label={`Amount (${fromCurrency})`} value={amount} onChange={setAmount} placeholder="100" />
                </div>
                <div style={{flex: '1'}}>
                    <label className="input-label" style={{fontSize: '0.8rem'}}>From Code</label>
                    <input className="custom-code-input" value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value.toUpperCase())} maxLength="3" />
                </div>
              </div>

              <div className="input-row" style={{alignItems: 'flex-end', marginTop: '15px'}}>
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
              <ResultBox
                title="Conversion Summary"
                results={result}
                formatCurrency={(val) => typeof val === 'number' ? val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : val}
              />
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