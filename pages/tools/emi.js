import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

// Import global utilities
import { formatCurrency, globalCurrency } from "../../utils/formatters"; 

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function EMICalculator() {
  // 1. STATE MANAGEMENT
  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(10.5);
  const [duration, setDuration] = useState(5);
  const [durationType, setDurationType] = useState("years");
  const [result, setResult] = useState(null);

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [extraPayment, setExtraPayment] = useState("");
  const [processingFee, setProcessingFee] = useState("");
  const [insurance, setInsurance] = useState("");

  // 2. CALCULATION LOGIC
  const calculateEMI = () => {
    const P = parseFloat(principal) || 0;
    const R = parseFloat(rate) || 0;
    let D = parseFloat(duration) || 0;
    const extra = parseFloat(extraPayment) || 0;
    const feeP = parseFloat(processingFee) || 0;
    const ins = parseFloat(insurance) || 0;

    if (P <= 0 || R <= 0 || D <= 0) return;

    const n = durationType === "years" ? D * 12 : D;
    const r = R / (12 * 100);
    
    let emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    emi += extra;

    const totalPayable = (emi * n) + (P * (feeP / 100)) + ins;
    const totalInterest = totalPayable - P - ins - (P * (feeP / 100));

    setResult({
      "Monthly EMI": emi,
      "Total Interest": totalInterest,
      "Total Amount": totalPayable
    });
  };

  const resetForm = () => {
    setPrincipal("");
    setRate("");
    setDuration("");
    setExtraPayment("");
    setProcessingFee("");
    setInsurance("");
    setResult(null);
  };

  useEffect(() => {
    calculateEMI();
  }, [principal, rate, duration, durationType, extraPayment, processingFee, insurance]);

  return (
    <>
      <Head>
        <title>Global EMI Calculator | ToolFinance</title>
        <meta name="description" content="Professional EMI calculator with advanced payment options." />
      </Head>

      <div className="container">
        <div className="tool-intro" style={{textAlign: 'center', marginBottom: '30px'}}>
            <h1 style={{fontSize: '2.5rem', color: 'var(--primary)'}}>EMI Calculator</h1>
            <p style={{color: '#666'}}>Plan your loans with precision using our global financial tools.</p>
        </div>

        <div className="calculator-grid">
          
          {/* LEFT COLUMN: FORM INPUTS */}
          <div className="form-box">
            <CalculatorForm 
              onSubmit={(e) => {
                e.preventDefault();
                calculateEMI();
              }}
              customButtons={
                <>
                  <button type="submit" className="calc-btn">Calculate My EMI</button>
                  <button type="button" className="reset-btn" onClick={resetForm}>Reset</button>
                </>
              }
            >
              
              <CalculatorInput
                label="Loan Amount"
                value={principal}
                onChange={setPrincipal}
                icon={globalCurrency} 
              />

              <div className="input-row">
                <CalculatorInput label="Interest Rate" value={rate} onChange={setRate} suffix="%" />
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

              <div className="advanced-toggle-container">
                <button type="button" className="advanced-btn" onClick={() => setShowAdvanced(!showAdvanced)}>
                  {showAdvanced ? "▲ Hide Advanced Options" : "▼ Show Advanced Options"}
                </button>
              </div>

              {showAdvanced && (
                <div className="advanced-fields">
                  <CalculatorInput
                    label="Extra Monthly Payment"
                    value={extraPayment}
                    onChange={setExtraPayment}
                    icon={globalCurrency}
                  />
                  <div className="advanced-row">
                    <CalculatorInput label="Fee (%)" value={processingFee} onChange={setProcessingFee} suffix="%" />
                    <CalculatorInput label="Insurance" value={insurance} onChange={setInsurance} icon={globalCurrency} />
                  </div>
                </div>
              )}
            </CalculatorForm>
          </div>

          {/* RIGHT COLUMN: RESULTS & SIDEBAR */}
          <div className="result-side">
            {result ? (
              <ResultBox
                title="Repayment Summary"
                results={result}
                formatCurrency={formatCurrency}
              />
            ) : (
              <div className="result-box" style={{background: '#f8fafc', color: '#64748b', textAlign: 'center'}}>
                Enter values to see your breakdown
              </div>
            )}
            
            <div className="sidebar-ad">
               <AdPlaceholder />
            </div>

            <Link href="/blog/emi-calculator-guide" className="sidebar-guide-link">
                📖 Read the Full EMI Guide
            </Link>
          </div>
          
        </div>
      </div>
    </>
  );
}