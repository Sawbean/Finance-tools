import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function LoanCalculator() {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(12);
  const [duration, setDuration] = useState(1);
  const [durationType, setDurationType] = useState("years");
  const [result, setResult] = useState(null);

  // International/Indian Number Formatting Logic
  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-IN').format(Math.round(num));
  };

  const calculateLoan = () => {
    const P = parseFloat(amount) || 0;
    const R = parseFloat(rate) || 0;
    const D = parseFloat(duration) || 0;

    if (P <= 0 || R <= 0 || D <= 0) return;

    // Simple Interest Calculation for basic Loan Calculator
    // (Note: For reducing balance, use the EMI formula from emi.js)
    const T = durationType === "years" ? D : D / 12;
    const interest = (P * R * T) / 100;
    const totalPayable = P + interest;

    setResult({
      "Principal Amount": P,
      "Total Interest": interest,
      "Total Payable": totalPayable,
    });
  };

  const resetForm = () => {
    setAmount("");
    setRate("");
    setDuration("");
    setResult(null);
  };

  // Auto-calculate on input change for premium feel
  useEffect(() => {
    calculateLoan();
  }, [amount, rate, duration, durationType]);

  return (
    <>
      <Head>
        <title>Professional Loan Calculator | ToolFinance</title>
        <meta name="description" content="Calculate total interest and total payable loan amount with our easy-to-use tool." />
      </Head>

      <div className="container">
        {/* HEADER SECTION */}
        <div className="tool-intro" style={{textAlign: 'center', marginBottom: '30px'}}>
            <h1 style={{fontSize: '2.5rem', color: 'var(--primary)'}}>Loan Calculator</h1>
            <p style={{color: '#666'}}>Quickly estimate your simple interest and total repayment amount.</p>
        </div>

        <div className="calculator-grid">
          
          {/* LEFT COLUMN: INPUTS */}
          <div className="form-box">
            <CalculatorForm 
              onSubmit={(e) => {
                e.preventDefault();
                calculateLoan();
              }}
              customButtons={
                <>
                  <button type="submit" className="calc-btn">
                     Calculate Interest
                  </button>
                  <button type="button" className="reset-btn" onClick={resetForm}>
                     Reset
                  </button>
                </>
              }
            >
              
              <CalculatorInput
                label="Loan Amount"
                value={amount}
                onChange={setAmount}
                icon="Rs"
              />

              <div className="input-row">
                <CalculatorInput
                  label="Interest Rate"
                  value={rate}
                  onChange={setRate}
                  suffix="%"
                />
                
                <div className="tenure-group">
                    <label className="input-label">Tenure ({durationType})</label>
                    <div style={{display: 'flex', gap: '8px'}}>
                        <input 
                            type="number" 
                            className="input-wrapper" 
                            style={{width: '60%', padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db'}}
                            value={duration} 
                            onChange={(e) => setDuration(e.target.value)} 
                        />
                        <select 
                            style={{width: '40%', borderRadius: '10px', border: '1px solid #d1d5db', padding: '10px', background: '#fff'}}
                            value={durationType} 
                            onChange={(e) => setDurationType(e.target.value)}
                        >
                            <option value="years">Years</option>
                            <option value="months">Months</option>
                        </select>
                    </div>
                </div>
              </div>
            </CalculatorForm>
          </div>

          {/* RIGHT COLUMN: RESULTS & SIDEBAR */}
          <div className="result-side">
            {result ? (
              <ResultBox
                title="Loan Summary"
                results={result}
                formatCurrency={formatCurrency}
              />
            ) : (
              <div className="result-box" style={{background: '#f8fafc', color: '#64748b', textAlign: 'center'}}>
                Enter values to see your loan breakdown
              </div>
            )}
            
            <div className="sidebar-ad">
               <AdPlaceholder />
            </div>

            <Link href="/blog/loan-calculator-guide" className="sidebar-guide-link">
                📖 Read the Full Loan Guide
            </Link>
          </div>
          
        </div>
      </div>
    </>
  );
}