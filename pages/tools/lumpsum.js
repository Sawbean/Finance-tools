import { useState, useEffect } from "react";
import Link from "next/link";

// Import global utilities
import { useCurrency } from "../../context/CurrencyContext";
import { allToolGuides } from '../../data/tool-guides/index';
import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";
import { tools } from '../../data/tools';
import ToolSEO from '../../components/layout/ToolSEO';
import { formatCurrency } from "../../utils/formatters";

export default function LumpsumCalculator() {
  const { currency } = useCurrency();

  // Automatically find the data for THIS tool
  const toolData = tools.find(t => t.link === '/tools/lumpsum');
  const guideData = Object.values(allToolGuides).find(g => g.tool === "lumpsum");
  
  // 1. STATE MANAGEMENT
  const [investment, setInvestment] = useState(100000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [years, setYears] = useState(10);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // 2. CALCULATION LOGIC
  const calculateLumpsum = () => {
    const P = parseFloat(investment) || 0;
    const r = parseFloat(expectedReturn) || 0;
    const n = parseFloat(years) || 0;

    if (P <= 0 || r < 0 || n <= 0) {
      setResult(null);
      setError(P <= 0 ? "Investment amount must be greater than zero." : r < 0 ? "Expected return rate cannot be negative." : "Time period must be positive.");
      return;
    }
    setError("");

    // Future Value formula: FV = P * (1 + r/100)^n
    const futureValue = P * Math.pow(1 + r / 100, n);
    const wealthGained = futureValue - P;

    setResult({
      "Total Investment": Math.round(P),
      "Wealth Gained": Math.round(wealthGained),
      "Estimated Future Value": Math.round(futureValue),
      "Multiple of Investment": `${(futureValue / P).toFixed(2)}x`
    });
  };

  useEffect(() => {
    calculateLumpsum();
  }, [investment, expectedReturn, years]);

  const handleReset = () => {
    setInvestment("");
    setExpectedReturn(12);
    setYears(10);
    setResult(null);
    setError("");
  };

  return (
    <>
      <ToolSEO tool={toolData} guideData={guideData} />

      <div className="container">
        <div className="tool-intro lumpsum-intro">
            <h1>💰 Lumpsum Investment</h1>
            <p>Project the future value of your one-time investment based on expected annual returns.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()} error={error}>
              <CalculatorInput 
                label="Total Investment Amount" 
                value={investment} 
                onChange={setInvestment} 
                icon={currency.symbol} 
              />
              
              <div className="input-row">
                <CalculatorInput label="Exp. Return Rate (p.a)" value={expectedReturn} onChange={setExpectedReturn} suffix="%" />
                <CalculatorInput label="Time Period" value={years} onChange={setYears} suffix="Years" />
              </div>
            </CalculatorForm>

            <div className="guide-card-wrapper">
                <Link href="/blog/lumpsum-calculator-guide" className="read-guide-card">
                    📖 Comparison: Is Lumpsum better than SIP in a bull market?
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox
                title="Wealth Projection"
                results={result}
              />
            ) : (
              <div className="result-box-empty">
                Enter investment details to see your projected wealth growth.
              </div>
            )}
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        <div className="info-card lumpsum-info-card">
            <h3>How Lumpsum Growth is Calculated</h3>
            <p>
                Lumpsum investments grow through <strong>Annual Compounding</strong>. Unlike a simple interest loan, your returns each year are reinvested to earn even more returns the following year. 
            </p>

            <div className="formula-display">
              <span>FV = P × (1 + r)<sup>n</sup></span>
            </div>

            <p>
                For example, at a 12% return, your {formatCurrency(investment || 0)} would roughly double every 6 years. 
            </p>
        </div>
      </div>
    </>
  );
}