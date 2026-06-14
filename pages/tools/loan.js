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

export default function LoanCalculator() {
  const { currency } = useCurrency();

  // Automatically find the data for THIS tool
  const toolData = tools.find(t => t.link === '/tools/loan');
  const guideData = Object.values(allToolGuides).find(g => g.tool === "loan");
  
  // 1. STATE MANAGEMENT
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(12);
  const [duration, setDuration] = useState(1);
  const [durationType, setDurationType] = useState("years");
  const [calculationMethod, setCalculationMethod] = useState("simple"); 
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // 2. CALCULATION LOGIC
  const calculateLoan = () => {
    const P = parseFloat(amount) || 0;
    const R = parseFloat(rate) || 0;
    const D = parseFloat(duration) || 0;

    if (P <= 0 || R < 0 || D <= 0) {
      setResult(null);
      setError(P <= 0 ? "Principal must be greater than zero." : R < 0 ? "Interest rate cannot be negative." : "Duration must be positive.");
      return;
    }
    setError("");

    const T = durationType === "years" ? D : D / 12;
    let totalPayable, totalInterest;

    if (calculationMethod === "simple") {
      totalInterest = (P * R * T) / 100;
      totalPayable = P + totalInterest;
    } else {
      totalPayable = P * Math.pow((1 + (R / 100)), T);
      totalInterest = totalPayable - P;
    }

    setResult({
      "Principal Amount": Math.round(P),
      [`Total ${calculationMethod === 'simple' ? 'Simple' : 'Compound'} Interest`]: Math.round(totalInterest),
      "Total Repayment": Math.round(totalPayable),
      "Interest Impact": `${((totalInterest / P) * 100).toFixed(1)}% of Principal`,
      "Monthly Equivalent": Math.round(totalPayable / (T * 12))
    });
  };

  useEffect(() => {
    calculateLoan();
  }, [amount, rate, duration, durationType, calculationMethod]);

  const handleReset = () => {
    setAmount(""); 
    setRate(""); 
    setDuration("");
    setResult(null);
    setError("");
  };

  return (
    <>
      <ToolSEO tool={toolData} guideData={guideData} />

      <div className="container">
        <div className="tool-intro">
            <h1>🏛️ Loan Calculator</h1>
            <p>Calculate your debt obligation with precision.</p>
        </div>

        <div className="method-toggle">
            <div className="toggle-group">
                <button 
                    className={`toggle-btn ${calculationMethod === 'simple' ? 'active' : ''}`}
                    onClick={() => setCalculationMethod("simple")}
                >Simple Interest</button>
                <button 
                    className={`toggle-btn ${calculationMethod === 'compound' ? 'active' : ''}`}
                    onClick={() => setCalculationMethod("compound")}
                >Compound Interest</button>
            </div>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()} error={error}>
              <CalculatorInput label="Principal Amount" value={amount} onChange={setAmount} icon={currency.symbol} />
              
              <div className="input-row">
                <CalculatorInput label="Annual Rate" value={rate} onChange={setRate} suffix="%" />
                <div className="input-group">
                    <label className="input-label">Tenure</label>
                    <div className="duration-row">
                        <input type="number" className="input-wrapper" value={duration} onChange={(e) => setDuration(e.target.value)} />
                        <select className="input-wrapper" value={durationType} onChange={(e) => setDurationType(e.target.value)}>
                            <option value="years">Yrs</option>
                            <option value="months">Mo</option>
                        </select>
                    </div>
                </div>
              </div>
            </CalculatorForm>

            <div className="guide-card-wrapper">
                <Link href="/blog/loan-types-guide" className="read-guide-card">
                    📖 Loan Guide: Understanding interest rates
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox title="Repayment Summary" results={result} />
            ) : (
              <div className="result-box-empty">
                Enter loan details to view breakdown.
              </div>
            )}
            <div className="sidebar-ad"><AdPlaceholder /></div>
          </div>
        </div>

        <div className="info-card loan-info-card">
            <h3>💡 Simple vs. Compound Interest</h3>
            <p>
             <strong>Simple Interest</strong> is calculated only on the initial principal. 
             <strong> Compound Interest</strong> is "interest on interest." 
             <div className="info-image-container">
            <img src="/images/compound-interest-growth.webp"alt="Simple vs Compound Interest Growth Over Time" loading="lazy" width="600" height="450"/></div>
             For example, on a <strong>{formatCurrency(100000)}</strong> loan at 10% for 2 years, 
             Simple Interest costs <strong>{formatCurrency(20000)}</strong>, while Compound 
             Interest costs <strong>{formatCurrency(21000)}</strong>. 
            </p>
        </div>
      </div>
    </>
  );
}

