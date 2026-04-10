import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

// Import global utilities
import { formatCurrency, globalCurrency } from "../../utils/formatters"; 

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function FDCalculator() {
  // 1. STATE MANAGEMENT
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(7.5);
  const [years, setYears] = useState(5);
  const [compounding, setCompounding] = useState(4); 
  const [taxRate, setTaxRate] = useState(5); 
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [result, setResult] = useState(null);

  // 2. CALCULATION LOGIC
  const calculateFD = () => {
    const P = parseFloat(principal) || 0;
    const r = (parseFloat(rate) || 0) / 100;
    const t = parseFloat(years) || 0;
    const n = parseFloat(compounding) || 1;
    const tax = (parseFloat(taxRate) || 0) / 100;

    if (P <= 0 || r <= 0 || t <= 0) return;

    const maturityAmount = P * Math.pow(1 + r / n, n * t);
    const totalInterest = maturityAmount - P;
    const taxDeduction = totalInterest * tax;
    const postTaxMaturity = maturityAmount - taxDeduction;

    setResult({
      "Principal Amount": P,
      "Total Interest Earned": totalInterest,
      "TDS Deduction": taxDeduction,
      "Net Maturity Value": postTaxMaturity,
      "Effective Annual Yield": `${(((Math.pow(1 + r / n, n)) - 1) * 100).toFixed(2)}%`
    });
  };

  useEffect(() => {
    calculateFD();
  }, [principal, rate, years, compounding, taxRate]);

  const handleReset = () => {
    setPrincipal(""); 
    setRate(""); 
    setYears(""); 
    setCompounding(4);
    setTaxRate(5);
    setResult(null);
  };

  return (
    <>
      <Head>
        <title>FD Calculator | Fixed Deposit Interest & TDS Planner | ToolFinance</title>
        <meta name="description" content="Calculate your FD maturity amount accurately. Include TDS tax calculations and compounding options." />
      </Head>

      <div className="container">
        <div className="tool-intro" style={{textAlign: 'center', marginBottom: '30px'}}>
            <h1 style={{fontSize: '2.5rem', color: 'var(--primary)'}}>🏦 FD Calculator</h1>
            <p style={{color: '#666'}}>Plan your savings with guaranteed bank deposit returns.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()}>
              
              <CalculatorInput label="Investment Amount" value={principal} onChange={setPrincipal} icon={globalCurrency} />

              <div className="input-row">
                <CalculatorInput label="Annual Interest Rate" value={rate} onChange={setRate} suffix="%" />
                <CalculatorInput label="Duration" value={years} onChange={setYears} suffix="Years" />
              </div>

              {/* Standardized Advanced Toggle */}
              <button 
                type="button" 
                onClick={() => setShowAdvanced(!showAdvanced)}
                style={{
                  marginTop: '10px', width: '100%', padding: '10px', 
                  background: 'transparent', border: '1px dashed #cbd5e1', 
                  borderRadius: '8px', cursor: 'pointer', color: '#475569', fontSize: '0.85rem'
                }}
              >
                {showAdvanced ? "▲ Hide Settings" : "▼ Compounding & Tax (TDS)"}
              </button>

              {showAdvanced && (
                <div style={{marginTop: '15px', padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0'}}>
                  <div className="input-row">
                    <div style={{flex: 1}}>
                      <label className="input-label">Compounding</label>
                      <select 
                        style={{
                          width: '100%', padding: '12px', borderRadius: '8px', 
                          border: '1px solid #d1d5db', background: '#fff', marginTop: '5px'
                        }}
                        value={compounding} 
                        onChange={(e) => setCompounding(e.target.value)}
                      >
                        <option value="12">Monthly</option>
                        <option value="4">Quarterly (Standard)</option>
                        <option value="1">Yearly</option>
                      </select>
                    </div>
                    <CalculatorInput label="TDS Tax Rate (%)" value={taxRate} onChange={setTaxRate} suffix="%" />
                  </div>
                </div>
              )}
            </CalculatorForm>

            {/* Guide Button inside the form box */}
            <div style={{marginTop: '25px'}}>
                <Link href="/blog/best-fixed-deposit-rates" className="read-guide-card" style={{display: 'block', textDecoration: 'none'}}>
                    📖 Bank Guide: Current FD Rates in Nepal Comparison
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox title="Maturity Breakdown" results={result} formatCurrency={formatCurrency} />
            ) : (
              <div className="result-box" style={{background: '#f8fafc', color: '#64748b', textAlign: 'center'}}>
                Enter deposit details to calculate your maturity value.
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        <div className="info-card" style={{marginTop: '40px', padding: '25px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #dcfce7'}}>
            <h3 style={{color: '#166534', marginBottom: '10px'}}>The Power of Quarterly Compounding</h3>
            <p style={{fontSize: '0.9rem', color: '#166534', lineHeight: '1.6'}}>
                Most banks use <strong>quarterly compounding</strong>. This means they calculate interest every 3 months and add it back to your principal. By the end of the year, you've earned interest on your interest, making your "Effective Yield" higher than the advertised rate.
            </p>
            
        </div>
      </div>
    </>
  );
}