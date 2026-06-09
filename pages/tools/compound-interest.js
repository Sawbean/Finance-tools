import { useState, useEffect } from "react";
import Link from "next/link";
import { tools } from '../../data/tools';
import ToolSEO from '../../components/layout/ToolSEO';
import { allToolGuides } from '../../data/tool-guides/index';

// Import global utilities
import { useCurrency } from "../../context/CurrencyContext"; 

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function CompoundInterestCalculator() {
  const { currency } = useCurrency();
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  
  const toolData = tools.find(t => t.link === '/tools/compound-interest');
  const guideData = Object.values(allToolGuides).find(g => g.tool === "compound-interest");   

  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(10);
  const [years, setYears] = useState(5);
  const [frequency, setFrequency] = useState(12);

  const calculateCompoundInterest = () => {
    setError("");
    const P = parseFloat(principal) || 0;
    const r = (parseFloat(rate) || 0) / 100;
    const t = parseFloat(years) || 0;
    const n = parseInt(frequency);

    if (P <= 0 || r <= 0 || t <= 0) return;
    if (r < 0 || t < 0) {
      setError("Rate and Duration must be positive numbers.");
      setResult(null);
      return;
    }

    const amount = P * Math.pow((1 + (r / n)), (n * t));
    const totalInterest = amount - P;
    const apy = (Math.pow((1 + (r / n)), n) - 1) * 100;

    setResult({
      "Initial Principal": Math.round(P), 
      "Total Interest Earned": Math.round(totalInterest), 
      "Final Balance": Math.round(amount), 
      "Effective Annual Yield (APY)": `${apy.toFixed(2)}%`,
      "Wealth Multiplier": `${(amount / P).toFixed(2)}x initial deposit`
    });
  };

  useEffect(() => {
    calculateCompoundInterest();
  }, [principal, rate, years, frequency]);

  const handleReset = () => {
    setPrincipal("");
    setRate("");
    setYears("");
    setFrequency(12);
    setResult(null);
  };

  return (
    <>
      <ToolSEO tool={toolData} guideData={guideData} />

      <div className="container">
        <div className="tool-intro">
            <h1>🧪 Compound Interest Calculator</h1>
            <p>See how "interest on interest" accelerates your savings over time.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()} error={error}>
              <CalculatorInput label="Initial Deposit" value={principal} onChange={setPrincipal} icon={currency.symbol} />
              
              <div className="input-row">
                <CalculatorInput label="Annual Rate (%)" value={rate} onChange={setRate} suffix="%" />
                <CalculatorInput label="Duration" value={years} onChange={setYears} suffix="Years" />
              </div>

              <div className="input-field-group">
                <label className="input-label">Compounding Frequency</label>
                <select 
                    className="currency-select" 
                    value={frequency} 
                    onChange={(e) => setFrequency(e.target.value)}
                >
                    <option value="365">Daily</option>
                    <option value="12">Monthly</option>
                    <option value="4">Quarterly</option>
                    <option value="2">Half-Yearly</option>
                    <option value="1">Annually</option>
                </select>
              </div>
            </CalculatorForm>

            <Link href="/blog/compound-interest-guide" className="read-guide-card">
                📖 Compounding Guide: How to build wealth exponentially
            </Link>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox title="Growth Forecast" results={result} />
            ) : (
              <div className="result-box-empty">
                Enter a principal amount to start calculating.
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        <div className="info-card compound-info">
            <h3>💡 Why Frequency Matters</h3>
            <p>
                The more frequently interest is compounded, the faster your money grows. 
                For example, a {currency.symbol}{Number(1000).toLocaleString(currency.locale)} deposit grows much faster 
                with monthly compounding than with annual compounding!
            </p>
        </div>
      </div>
    </>
  );
}