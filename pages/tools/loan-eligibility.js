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

export default function LoanEligibilityCalculator() {
  const { currency } = useCurrency();
  // Automatically find the data for THIS tool
  const toolData = tools.find(t => t.link === '/tools/loan-eligibility');
  const guideData = Object.values(allToolGuides).find(g => g.tool === "loan-eligibility");
  const [income, setIncome] = useState(100000);
  const [existingEMI, setExistingEMI] = useState(0);
  const [interestRate, setInterestRate] = useState(9.5);
  const [loanTerm, setLoanTerm] = useState(20);
  const [foir, setFoir] = useState(50); 
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const calculateEligibility = () => {
    const monthlyIncome = parseFloat(income) || 0;
    const currentEMI = parseFloat(existingEMI) || 0;
    const rate = parseFloat(interestRate) || 0;
    const years = parseFloat(loanTerm) || 0;
    const ratio = parseFloat(foir) / 100;

    if (monthlyIncome <= 0 || rate <= 0 || years <= 0) {
        setResult(null);
        setError(income <= 0 ? "Income must be greater than zero." : "");
        return;
    }
    setError("");

    const totalMaxEMIAllowed = monthlyIncome * ratio;
    const availableEMI = Math.max(0, totalMaxEMIAllowed - currentEMI);
    const n = years * 12;
    const r = rate / (12 * 100);

    // Present Value formula to find max loan amount
    const eligibleLoan = r > 0 ? (availableEMI * (1 - Math.pow(1 + r, -n))) / r : 0;

    setResult({
      "Max Monthly EMI Capacity": totalMaxEMIAllowed, // Raw number
      "Available EMI for New Loan": availableEMI,     // Raw number
      "Maximum Eligible Loan": Math.round(eligibleLoan), // Raw number
      "Debt-to-Income (DTI) Ratio": `${((currentEMI / monthlyIncome) * 100).toFixed(1)}%`,
      "Safety Margin Status": availableEMI > 0 ? "Eligible ✅" : "Over-leveraged ⚠️"
    });
  };

  useEffect(() => {
    calculateEligibility();
  }, [income, existingEMI, interestRate, loanTerm, foir]);

  const handleReset = () => {
    setIncome(""); 
    setExistingEMI(""); 
    setInterestRate(9.5); 
    setLoanTerm(20); 
    setFoir(50);
    setResult(null);
    setError("");
  };

  return (
    <>
      <ToolSEO tool={toolData} guideData={guideData} />

      <div className="container">
        <div className="tool-intro" style={{textAlign: 'center', marginBottom: '30px'}}>
            <h1 style={{fontSize: '2.5rem', color: 'var(--primary)'}}>🏦 Loan Eligibility Calculator</h1>
            <p style={{color: '#666'}}>Find out exactly how much a financial institution is likely to lend you.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()} error={error}>
              
              <CalculatorInput label="Monthly Net Salary (Take-home)" value={income} onChange={setIncome} icon={currency.symbol} />
              <CalculatorInput label="Existing EMIs (Loans/Credit Cards)" value={existingEMI} onChange={setExistingEMI} icon={currency.symbol} />

              <div className="input-row">
                <CalculatorInput label="Interest Rate" value={interestRate} onChange={setInterestRate} suffix="%" />
                <CalculatorInput label="Tenure (Years)" value={loanTerm} onChange={setLoanTerm} suffix="Yrs" />
              </div>

              <button 
                type="button" 
                onClick={() => setShowAdvanced(!showAdvanced)}
                style={{
                  marginTop: '10px', width: '100%', padding: '10px', 
                  background: 'transparent', border: '1px dashed #cbd5e1', 
                  borderRadius: '8px', cursor: 'pointer', color: '#475569', fontSize: '0.85rem'
                }}
              >
                {showAdvanced ? "▲ Hide Bank Criteria" : "▼ Adjust Bank Criteria (FOIR)"}
              </button>

              {showAdvanced && (
                <div style={{marginTop: '15px', padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0'}}>
                  <label className="input-label" style={{display: 'block', marginBottom: '10px'}}>
                    Bank's FOIR Margin: <strong>{foir}%</strong>
                  </label>
                  <input 
                    type="range" min="30" max="70" step="5" value={foir} 
                    onChange={(e) => setFoir(e.target.value)}
                    style={{width: '100%', accentColor: 'var(--primary)', cursor: 'pointer'}}
                  />
                  <p style={{fontSize: '0.75rem', color: '#64748b', marginTop: '10px'}}>
                    *FOIR is the percentage of income allowed for debt. 50% is a global standard for conservative lending.
                  </p>
                </div>
              )}
            </CalculatorForm>

            <div style={{marginTop: '25px'}}>
                <Link href="/blog/loan-eligibility-guide" className="read-guide-card" style={{display: 'block', textDecoration: 'none'}}>
                    📖 Guide: 5 Ways to Increase Your Loan Eligibility
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox title="Eligibility Summary" results={result} />
            ) : (
              <div className="result-box" style={{background: '#f8fafc', color: '#64748b', textAlign: 'center'}}>
                Enter your income details to see your borrowing limit.
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        <div className="info-card" style={{marginTop: '40px', padding: '25px', background: '#eff6ff', borderRadius: '12px', border: '1px solid #bfdbfe'}}>
            <h3 style={{color: '#1e40af', marginBottom: '10px'}}>What is FOIR?</h3>
              <p style={{fontSize: '0.95rem', color: '#1e40af', lineHeight: '1.6'}}>
                Banks use <strong>FOIR</strong> to ensure you aren't "house poor." If you earn 
                {formatCurrency(income || 0)} and the bank uses a 50% FOIR, they limit your total debt payments 
                (old loans + new loan) to {formatCurrency((income || 0) * 0.5)}. If you already pay 
                {formatCurrency(existingEMI || 0)} in EMIs, your eligibility decreases significantly.
            </p>
            
        </div>
      </div>
    </>
  );
}