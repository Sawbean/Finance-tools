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
  const [homePrice, setHomePrice] = useState(5000000);
  const [downPayment, setDownPayment] = useState(1000000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);
  
  const [propertyTax, setPropertyTax] = useState(0.1);
  const [insurance, setInsurance] = useState(15000);   
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [result, setResult] = useState(null);

  // 2. CALCULATION LOGIC
  const calculateMortgage = () => {
    const P_Home = parseFloat(homePrice) || 0;
    const DP = parseFloat(downPayment) || 0;
    const R = parseFloat(rate) || 0;
    const Y = parseFloat(years) || 0;

    const principal = P_Home - DP;
    const downPaymentPercent = (DP / P_Home) * 100;

    if (principal <= 0 || R <= 0 || Y <= 0) return;

    const N = Y * 12;
    const monthlyRate = R / (12 * 100);
    
    const monthlyPI = (principal * monthlyRate * Math.pow(1 + monthlyRate, N)) / (Math.pow(1 + monthlyRate, N) - 1);
    const monthlyTax = (P_Home * (parseFloat(propertyTax) / 100)) / 12;
    const monthlyIns = (parseFloat(insurance) || 0) / 12;

    const totalMonthly = monthlyPI + monthlyTax + monthlyIns;

    setResult({
      "Total Loan Amount": principal,
      "Down Payment (%)": `${downPaymentPercent.toFixed(1)}%`,
      "Monthly P & I": monthlyPI,
      "Property Tax & Ins": monthlyTax + monthlyIns,
      "Total Monthly Payment": totalMonthly,
      "Total Interest (Full Term)": (monthlyPI * N) - principal
    });
  };

  useEffect(() => {
    calculateMortgage();
  }, [homePrice, downPayment, rate, years, propertyTax, insurance]);

  const handleReset = () => {
    setHomePrice(""); setDownPayment(""); setRate(""); setYears("");
    setResult(null);
  };

  return (
    <>
      <Head>
        <title>Mortgage Calculator | Home Loan PITI Estimator | ToolFinance</title>
        <meta name="description" content="Estimate your total monthly mortgage including principal, interest, taxes, and insurance." />
      </Head>

      <div className="container">
        <div className="tool-intro" style={{textAlign: 'center', marginBottom: '30px'}}>
            <h1 style={{fontSize: '2.5rem', color: 'var(--primary)'}}>🏠 Mortgage Calculator</h1>
            <p style={{color: '#666'}}>Calculate your true cost of home ownership including hidden fees.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            {/* Standardized: onReset prop handles the button, no extra button needed below */}
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()}>
              
              <CalculatorInput label="Home Purchase Price" value={homePrice} onChange={setHomePrice} icon={globalCurrency} />
              
              <div className="input-row">
                <CalculatorInput label="Down Payment" value={downPayment} onChange={setDownPayment} icon={globalCurrency} />
                <div style={{flex: 1, padding: '35px 10px 0', fontSize: '0.9rem', color: '#64748b'}}>
                    <strong>{((downPayment/homePrice)*100 || 0).toFixed(1)}%</strong> of price
                </div>
              </div>

              <div className="input-row">
                <CalculatorInput label="Interest Rate" value={rate} onChange={setRate} suffix="%" />
                <CalculatorInput label="Loan Term" value={years} onChange={setYears} suffix="Years" />
              </div>

              {/* Styled Advanced Toggle */}
              <button 
                type="button" 
                onClick={() => setShowAdvanced(!showAdvanced)} 
                style={{
                    marginTop: '10px', width: '100%', padding: '10px', 
                    background: 'transparent', border: '1px dashed #cbd5e1', 
                    borderRadius: '8px', cursor: 'pointer', color: '#475569', fontSize: '0.85rem'
                }}
              >
                {showAdvanced ? "▲ Hide Taxes & Insurance" : "▼ Add Taxes & Insurance"}
              </button>

              {showAdvanced && (
                <div style={{marginTop: '15px', padding: '15px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0'}}>
                  <div className="input-row">
                    <CalculatorInput label="Property Tax (%)" value={propertyTax} onChange={setPropertyTax} suffix="%" />
                    <CalculatorInput label="Annual Insurance" value={insurance} onChange={setInsurance} icon={globalCurrency} />
                  </div>
                </div>
              )}
            </CalculatorForm>

            {/* Standardized Guide Card: Moved INSIDE the form area for consistency */}
            <div style={{marginTop: '25px'}}>
                <Link href="/blog/mortgage-tips" className="read-guide-card" style={{display: 'block', textDecoration: 'none'}}>
                    📖 Home Loan Guide: 5 Mistakes to Avoid in Nepal
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox title="Payment Breakdown" results={result} formatCurrency={formatCurrency} />
            ) : (
              <div className="result-box" style={{background: '#f8fafc', color: '#64748b', textAlign: 'center'}}>
                Enter property details to see monthly costs.
              </div>
            )}
            <div className="sidebar-ad"><AdPlaceholder /></div>
          </div>
        </div>

        {/* Standardized Insight Card */}
        <div className="info-card" style={{marginTop: '40px', padding: '25px', background: '#fffbeb', borderRadius: '12px', border: '1px solid #fef3c7'}}>
            <h3 style={{color: '#92400e', marginBottom: '10px'}}>⚖️ What is PITI?</h3>
            <p style={{fontSize: '0.9rem', color: '#92400e', lineHeight: '1.6'}}>
                PITI stands for <strong>Principal, Interest, Taxes, and Insurance</strong>. Most home buyers only look at the first two, but property taxes and homeowners insurance can add significantly to your monthly bill.
            </p>
        </div>
      </div>
    </>
  );
}