import { useState, useEffect } from "react";
import Link from "next/link"; 

// Import global utilities
import { formatCurrency, globalCurrency } from "../../utils/formatters"; 
import { allToolGuides } from '../../data/tool-guides/index';
import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";
import { tools } from '../../data/tools';
import ToolSEO from '../../components/layout/ToolSEO';

export default function LoanCalculator() {
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

  // 2. CALCULATION LOGIC
  const calculateLoan = () => {
    const P = parseFloat(amount) || 0;
    const R = parseFloat(rate) || 0;
    const D = parseFloat(duration) || 0;

    if (P <= 0 || R <= 0 || D <= 0) return;

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
      "Principal Amount": P,
      [`Total ${calculationMethod === 'simple' ? 'Simple' : 'Compound'} Interest`]: totalInterest,
      "Total Repayment": totalPayable,
      "Interest Impact": `${((totalInterest / P) * 100).toFixed(2)}% of Principal`
    });
  };

  useEffect(() => {
    calculateLoan();
  }, [amount, rate, duration, durationType, calculationMethod]);

  // Clean Reset Handler passed to the component
  const handleReset = () => {
    setAmount(""); 
    setRate(""); 
    setDuration("");
    setResult(null);
  };

  return (
    <>
      <ToolSEO tool={toolData} guideData={guideData} />

      <div className="container">
        <div className="tool-intro" style={{textAlign: 'center', marginBottom: '30px'}}>
            <h1 style={{fontSize: '2.5rem', color: 'var(--primary)'}}>🏛️ Loan Calculator</h1>
            <p style={{color: '#666'}}>Calculate your debt obligation with precision.</p>
        </div>

        {/* METHOD TOGGLE */}
        <div style={{display: 'flex', justifyContent: 'center', marginBottom: '35px'}}>
            <div style={{background: '#f1f5f9', padding: '6px', borderRadius: '50px', display: 'inline-flex', border: '1px solid #e2e8f0'}}>
                <button 
                    onClick={() => setCalculationMethod("simple")}
                    style={{padding: '10px 25px', borderRadius: '50px', border: 'none', cursor: 'pointer', transition: '0.3s', background: calculationMethod === 'simple' ? 'var(--primary)' : 'transparent', color: calculationMethod === 'simple' ? '#fff' : '#64748b', fontWeight: 'bold'}}
                >Simple Interest</button>
                <button 
                    onClick={() => setCalculationMethod("compound")}
                    style={{padding: '10px 25px', borderRadius: '50px', border: 'none', cursor: 'pointer', transition: '0.3s', background: calculationMethod === 'compound' ? 'var(--primary)' : 'transparent', color: calculationMethod === 'compound' ? '#fff' : '#64748b', fontWeight: 'bold'}}
                >Compound Interest</button>
            </div>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            {/* onReset prop ensures only the component's default reset button is used */}
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()}>
              <CalculatorInput label="Principal Amount" value={amount} onChange={setAmount} icon={globalCurrency} />
              
              <div className="input-row">
                <CalculatorInput label="Annual Rate" value={rate} onChange={setRate} suffix="%" />
                <div style={{flex: 1}}>
                    <label className="input-label">Tenure</label>
                    <div style={{display: 'flex', gap: '5px'}}>
                        <input type="number" className="input-wrapper" style={{width: '60%'}} value={duration} onChange={(e) => setDuration(e.target.value)} />
                        <select className="input-wrapper" style={{width: '40%'}} value={durationType} onChange={(e) => setDurationType(e.target.value)}>
                            <option value="years">Yrs</option>
                            <option value="months">Mo</option>
                        </select>
                    </div>
                </div>
              </div>
            </CalculatorForm>

            <div style={{marginTop: '25px'}}>
                <Link href="/blog/loan-types-guide" className="read-guide-card" style={{display: 'block', textDecoration: 'none'}}>
                    📖 Loan Guide: Understanding interest rates
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox title="Repayment Summary" results={result} formatCurrency={formatCurrency} />
            ) : (
              <div className="result-box" style={{background: '#f8fafc', color: '#64748b', textAlign: 'center'}}>
                Enter loan details to view breakdown.
              </div>
            )}
            <div className="sidebar-ad"><AdPlaceholder /></div>
          </div>
        </div>

        <div className="info-card" style={{marginTop: '40px', padding: '25px', background: '#f0f9ff', borderRadius: '12px', border: '1px solid #bae6fd'}}>
            <h3 style={{color: '#0369a1', marginBottom: '10px'}}>💡 Simple vs. Compound Interest</h3>
            <p style={{fontSize: '0.9rem', color: '#0369a1', lineHeight: '1.6'}}>
                <strong>Simple Interest</strong> is calculated only on the initial principal. 
                <strong> Compound Interest</strong> is "interest on interest"—it is calculated on the principal plus any interest that has already accumulated.
            </p>
            
        </div>
      </div>
    </>
  );
}