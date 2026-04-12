import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

// Import global utilities
import { formatCurrency, globalCurrency } from "../../utils/formatters"; 

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function FDRDCalculator() {
  // 1. STATE MANAGEMENT
  const [activeTab, setActiveTab] = useState("fd");
  
  // FD States
  const [fdPrincipal, setFdPrincipal] = useState(100000);
  const [fdRate, setFdRate] = useState(8.5);
  const [fdYears, setFdYears] = useState(5);

  // RD States
  const [rdMonthly, setRdMonthly] = useState(5000);
  const [rdRate, setRdRate] = useState(7.5);
  const [rdYears, setRdYears] = useState(3);

  const [result, setResult] = useState(null);

  // 2. CALCULATION LOGIC
  const calculateResult = () => {
    if (activeTab === "fd") {
      const P = parseFloat(fdPrincipal) || 0;
      const R = parseFloat(fdRate) || 0;
      const Y = parseFloat(fdYears) || 0;
      if (P <= 0 || R <= 0 || Y <= 0) return;

      const n = 4; // Quarterly Compounding
      const total = P * Math.pow(1 + R / (100 * n), n * Y);
      const interest = total - P;

      setResult({
        "Total Principal": P,
        "Interest Earned": interest,
        "Maturity Amount": total,
        "Growth %": `${((interest / P) * 100).toFixed(1)}%`
      });
    } else {
      const M = parseFloat(rdMonthly) || 0;
      const R = parseFloat(rdRate) || 0;
      const Y = parseFloat(rdYears) || 0;
      if (M <= 0 || R <= 0 || Y <= 0) return;

      const n = 4; // Quarterly Compounding
      const i = R / 400;
      const total = M * ((Math.pow(1 + i, 4 * Y) - 1) / (1 - Math.pow(1 + i, -1/3)));
      const totalInvested = M * (Y * 12);
      const interest = total - totalInvested;

      setResult({
        "Monthly Deposit": M,
        "Total Invested": totalInvested,
        "Interest Earned": interest,
        "Maturity Amount": total
      });
    }
  };

  useEffect(() => {
    calculateResult();
  }, [activeTab, fdPrincipal, fdRate, fdYears, rdMonthly, rdRate, rdYears]);

  const handleReset = () => {
    if (activeTab === "fd") {
      setFdPrincipal(""); setFdRate(""); setFdYears("");
    } else {
      setRdMonthly(""); setRdRate(""); setRdYears("");
    }
    setResult(null);
  };

  return (
    <>
      <Head>
        <title>FD & RD Calculator | Fixed & Recurring Deposit Planner | ToolFinance</title>
        <meta name="description" content="Calculate maturity amounts for both Fixed Deposits (FD) and Recurring Deposits (RD) with quarterly compounding options." />
      </Head>

      <div className="container">
        <div className="tool-intro" style={{textAlign: 'center', marginBottom: '30px'}}>
            <h1 style={{fontSize: '2.5rem', color: 'var(--primary)'}}>💰 FD & RD Planner</h1>
            <p style={{color: '#666'}}>Compare guaranteed returns to grow your wealth safely.</p>
        </div>

        {/* Standardized Tab Switcher */}
        <div style={{display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px'}}>
            <button 
                onClick={() => {setActiveTab("fd"); setResult(null);}}
                style={{
                  padding: '10px 25px', borderRadius: '30px', border: 'none', cursor: 'pointer', 
                  fontWeight: 'bold', background: activeTab === 'fd' ? 'var(--primary)' : '#e2e8f0', 
                  color: activeTab === 'fd' ? '#fff' : '#475569', transition: '0.3s'
                }}
            >
                🏢 Fixed Deposit (FD)
            </button>
            <button 
                onClick={() => {setActiveTab("rd"); setResult(null);}}
                style={{
                  padding: '10px 25px', borderRadius: '30px', border: 'none', cursor: 'pointer', 
                  fontWeight: 'bold', background: activeTab === 'rd' ? 'var(--primary)' : '#e2e8f0', 
                  color: activeTab === 'rd' ? '#fff' : '#475569', transition: '0.3s'
                }}
            >
                🔄 Recurring Deposit (RD)
            </button>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()}>
              {activeTab === "fd" ? (
                <>
                  <CalculatorInput label="Lumpsum Principal" value={fdPrincipal} onChange={setFdPrincipal} icon={globalCurrency} />
                  <div className="input-row">
                      <CalculatorInput label="Interest Rate" value={fdRate} onChange={setFdRate} suffix="%" />
                      <CalculatorInput label="Duration" value={fdYears} onChange={setFdYears} suffix="Years" />
                  </div>
                </>
              ) : (
                <>
                  <CalculatorInput label="Monthly Deposit" value={rdMonthly} onChange={setRdMonthly} icon={globalCurrency} />
                  <div className="input-row">
                      <CalculatorInput label="Interest Rate" value={rdRate} onChange={setRdRate} suffix="%" />
                      <CalculatorInput label="Duration" value={rdYears} onChange={setRdYears} suffix="Years" />
                  </div>
                </>
              )}
            </CalculatorForm>
            
            <div style={{marginTop: '25px'}}>
                <Link href="/blog/fd-rd-guide" className="read-guide-card" style={{display: 'block', textDecoration: 'none'}}>
                    📖 Comparison: FD vs RD — Which strategy fits your goal?
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox title={`${activeTab.toUpperCase()} Maturity Summary`} results={result} formatCurrency={formatCurrency} />
            ) : (
              <div className="result-box" style={{background: '#f8fafc', color: '#64748b', textAlign: 'center'}}>
                Enter details to calculate maturity roadmap.
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        <div className="info-card" style={{marginTop: '40px', padding: '25px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #dcfce7'}}>
            <h3 style={{color: '#166534', marginBottom: '10px'}}>Understanding Quarterly Compounding</h3>
            <p style={{fontSize: '0.9rem', color: '#166534', lineHeight: '1.6'}}>
                Most global banks compound FD and RD interest every 3 months. This means you earn interest on your interest four times a year. This cycle significantly boosts your final maturity amount compared to simple interest calculation.
            </p>
            
        </div>
      </div>
    </>
  );
}