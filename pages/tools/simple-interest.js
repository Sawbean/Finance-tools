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

export default function SimpleInterestCalculator() {
  const { currency } = useCurrency();
  // Automatically find the data for THIS tool
  const toolData = tools.find(t => t.link === '/tools/simple-interest');
  const guideData = Object.values(allToolGuides).find(g => g.tool === "simple-interest");
  
  // 1. STATE MANAGEMENT
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(12);
  const [time, setTime] = useState(1);
  const [timeUnit, setTimeUnit] = useState("years");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // 2. CALCULATION LOGIC
  const calculateInterest = () => {
    const P = parseFloat(principal) || 0;
    const R = parseFloat(rate) || 0;
    const T = parseFloat(time) || 0;

    if (P <= 0 || R <= 0 || T <= 0) {
      setResult(null);
      setError("All values must be positive numbers.");
      return;
    }
    setError("");

    const actualTimeInYears = timeUnit === "months" ? T / 12 : T;
    const interest = (P * R * actualTimeInYears) / 100;
    const totalAmount = P + interest;
    
    // Calculate average monthly interest safely
    const totalMonths = actualTimeInYears * 12;
    const monthlyInterest = interest / (totalMonths || 1);

    setResult({
      "Initial Principal": P,
      "Total Simple Interest": interest,
      "Monthly Interest Equiv.": monthlyInterest,
      "Total Maturity Value": totalAmount,
    });
  };

  useEffect(() => {
    calculateInterest();
  }, [principal, rate, time, timeUnit]);

  const handleReset = () => {
    setPrincipal("");
    setRate(12);
    setTime(1);
    setTimeUnit("years");
    setResult(null);
    setError("");
  };

  return (
    <>
      <ToolSEO tool={toolData} guideData={guideData} />

      <div className="container">
        <div className="tool-intro si-intro">
            <h1>💰 Simple Interest</h1>
            <p>Calculate interest earned or payable on a fixed principal amount.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()} error={error}>
              <CalculatorInput label="Principal Amount" value={principal} onChange={setPrincipal} icon={currency.symbol} />
              
              <CalculatorInput label="Annual Interest Rate" value={rate} onChange={setRate} suffix="%" />

              <div className="input-row si-time-row">
                <div className="si-time-input">
                    <CalculatorInput label={`Time Period (${timeUnit})`} value={time} onChange={setTime} />
                </div>
                <div className="si-unit-input">
                    <label className="input-label">Unit</label>
                    <select 
                        value={timeUnit} 
                        onChange={(e) => setTimeUnit(e.target.value)}
                        className="si-select"
                    >
                        <option value="years">Years</option>
                        <option value="months">Months</option>
                    </select>
                </div>
              </div>
            </CalculatorForm>

            <div className="guide-card-wrapper">
                <Link href="/blog/simple-interest-guide" className="read-guide-card">
                    📖 Roadmap: When is simple interest more beneficial than compound?
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox
                title="Interest Breakdown"
                results={result}              
              />
            ) : (
              <div className="result-box-empty">
                Enter amount and time to see the calculation breakdown.
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        <div className="info-card si-info-card">
            <h3>The Simple Interest Formula</h3>
            <p>Simple interest is calculated using the standard formula:</p>
            
            <div className="si-formula-box">
              <span>SI = </span>
              <div className="fraction">
                <div className="numerator">P × R × T</div>
                <div className="denominator">100</div>
              </div>
            </div>

            

             <p>
                Unlike <strong>Compound Interest</strong>, where interest is earned on both the principal and previous interest, 
                <strong>Simple Interest</strong> is only calculated on the original Principal. 
                For example, a {currency.symbol}{formatCurrency(1000)} loan at 10% will always cost 
                you {currency.symbol}{formatCurrency(100)} in interest every year, no matter how long the term is. 
                This makes it ideal for short-term personal loans and bridge financing.
            </p>
        </div>
      </div>
    </>
  );
}