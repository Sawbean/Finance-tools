import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

// Import global utilities
import { formatCurrency, globalCurrency } from "../../utils/formatters"; 

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function MortgageCalculator() {
  // 1. STATE MANAGEMENT
  const [homePrice, setHomePrice] = useState(300000);
  const [downPayment, setDownPayment] = useState(60000);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);
  
  // Advanced PITI States
  const [propertyTax, setPropertyTax] = useState(1.2); // Yearly %
  const [insurance, setInsurance] = useState(1200);   // Yearly fixed
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [result, setResult] = useState(null);

  // 2. CALCULATION LOGIC
  const calculateMortgage = () => {
    const P_Home = parseFloat(homePrice) || 0;
    const DP = parseFloat(downPayment) || 0;
    const R = parseFloat(rate) || 0;
    const Y = parseFloat(years) || 0;

    const principal = P_Home - DP;

    if (principal <= 0 || R <= 0 || Y <= 0) return;

    const N = Y * 12;
    const monthlyRate = R / (12 * 100);
    
    // Monthly Principal & Interest (EMI)
    const monthlyPI =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, N)) /
      (Math.pow(1 + monthlyRate, N) - 1);

    // Monthly Tax & Insurance
    const monthlyTax = (P_Home * (parseFloat(propertyTax) / 100)) / 12;
    const monthlyIns = (parseFloat(insurance) || 0) / 12;

    const totalMonthly = monthlyPI + monthlyTax + monthlyIns;
    const totalPayment = (monthlyPI * N) + DP;
    const totalInterest = (monthlyPI * N) - principal;

    setResult({
      "Loan Amount": principal,
      "Monthly P&I": monthlyPI,
      "Monthly Tax & Ins": monthlyTax + monthlyIns,
      "Total Monthly Pay": totalMonthly,
      "Total Interest": totalInterest,
      "Total Cost of Home": totalPayment + (monthlyTax * N) + (monthlyIns * N),
    });
  };

  const resetForm = () => {
    setHomePrice("");
    setDownPayment("");
    setRate("");
    setYears("");
    setResult(null);
  };

  // Auto-calculate for premium experience
  useEffect(() => {
    calculateMortgage();
  }, [homePrice, downPayment, rate, years, propertyTax, insurance]);

  return (
    <>
      <Head>
        <title>Mortgage Calculator with Taxes & Insurance | ToolFinance</title>
        <meta 
          name="description" 
          content="Calculate your total monthly mortgage payment including principal, interest, taxes, and insurance (PITI). Plan your home purchase accurately." 
        />
      </Head>

      <div className="container">
        {/* HEADER SECTION */}
        <div className="tool-intro" style={{textAlign: 'center', marginBottom: '30px'}}>
            <h1 style={{fontSize: '2.5rem', color: 'var(--primary)'}}>🏠 Mortgage Calculator</h1>
            <p style={{color: '#666'}}>Get a complete breakdown of your monthly home loan payments.</p>
        </div>

        <div className="calculator-grid">
          
          {/* LEFT COLUMN: INPUTS */}
          <div className="form-box">
            <CalculatorForm 
              onSubmit={(e) => { e.preventDefault(); calculateMortgage(); }}
              customButtons={
                <>
                  <button type="submit" className="calc-btn">Calculate Payment</button>
                  <button type="button" className="reset-btn" onClick={resetForm}>Reset</button>
                </>
              }
            >
              
              <div className="input-row">
                <CalculatorInput
                  label="Home Price"
                  value={homePrice}
                  onChange={setHomePrice}
                  icon={globalCurrency}
                />
                <CalculatorInput
                  label="Down Payment"
                  value={downPayment}
                  onChange={setDownPayment}
                  icon={globalCurrency}
                />
              </div>

              <div className="input-row">
                <CalculatorInput
                  label="Interest Rate"
                  value={rate}
                  onChange={setRate}
                  suffix="%"
                />
                <CalculatorInput
                  label="Loan Term"
                  value={years}
                  onChange={setYears}
                  suffix="Years"
                />
              </div>

              {/* Advanced Options Toggle */}
              <div className="advanced-toggle-container">
                <button 
                  type="button" 
                  className="advanced-btn" 
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  {showAdvanced ? "▲ Hide Taxes & Insurance" : "▼ Include Taxes & Insurance"}
                </button>
              </div>

              {showAdvanced && (
                <div className="advanced-fields">
                  <div className="advanced-row">
                    <CalculatorInput 
                        label="Property Tax (Yearly %)" 
                        value={propertyTax} 
                        onChange={setPropertyTax} 
                        suffix="%" 
                    />
                    <CalculatorInput 
                        label="Home Insurance (Yearly)" 
                        value={insurance} 
                        onChange={setInsurance} 
                        icon={globalCurrency} 
                    />
                  </div>
                </div>
              )}

            </CalculatorForm>
          </div>

          {/* RIGHT COLUMN: RESULTS & SIDEBAR */}
          <div className="result-side">
            {result ? (
              <ResultBox
                title="Monthly Payment Breakdown"
                results={result}
                formatCurrency={formatCurrency}
              />
            ) : (
              <div className="result-box" style={{background: '#f8fafc', color: '#64748b', textAlign: 'center'}}>
                Enter loan details to see your monthly estimate
              </div>
            )}
            
            <div className="sidebar-ad">
               <AdPlaceholder />
            </div>

            <Link href="/blog/mortgage-calculator-guide" className="sidebar-guide-link">
                📖 Understanding Principal vs. Interest
            </Link>
          </div>
          
        </div>
      </div>
    </>
  );
}