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

export default function LumpsumCalculator() {
  const { currency } = useCurrency();
  const formatValue = (val) => new Intl.NumberFormat(currency.locale).format(val);

  // Automatically find the data for THIS tool
  const toolData = tools.find(t => t.link === '/tools/lumpsum');
  const guideData = Object.values(allToolGuides).find(g => g.tool === "lumpsum");
  const { globalCurrency } = useCurrency();
  // 1. STATE MANAGEMENT
  const [investment, setInvestment] = useState(100000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [years, setYears] = useState(10);
  const [result, setResult] = useState(null);

  // 2. CALCULATION LOGIC
  const calculateLumpsum = () => {
    const P = parseFloat(investment) || 0;
    const r = parseFloat(expectedReturn) || 0;
    const n = parseFloat(years) || 0;

    if (P <= 0 || r < 0 || n <= 0) {
      setResult(null);
      return;
    }

    // Future Value formula: FV = P * (1 + r/100)^n
    const futureValue = P * Math.pow(1 + r / 100, n);
    const wealthGained = futureValue - P;

   setResult({
      "Total Investment": `${currency.symbol}${formatValue(Math.round(P))}`,
      "Wealth Gained": `${currency.symbol}${formatValue(Math.round(wealthGained))}`,
      "Estimated Future Value": `${currency.symbol}${formatValue(Math.round(futureValue))}`,
      "Multiple of Investment": `${(futureValue / P).toFixed(2)}x`
    });
  };

  useEffect(() => {
    calculateLumpsum();
  }, [investment, expectedReturn, years]);

  const handleReset = () => {
    setInvestment("");
    setExpectedReturn(12);
    setYears(10);
    setResult(null);
  };

  return (
    <>
        <ToolSEO tool={toolData} guideData={guideData} />

      <div className="container">
        <div className="tool-intro" style={{textAlign: 'center', marginBottom: '30px'}}>
            <h1 style={{fontSize: '2.5rem', color: 'var(--primary)'}}>💰 Lumpsum Investment</h1>
            <p style={{color: '#666'}}>Project the future value of your one-time investment based on expected annual returns.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()}>
              <CalculatorInput 
                label="Total Investment Amount" 
                value={investment} 
                onChange={setInvestment} 
                icon={currency.symbol} 
              />
              
              <div className="input-row">
                <CalculatorInput label="Exp. Return Rate (p.a)" value={expectedReturn} onChange={setExpectedReturn} suffix="%" />
                <CalculatorInput label="Time Period" value={years} onChange={setYears} suffix="Years" />
              </div>
            </CalculatorForm>

            <div style={{marginTop: '25px'}}>
                <Link href="/blog/lumpsum-calculator-guide" className="read-guide-card" style={{display: 'block', textDecoration: 'none'}}>
                    📖 Comparison: Is Lumpsum better than SIP in a bull market?
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox
                title="Wealth Projection"
                results={result}
              />
            ) : (
              <div className="result-box" style={{background: '#f8fafc', color: '#64748b', textAlign: 'center'}}>
                Enter investment details to see your projected wealth growth.
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        <div className="info-card" style={{marginTop: '40px', padding: '25px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0'}}>
            <h3 style={{color: 'var(--primary)', marginBottom: '10px'}}>How Lumpsum Growth is Calculated</h3>
            <p style={{fontSize: '0.95rem', color: '#475569', lineHeight: '1.6', marginBottom: '15px'}}>
                Lumpsum investments grow through <strong>Annual Compounding</strong>. Unlike a simple interest loan, your returns each year are reinvested to earn even more returns the following year. 
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.3rem', color: 'var(--primary)', fontWeight: 'bold', margin: '20px 0' }}>
              <span>FV = P × (1 + r)<sup>n</sup></span>
            </div>

            <p style={{fontSize: '0.95rem', color: '#475569', lineHeight: '1.6', marginTop: '15px'}}>
                Where <strong>P</strong> is your principal, <strong>r</strong> is the annual rate of return, and <strong>n</strong> is the number of years. For example, at a 12% return, your {currency.symbol}{formatValue(investment)} would roughly double every 6 years. This is known as the <em>Rule of 72</em> (72 ÷ rate = years to double).
            </p>
        </div>
      </div>
    </>
  );
}