import { useState, useEffect } from "react";
import Link from "next/link";

// Import global utilities
import { formatCurrency, globalCurrency } from "../../utils/formatters"; 
import { allToolGuides } from '../../data/tool-guides/index';
import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";
import { tools } from '../../data/tools';
import ToolSEO from '../../components/layout/ToolSEO';

export default function SIPCalculator() {
  // Automatically find the data for THIS tool
  const toolData = tools.find(t => t.link === '/tools/sip');
  const guideData = Object.values(allToolGuides).find(g => g.tool === "sip");
  // 1. STATE MANAGEMENT
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
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

    if (S > 0) {
      for (let i = 1; i <= Y; i++) {
        const yearlyFV = currentMonthlyP * ((Math.pow(1 + r, 12) - 1) / r) * (1 + r);
        totalValue = (totalValue * Math.pow(1 + r, 12)) + yearlyFV;
        totalInvested += (currentMonthlyP * 12);
        currentMonthlyP += (currentMonthlyP * (S / 100));
      }
    } else {
      const n = Y * 12;
      totalValue = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      totalInvested = P * n;
    }

    setResult({
      "Amount Invested": totalInvested,
      "Estimated Returns": totalValue - totalInvested,
      "Total Wealth Created": totalValue,
      "Wealth Multiplier": `${(totalValue / totalInvested).toFixed(2)}x`
    });
  };

  useEffect(() => {
    calculateSIP();
  }, [monthlyInvestment, rate, years, stepUp]);

  // Handle the default reset logic
  const handleReset = () => {
    setMonthlyInvestment("");
    setRate("");
    setYears("");
    setStepUp(0);
    setResult(null);
  };

  return (
    <>
      <ToolSEO tool={toolData} guideData={guideData} />

      <div className="container">
        <div className="tool-intro" style={{textAlign: 'center', marginBottom: '30px'}}>
            <h1 style={{fontSize: '2.5rem', color: 'var(--primary)'}}>📈 SIP Wealth Calculator</h1>
            <p style={{color: '#666'}}>Plan your financial freedom with the power of compounding.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            {/* Standardized: Use onReset prop, removed manual reset-btn div */}
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()}>
              <CalculatorInput label="Monthly Investment" value={monthlyInvestment} onChange={setMonthlyInvestment} icon={globalCurrency} />
              
              <div className="input-row">
                <CalculatorInput label="Expected Returns" value={rate} onChange={setRate} suffix="%" />
                <CalculatorInput label="Time Period" value={years} onChange={setYears} suffix="Years" />
              </div>

              {/* Styled Step-up Toggle */}
              <button 
                type="button" 
                onClick={() => setShowAdvanced(!showAdvanced)}
                style={{
                  marginTop: '10px', width: '100%', padding: '10px', 
                  background: 'transparent', border: '1px dashed #cbd5e1', 
                  borderRadius: '8px', cursor: 'pointer', color: '#475569', fontSize: '0.85rem'
                }}
              >
                {showAdvanced ? "▲ Hide Step-Up" : "▼ Add Annual Step-Up (%)"}
              </button>

              {showAdvanced && (
                <div style={{marginTop: '15px', padding: '15px', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #dcfce7'}}>
                  <CalculatorInput label="Annual Increase (%)" value={stepUp} onChange={setStepUp} suffix="%" />
                  <p style={{fontSize: '0.75rem', color: '#166534', marginTop: '8px'}}>
                    💡 <strong>Step-up SIP:</strong> Increasing your investment yearly drastically boosts long-term wealth.
                  </p>
                </div>
              )}
            </CalculatorForm>

            {/* Consistant Guide Button location (Inside form-box area) */}
            <div style={{marginTop: '25px'}}>
                <Link href="/blog/sip-calculator-guide" className="read-guide-card" style={{display: 'block', textDecoration: 'none'}}>
                    📖 SIP Guide: How to Choose the Right Mutual Fund
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox title="Investment Summary" results={result} formatCurrency={formatCurrency} />
            ) : (
              <div className="result-box" style={{background: '#f8fafc', color: '#64748b', textAlign: 'center'}}>
                Adjust parameters to see your investment grow.
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        {/* Consistant Insight Card */}
        <div className="info-card" style={{marginTop: '40px', padding: '25px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0'}}>
            <h3 style={{marginBottom: '15px'}}>The Magic of Compounding</h3>
            <p style={{fontSize: '0.95rem', lineHeight: '1.6', color: '#475569'}}>
                A Systematic Investment Plan (SIP) allows you to invest small amounts regularly. Over time, you earn interest on your interest. This exponential growth is why the "Time Period" often matters more than the "Amount" you start with.
            </p>
            

[Image of compound interest vs simple interest graph]

        </div>
      </div>
    </>
  );
}