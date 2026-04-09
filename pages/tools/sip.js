import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

// Import global utilities
import { formatCurrency, globalCurrency } from "../../utils/formatters"; 

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function SIPCalculator() {
  // 1. STATE MANAGEMENT
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  
  // Advanced Top-up State
  const [stepUp, setStepUp] = useState(0); 
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [result, setResult] = useState(null);

  // 2. CALCULATION LOGIC
  const calculateSIP = () => {
    const P = parseFloat(monthlyInvestment) || 0;
    const R = parseFloat(rate) || 0;
    const Y = parseFloat(years) || 0;
    const S = parseFloat(stepUp) || 0;

    if (P <= 0 || R <= 0 || Y <= 0) return;

    let totalValue = 0;
    let totalInvested = 0;
    let currentMonthlyP = P;
    const r = R / (12 * 100);

    // If there's a step-up, we calculate year by year
    if (S > 0) {
      for (let i = 1; i <= Y; i++) {
        // Future value of 12 months of current investment
        const n = 12;
        const yearlyFV = currentMonthlyP * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
        
        // Add existing corpus growth for the year + the new year's SIP
        totalValue = (totalValue * Math.pow(1 + r, 12)) + yearlyFV;
        totalInvested += (currentMonthlyP * 12);
        
        // Increase investment for next year
        currentMonthlyP += (currentMonthlyP * (S / 100));
      }
    } else {
      // Standard SIP Formula
      const n = Y * 12;
      totalValue = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      totalInvested = P * n;
    }

    setResult({
      "Total Investment": totalInvested,
      "Estimated Returns": totalValue - totalInvested,
      "Total Wealth Created": totalValue,
    });
  };

  const resetForm = () => {
    setMonthlyInvestment("");
    setRate("");
    setYears("");
    setStepUp(0);
    setResult(null);
  };

  // Auto-calculate for smooth UX
  useEffect(() => {
    calculateSIP();
  }, [monthlyInvestment, rate, years, stepUp]);

  return (
    <>
      <Head>
        <title>SIP Calculator with Step-Up Feature | ToolFinance</title>
        <meta 
          name="description" 
          content="Calculate your mutual fund SIP returns. Use the step-up feature to see how increasing your monthly investment grows your wealth." 
        />
      </Head>

      <div className="container">
        {/* HEADER SECTION */}
        <div className="tool-intro" style={{textAlign: 'center', marginBottom: '30px'}}>
            <h1 style={{fontSize: '2.5rem', color: 'var(--primary)'}}>📈 SIP Calculator</h1>
            <p style={{color: '#666'}}>Visualize your long-term wealth creation through Systematic Investment Plans.</p>
        </div>

        <div className="calculator-grid">
          
          {/* LEFT COLUMN: INPUTS */}
          <div className="form-box">
            <CalculatorForm 
              onSubmit={(e) => { e.preventDefault(); calculateSIP(); }}
              customButtons={
                <>
                  <button type="submit" className="calc-btn">Calculate Growth</button>
                  <button type="button" className="reset-btn" onClick={resetForm}>Reset</button>
                </>
              }
            >
              
              <CalculatorInput
                label="Monthly Investment"
                value={monthlyInvestment}
                onChange={setMonthlyInvestment}
                icon={globalCurrency}
              />

              <div className="input-row">
                <CalculatorInput
                  label="Expected Return Rate"
                  value={rate}
                  onChange={setRate}
                  suffix="%"
                />
                <CalculatorInput
                  label="Time Period"
                  value={years}
                  onChange={setYears}
                  suffix="Years"
                />
              </div>

              {/* Advanced Step-Up Toggle */}
              <div className="advanced-toggle-container">
                <button 
                  type="button" 
                  className="advanced-btn" 
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  {showAdvanced ? "▲ Hide Step-Up Option" : "▼ Add Annual Step-Up (%)"}
                </button>
              </div>

              {showAdvanced && (
                <div className="advanced-fields">
                  <CalculatorInput 
                      label="Annual Investment Increase" 
                      value={stepUp} 
                      onChange={setStepUp} 
                      suffix="%" 
                      placeholder="e.g. 10"
                  />
                  <p style={{fontSize: '0.8rem', color: '#64748b', marginTop: '5px'}}>
                    *Increasing your SIP every year significantly boosts your final corpus.
                  </p>
                </div>
              )}

            </CalculatorForm>
          </div>

          {/* RIGHT COLUMN: RESULTS & SIDEBAR */}
          <div className="result-side">
            {result ? (
              <ResultBox
                title="Investment Summary"
                results={result}
                formatCurrency={formatCurrency}
              />
            ) : (
              <div className="result-box" style={{background: '#f8fafc', color: '#64748b', textAlign: 'center'}}>
                Enter details to see your future wealth
              </div>
            )}
            
            <div className="sidebar-ad">
               <AdPlaceholder />
            </div>

            <Link href="/blog/sip-calculator-guide" className="sidebar-guide-link">
                📖 Why SIP is better than Lumpsum?
            </Link>
          </div>
          
        </div>
      </div>
    </>
  );
}