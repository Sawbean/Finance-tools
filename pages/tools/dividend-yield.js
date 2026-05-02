import { useState, useEffect } from "react";
import Link from "next/link";
import { tools } from '../../data/tools';
import ToolSEO from '../../components/layout/ToolSEO';
// Import global utilities
import { useCurrency } from "../../context/CurrencyContext"; 
import { allToolGuides } from '../../data/tool-guides/index';  
import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function DividendYieldCalculator() {
  const { currency } = useCurrency();
  const formatCurrency = (val) => new Intl.NumberFormat(currency.locale, { style: 'currency', currency: currency.code }).format(val);
  // Automatically find the data for THIS tool
  const toolData = tools.find(t => t.link === '/tools/dividend-yield');
  const guideData = Object.values(allToolGuides).find(g => g.tool === "dividend-yield");
  // 1. STATE MANAGEMENT
  const [sharePrice, setSharePrice] = useState(1000);
  const [annualDividend, setAnnualDividend] = useState(50);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  // 2. CALCULATION LOGIC
  // 2. CALCULATION LOGIC
  const calculateYield = () => {
    const P = parseFloat(sharePrice) || 0;
    const D = parseFloat(annualDividend) || 0;

    // Guard against division by zero or invalid inputs during build/render
    if (P <= 0) {
      setResult(null);
      setError(sharePrice ? "Share price must be greater than zero." : "");
      return;
    }

    if (D < 0) {
      setResult(null);
      setError("Annual dividend cannot be negative.");
      return;
    }

    // Clear error and calculate
    setError("");
    const currentYield = (D / P) * 100;

    setResult({
      "Annual Dividend per Share": formatCurrency(D),
      "Current Share Price": formatCurrency(P),
      "Dividend Yield": `${currentYield.toFixed(2)}%`,
      "Risk Profile": currentYield > 8 
        ? "⚠️ High Yield (Check Sustainability)" 
        : "✅ Healthy Yield"
    });
  };

  // 3. EFFECT WITH GUARD CLAUSE
  useEffect(() => {
    // Only run if we have valid inputs to prevent prerender "ReferenceError"
    if (sharePrice && annualDividend) {
      calculateYield();
    } else {
      setResult(null);
    }
  }, [sharePrice, annualDividend]);

  // 4. RESET HANDLER
  const handleReset = () => {
    setSharePrice("");
    setAnnualDividend("");
    setResult(null);
    setError("");
  };

  return (
    <>
      <ToolSEO tool={toolData} guideData={guideData} />

      <div className="container">
        <div className="tool-intro" style={{textAlign: 'center', marginBottom: '30px'}}>
            <h1 style={{fontSize: '2.5rem', color: 'var(--primary)'}}>🎟️ Dividend Yield</h1>
            <p style={{color: '#666'}}>Measure the cash flow return on your stock investments.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()}>
              <CalculatorInput 
                label="Current Share Price" 
                value={sharePrice} 
                onChange={setSharePrice} 
                icon={currency.symbol} 
              />
              
              <CalculatorInput 
                label="Annual Dividend per Share" 
                value={annualDividend} 
                onChange={setAnnualDividend} 
                icon={currency.symbol} 
              />
              
              <p style={{fontSize: '0.8rem', color: '#64748b', marginTop: '10px', fontStyle: 'italic'}}>
                *Enter the total dividends paid over a 12-month period.
              </p>
            </CalculatorForm>

            <div style={{marginTop: '25px'}}>
                <Link href="/blog/dividend-yield-guide" className="read-guide-card" style={{display: 'block', textDecoration: 'none'}}>
                    📖 Passive Income: How to build a dividend-focused portfolio?
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox
                title="Yield Analysis"
                results={result}
              />
            ) : (
              <div className="result-box" style={{background: '#f8fafc', color: '#64748b', textAlign: 'center'}}>
                Enter share price and annual dividend to calculate yield.
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        <div className="info-card" style={{marginTop: '40px', padding: '25px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0'}}>
            <h3 style={{color: 'var(--primary)', marginBottom: '10px'}}>What does Dividend Yield tell you?</h3>
            <p style={{fontSize: '0.95rem', color: '#475569', lineHeight: '1.6', marginBottom: '15px'}}>
                The dividend yield is a financial ratio that shows how much a company pays out in dividends each year relative to its stock price. It is the interest rate you "earn" on your shares.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 'bold', margin: '20px 0' }}>
              <span>Dividend Yield = </span>
              <div style={{ textAlign: 'center' }}>
                <div style={{ borderBottom: '2px solid var(--primary)', padding: '0 10px' }}>Annual Dividend Per Share</div>
                <div>Current Share Price</div>
              </div>
            </div>

            <p style={{fontSize: '0.95rem', color: '#475569', lineHeight: '1.6', marginTop: '15px'}}>
                <strong>Strategy Tip:</strong> Yield-focused investors often look for "Dividend Aristocrats"—companies that have consistently increased their payouts for over 25 years. While a high yield of <strong>{yieldPercentage.toFixed(2)}%</strong> is tempting, always cross-reference it with the <em>Payout Ratio</em> to ensure the company has enough earnings to cover these payments.
            </p>
        </div>
      </div>
    </>
  );
}