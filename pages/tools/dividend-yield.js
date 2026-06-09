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
  // Automatically find the data for THIS tool
  const toolData = tools.find(t => t.link === '/tools/dividend-yield');
  const guideData = Object.values(allToolGuides).find(g => g.tool === "dividend-yield");
  // 1. STATE MANAGEMENT
  const [sharePrice, setSharePrice] = useState(1000);
  const [annualDividend, setAnnualDividend] = useState(50);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
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
      "Annual Dividend per Share": D, // Raw number
      "Current Share Price": P,       // Raw number
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
        <div className="tool-intro">
            <h1>🎟️ Dividend Yield</h1>
            <p>Measure the cash flow return on your stock investments.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()} error={error}>
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
              
              <p className="helper">
                *Enter the total dividends paid over a 12-month period.
              </p>
            </CalculatorForm>

            <div className="guide-card-wrapper">
                <Link href="/blog/dividend-yield-guide" className="read-guide-card">
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
              <div className="result-box-empty">
                Enter share price and annual dividend to calculate yield.
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        <div className="info-card yield-info">
            <h3>What does Dividend Yield tell you?</h3>
            <p className="info-text">
                The dividend yield is a financial ratio that shows how much a company pays out in dividends each year relative to its stock price. It is the interest rate you "earn" on your shares.
            </p>

            <div className="formula-box">
              <span>Dividend Yield = </span>
              <div className="fraction">
                <div className="numerator">Annual Dividend Per Share</div>
                <div>Current Share Price</div>
              </div>
            </div>

            <p className="info-text">
                <strong>Strategy Tip:</strong> Yield-focused investors often look for "Dividend Aristocrats"—companies that have consistently increased their payouts for over 25 years. While a high yield 
                {result ? ` of ${result["Dividend Yield"]}` : ""} is tempting, always cross-reference it with the <em>Payout Ratio</em> to ensure the company has enough earnings to cover these payments.
            </p>
        </div>
      </div>
    </>
  );
}