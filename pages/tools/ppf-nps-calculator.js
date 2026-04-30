import { useState, useEffect } from "react";
import Link from "next/link";
import { allToolGuides } from '../../data/tool-guides/index';
// Import global utilities
import { formatCurrency, globalCurrency } from "../../utils/formatters"; 

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";
import { tools } from '../../data/tools';
import ToolSEO from '../../components/layout/ToolSEO';

export default function PPFNPSCalculator() {
  // Automatically find the data for THIS tool
  const toolData = tools.find(t => t.link === '/tools/ppf-nps');
  const guideData = Object.values(allToolGuides).find(g => g.tool === "ppf-nps");
  // 1. STATE MANAGEMENT
  const [monthlyInvest, setMonthlyInvest] = useState(12500); 
  const [rate, setRate] = useState(7.1); 
  const [years, setYears] = useState(15); 
  const [taxSlab, setTaxSlab] = useState(0); 
  const [showTax, setShowTax] = useState(false);
  const [result, setResult] = useState(null);

  // 2. CALCULATION LOGIC
  const calculateWealth = () => {
    const P = parseFloat(monthlyInvest) || 0;
    const R = parseFloat(rate) || 0;
    const Y = parseFloat(years) || 0;
    const tax = parseFloat(taxSlab) / 100;

    if (P <= 0 || R <= 0 || Y <= 0) {
      setResult(null);
      return;
    }

    const totalMonths = Y * 12;
    const monthlyRate = R / (12 * 100);

    // FV of Annuity Due formula
    const maturityValue = P * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
    const totalInvested = P * totalMonths;
    const totalInterest = maturityValue - totalInvested;

    const annualInvest = P * 12;
    const yearlyTaxSaved = annualInvest * tax;
    const totalTaxSaved = yearlyTaxSaved * Y;

    setResult({
      "Total Investment": totalInvested,
      "Wealth Gained": totalInterest,
      "Maturity Amount": maturityValue,
      "Total Tax Saved": totalTaxSaved,
      "Profit Margin": `${((totalInterest / totalInvested) * 100).toFixed(0)}%`
    });
  };

  useEffect(() => {
    calculateWealth();
  }, [monthlyInvest, rate, years, taxSlab]);

  const handleReset = () => {
    setMonthlyInvest(""); 
    setRate(7.1); 
    setYears(15); 
    setTaxSlab(0); 
    setResult(null);
  };

  return (
    <>
      <ToolSEO tool={toolData} guideData={guideData} />

      <div className="container">
        <div className="tool-intro" style={{textAlign: 'center', marginBottom: '30px'}}>
            <h1 style={{fontSize: '2.5rem', color: 'var(--primary)'}}>📈 Wealth & Tax Planner</h1>
            <p style={{color: '#666'}}>Plan your long-term security and track potential tax-saving benefits.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()}>
              <CalculatorInput label="Monthly Contribution" value={monthlyInvest} onChange={setMonthlyInvest} icon={globalCurrency} />

              <div className="input-row">
                <CalculatorInput label="Expected Rate" value={rate} onChange={setRate} suffix="%" />
                <CalculatorInput label="Duration" value={years} onChange={setYears} suffix="Years" />
              </div>

              <button 
                type="button" 
                onClick={() => setShowTax(!showTax)}
                style={{
                  marginTop: '10px', width: '100%', padding: '10px', 
                  background: 'transparent', border: '1px dashed #cbd5e1', 
                  borderRadius: '8px', cursor: 'pointer', color: '#475569', fontSize: '0.85rem'
                }}
              >
                {showTax ? "▲ Hide Tax Analysis" : "▼ Analyze Tax Savings"}
              </button>

              {showTax && (
                <div style={{marginTop: '15px', padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0'}}>
                    <label className="input-label" style={{display: 'block', marginBottom: '8px'}}>Your Income Tax Slab (%)</label>
                    <select 
                      value={taxSlab} 
                      onChange={(e) => setTaxSlab(e.target.value)}
                      style={{width: '100%', borderRadius: '10px', border: '1px solid #d1d5db', padding: '12px', background: '#fff'}}
                    >
                      <option value="0">Not Taxable</option>
                      <option value="10">10% Slab</option>
                      <option value="20">20% Slab</option>
                      <option value="30">30% Slab</option>
                    </select>
                    <p style={{fontSize: '0.75rem', color: '#64748b', marginTop: '10px'}}>
                        *Calculates approximate savings based on eligible investment contributions.
                    </p>
                </div>
              )}
            </CalculatorForm>

            <div style={{marginTop: '25px'}}>
                <Link href="/blog/ppf-nps-guide" className="read-guide-card" style={{display: 'block', textDecoration: 'none'}}>
                    📖 Roadmap: How to maximize long-term compounding benefits
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox title="Maturity Breakdown" results={result} formatCurrency={formatCurrency} />
            ) : (
              <div className="result-box" style={{background: '#f8fafc', color: '#64748b', textAlign: 'center'}}>
                Enter contribution details to see your future wealth.
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        <div className="info-card" style={{marginTop: '40px', padding: '25px', background: '#ecfdf5', borderRadius: '12px', border: '1px solid #10b981'}}>
            <h3 style={{color: '#065f46', marginBottom: '10px'}}>The Power of Long-Term Compounding</h3>
            <p style={{fontSize: '0.9rem', color: '#065f46', lineHeight: '1.6'}}>
                When you invest consistently over 15+ years, your interest starts earning its own interest at an accelerated rate. In many long-term government or retirement schemes, the cumulative interest earned can eventually surpass the total amount you physically invested.
            </p>
            
        </div>
      </div>
    </>
  );
}