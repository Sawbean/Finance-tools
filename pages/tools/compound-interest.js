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
  // Automatically find the data for THIS tool
  const toolData = tools.find(t => t.link === '/tools/compound-interest');
  const guideData = Object.values(allToolGuides).find(g => g.tool === "compound-interest");   
  // 1. STATE MANAGEMENT
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(10);
  const [years, setYears] = useState(5);
  const [frequency, setFrequency] = useState(12); // Compounding periods per year

  // 2. CALCULATION LOGIC
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

    // Formula: A = P(1 + r/n)^(nt)
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

  // Handle standardized reset
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
        <div className="tool-intro" style={{textAlign: 'center', marginBottom: '30px'}}>
            <h1 style={{fontSize: '2.5rem', color: 'var(--primary)'}}>🧪 Compound Interest Calculator</h1>
            <p style={{color: '#666'}}>See how "interest on interest" accelerates your savings over time.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            {/* onReset prop handles the logic; manual reset buttons removed */}
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()} error={error}>
              <CalculatorInput label="Initial Deposit" value={principal} onChange={setPrincipal} icon={currency.symbol} />
              
              <div className="input-row">
                <CalculatorInput label="Annual Rate (%)" value={rate} onChange={setRate} suffix="%" />
                <CalculatorInput label="Duration" value={years} onChange={setYears} suffix="Years" />
              </div>

              <div style={{marginTop: '15px'}}>
                <label className="input-label">Compounding Frequency</label>
                <select 
                    className="input-wrapper" 
                    style={{width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer'}}
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

            {/* Standardized Guide Card inside form-box */}
            <div style={{marginTop: '25px'}}>
                <Link href="/blog/compound-interest-guide" className="read-guide-card" style={{display: 'block', textDecoration: 'none'}}>
                    📖 Compounding Guide: How to build wealth exponentially
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox title="Growth Forecast" results={result}  />
            ) : (
              <div className="result-box" style={{background: '#f8fafc', color: '#64748b', textAlign: 'center'}}>
                Enter a principal amount to start calculating.
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        {/* Standardized Insight Card */}
        <div className="info-card" style={{marginTop: '40px', padding: '25px', background: '#fff7ed', borderRadius: '12px', border: '1px solid #ffedd5'}}>
            <h3 style={{color: '#9a3412', marginBottom: '10px'}}>💡 Why Frequency Matters</h3>
            <p style={{fontSize: '0.9rem', color: '#9a3412', lineHeight: '1.6'}}>
                The more frequently interest is compounded, the faster your money grows. 
                For example, a {currency.symbol}{Number(1000).toLocaleString(currency.locale)} deposit grows much faster 
                with monthly compounding than with annual compounding!
            </p>
            
        </div>
      </div>
    </>
  );
}