import { useState, useEffect } from "react";
import Link from "next/link";
import { tools } from '../../data/tools';
import ToolSEO from '../../components/layout/ToolSEO';
// Import global utilities
import { formatCurrency, globalCurrency } from "../../utils/formatters"; 
import { allToolGuides } from '../../data/tool-guides/index';  
import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function DividendYieldCalculator() {
  // Automatically find the data for THIS tool
  const toolData = tools.find(t => t.link === '/tools/dividend-yield');
  const guideData = Object.values(allToolGuides).find(g => g.tool === "dividend-yield");
  // 1. STATE MANAGEMENT
  const [sharePrice, setSharePrice] = useState(1000);
  const [annualDividend, setAnnualDividend] = useState(50);
  const [result, setResult] = useState(null);

  // 2. CALCULATION LOGIC
  const calculateYield = () => {
    const P = parseFloat(sharePrice) || 0;
    const D = parseFloat(annualDividend) || 0;

    if (P <= 0 || D < 0) {
      setResult(null);
      return;
    }

    const yieldPercentage = (D / P) * 100;

    setResult({
      "Annual Dividend per Share": D,
      "Current Share Price": P,
      "Dividend Yield": `${yieldPercentage.toFixed(2)}%`,
      "Payout Ratio Category": yieldPercentage > 8 ? "High Yield (Check Sustainability)" : "Standard Yield"
    });
  };

  useEffect(() => {
    calculateYield();
  }, [sharePrice, annualDividend]);

  const handleReset = () => {
    setSharePrice("");
    setAnnualDividend("");
    setResult(null);
  };

  return (
    <>
      <ToolSEO tool={toolData} guideData={guideData} />

      <div className="container">
        <div className="tool-intro" style={{textAlign: 'center', marginBottom: '30px'}}>
            <h1 style={{fontSize: '2.5rem', color: 'var(--primary)'}}>🎟️ Dividend Yield</h1>
            <p style={{color: '#666'}}>Measure the cash flow return on your stock investments.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()}>
              <CalculatorInput 
                label="Current Share Price" 
                value={sharePrice} 
                onChange={setSharePrice} 
                icon={globalCurrency} 
              />
              
              <CalculatorInput 
                label="Annual Dividend per Share" 
                value={annualDividend} 
                onChange={setAnnualDividend} 
                icon={globalCurrency} 
              />
              
              <p style={{fontSize: '0.8rem', color: '#64748b', marginTop: '10px', fontStyle: 'italic'}}>
                *Enter the total dividends paid over a 12-month period.
              </p>
            </CalculatorForm>

            <div style={{marginTop: '25px'}}>
                <Link href="/blog/dividend-yield-guide" className="read-guide-card" style={{display: 'block', textDecoration: 'none'}}>
                    📖 Passive Income: How to build a dividend-focused portfolio?
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox
                title="Yield Analysis"
                results={result}
                formatCurrency={formatCurrency}
              />
            ) : (
              <div className="result-box" style={{background: '#f8fafc', color: '#64748b', textAlign: 'center'}}>
                Enter share price and annual dividend to calculate yield.
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        <div className="info-card" style={{marginTop: '40px', padding: '25px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0'}}>
            <h3 style={{color: 'var(--primary)', marginBottom: '10px'}}>What does Dividend Yield tell you?</h3>
            <p style={{fontSize: '0.95rem', color: '#475569', lineHeight: '1.6', marginBottom: '15px'}}>
                The dividend yield is a financial ratio that shows how much a company pays out in dividends each year relative to its stock price. It is the interest rate you "earn" on your shares.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 'bold', margin: '20px 0' }}>
              <span>Dividend Yield = </span>
              <div style={{ textAlign: 'center' }}>
                <div style={{ borderBottom: '2px solid var(--primary)', padding: '0 10px' }}>Annual Dividend Per Share</div>
                <div>Current Share Price</div>
              </div>
            </div>

            <p style={{fontSize: '0.95rem', color: '#475569', lineHeight: '1.6', marginTop: '15px'}}>
                <strong>Important Note:</strong> A very high dividend yield (e.g., above 10%) might look attractive, but it can sometimes be a "dividend trap"—a sign that the share price has crashed or the company may soon cut its dividend payout.
            </p>
        </div>
      </div>
    </>
  );
}