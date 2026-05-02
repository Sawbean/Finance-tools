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

export default function SimpleInterestCalculator() {
  const { currency } = useCurrency();
  const formatValue = (val) => new Intl.NumberFormat(currency.locale).format(val);
  // Automatically find the data for THIS tool
  const toolData = tools.find(t => t.link === '/tools/simple-interest');
  const guideData = Object.values(allToolGuides).find(g => g.tool === "simple-interest");
  // 1. STATE MANAGEMENT
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(12);
  const [time, setTime] = useState(1);
  const [timeUnit, setTimeUnit] = useState("years");
  const [result, setResult] = useState(null);

  // 2. CALCULATION LOGIC
  const calculateInterest = () => {
  const P = parseFloat(principal) || 0;
  const R = parseFloat(rate) || 0;
  const T = parseFloat(time) || 0;

  if (P <= 0 || R <= 0 || T <= 0) {
    setResult(null);
    return;
  }

  const actualTimeInYears = timeUnit === "months" ? T / 12 : T;
  const interest = (P * R * actualTimeInYears) / 100;
  const totalAmount = P + interest;
  
  // Calculate average monthly interest safely
  const totalMonths = actualTimeInYears * 12;
  const monthlyInterest = interest / totalMonths;

  setResult({
    "Initial Principal": `${currency.symbol}${formatValue(P)}`,
    "Total Simple Interest": `${currency.symbol}${formatValue(interest)}`,
    "Monthly Interest Equiv.": `${currency.symbol}${formatValue(monthlyInterest)}`,
    "Total Maturity Value": `${currency.symbol}${formatValue(totalAmount)}`,
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
  };

  return (
    <>
      <ToolSEO tool={toolData} guideData={guideData} />

      <div className="container">
        <div className="tool-intro" style={{textAlign: 'center', marginBottom: '30px'}}>
            <h1 style={{fontSize: '2.5rem', color: 'var(--primary)'}}>💰 Simple Interest</h1>
            <p style={{color: '#666'}}>Calculate interest earned or payable on a fixed principal amount.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()}>
              <CalculatorInput label="Principal Amount" value={principal} onChange={setPrincipal} icon={currency.symbol} />
              
              <CalculatorInput label="Annual Interest Rate" value={rate} onChange={setRate} suffix="%" />

              <div className="input-row" style={{alignItems: 'flex-end'}}>
                <div style={{flex: '2'}}>
                    <CalculatorInput label={`Time Period (${timeUnit})`} value={time} onChange={setTime} />
                </div>
                <div style={{flex: '1', marginBottom: '15px'}}>
                    <label className="input-label" style={{fontSize: '0.8rem'}}>Unit</label>
                    <select 
                        value={timeUnit} 
                        onChange={(e) => setTimeUnit(e.target.value)}
                        style={{width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer'}}
                    >
                        <option value="years">Years</option>
                        <option value="months">Months</option>
                    </select>
                </div>
              </div>
            </CalculatorForm>

            <div style={{marginTop: '25px'}}>
                <Link href="/blog/simple-interest-guide" className="read-guide-card" style={{display: 'block', textDecoration: 'none'}}>
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
              <div className="result-box" style={{background: '#f8fafc', color: '#64748b', textAlign: 'center'}}>
                Enter amount and time to see the calculation breakdown.
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        <div className="info-card" style={{marginTop: '40px', padding: '25px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0'}}>
            <h3 style={{color: 'var(--primary)', marginBottom: '10px'}}>The Simple Interest Formula</h3>
            <p style={{fontSize: '0.95rem', color: '#475569', marginBottom: '15px'}}>
                Simple interest is calculated using the standard formula:
            </p>
            
            {/* CSS-based Fraction to replace problematic LaTeX */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 'bold', margin: '20px 0' }}>
              <span>SI = </span>
              <div style={{ textAlign: 'center' }}>
                <div style={{ borderBottom: '2px solid var(--primary)', padding: '0 10px' }}>P × R × T</div>
                <div>100</div>
              </div>
            </div>
             <p style={{fontSize: '0.95rem', color: '#475569', lineHeight: '1.6', marginTop: '15px'}}>
              Unlike <strong>Compound Interest</strong>, where interest is earned on both the principal and previous interest, 
              <strong>Simple Interest</strong> is only calculated on the original Principal. 
              For example, a {currency.symbol}{formatValue(1000)} loan at 10% will always cost 
              you {currency.symbol}{formatValue(100)} in interest every year, no matter how long the term is. 
              This makes it ideal for short-term personal loans and bridge financing.
          </p>
        </div>
      </div>
    </>
  );
}