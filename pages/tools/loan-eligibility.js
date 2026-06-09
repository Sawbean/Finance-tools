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
      "Max Monthly EMI Capacity": totalMaxEMIAllowed,
      "Available EMI for New Loan": availableEMI,
      "Maximum Eligible Loan": Math.round(eligibleLoan),
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
        <div className="tool-intro">
            <h1>🏦 Loan Eligibility Calculator</h1>
            <p>Find out exactly how much a financial institution is likely to lend you.</p>
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
                className="advanced-toggle-btn"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? "▲ Hide Bank Criteria" : "▼ Adjust Bank Criteria (FOIR)"}
              </button>

              {showAdvanced && (
                <div className="advanced-fields-box">
                  <label className="input-label">
                    Bank's FOIR Margin: <strong>{foir}%</strong>
                  </label>
                  <input 
                    type="range" min="30" max="70" step="5" value={foir} 
                    onChange={(e) => setFoir(e.target.value)}
                    className="range-input"
                  />
                  <p className="helper-text">
                    *FOIR is the percentage of income allowed for debt. 50% is a global standard for conservative lending.
                  </p>
                </div>
              )}
            </CalculatorForm>

            <div className="guide-card-wrapper">
                <Link href="/blog/loan-eligibility-guide" className="read-guide-card">
                    📖 Guide: 5 Ways to Increase Your Loan Eligibility
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox title="Eligibility Summary" results={result} />
            ) : (
              <div className="result-box-empty">
                Enter your income details to see your borrowing limit.
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        <div className="info-card foir-info-card">
            <h3>What is FOIR?</h3>
              <p>
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