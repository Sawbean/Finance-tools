import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

// Import global utilities
import { formatCurrency, globalCurrency } from "../../utils/formatters"; 

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function NetWorthCalculator() {
  // 1. STATE MANAGEMENT
  const [cash, setCash] = useState(50000);
  const [investments, setInvestments] = useState(500000);
  const [realEstate, setRealEstate] = useState(0);
  
  const [mortgage, setMortgage] = useState(0);
  const [otherLoans, setOtherLoans] = useState(0);
  const [creditCardDebt, setCreditCardDebt] = useState(0);

  const [result, setResult] = useState(null);

  // 2. CALCULATION LOGIC
  const calculateNetWorth = () => {
    const totalAssets = (parseFloat(cash) || 0) + (parseFloat(investments) || 0) + (parseFloat(realEstate) || 0);
    const totalLiabilities = (parseFloat(mortgage) || 0) + (parseFloat(otherLoans) || 0) + (parseFloat(creditCardDebt) || 0);
    
    if (totalAssets === 0 && totalLiabilities === 0) {
      setResult(null);
      return;
    }

    const netWorth = totalAssets - totalLiabilities;
    const debtRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;

    setResult({
      "Total Assets": totalAssets,
      "Total Liabilities": totalLiabilities,
      "Current Net Worth": netWorth,
      "Debt-to-Asset Ratio": `${debtRatio.toFixed(1)}%`,
    });
  };

  useEffect(() => {
    calculateNetWorth();
  }, [cash, investments, realEstate, mortgage, otherLoans, creditCardDebt]);

  const handleReset = () => {
    setCash(""); setInvestments(""); setRealEstate("");
    setMortgage(""); setOtherLoans(""); setCreditCardDebt("");
    setResult(null);
  };

  return (
    <>
      <Head>
        <title>Net Worth Calculator | Track Your Wealth | ToolFinance</title>
        <meta name="description" content="Calculate your total net worth globally. Itemize assets and liabilities to get a clear picture of your financial health today." />
      </Head>

      <div className="container">
        <div className="tool-intro" style={{textAlign: 'center', marginBottom: '30px'}}>
            <h1 style={{fontSize: '2.5rem', color: 'var(--primary)'}}>💰 Net Worth Calculator</h1>
            <p style={{color: '#666'}}>Measure your financial progress by balancing what you own against what you owe.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()}>
              
              <h3 style={{fontSize: '1rem', marginBottom: '15px', color: '#059669', display: 'flex', alignItems: 'center', gap: '8px'}}>
                <span>🏠</span> Assets (What you OWN)
              </h3>
              <CalculatorInput label="Cash & Bank Balance" value={cash} onChange={setCash} icon={globalCurrency} />
              <CalculatorInput label="Investments (Stocks, Funds, Gold)" value={investments} onChange={setInvestments} icon={globalCurrency} />
              <CalculatorInput label="Real Estate & Property" value={realEstate} onChange={setRealEstate} icon={globalCurrency} />

              <hr style={{margin: '25px 0', border: '0', borderTop: '1px solid #e2e8f0'}} />

              <h3 style={{fontSize: '1rem', marginBottom: '15px', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px'}}>
                <span>📉</span> Liabilities (What you OWE)
              </h3>
              <CalculatorInput label="Home & Property Loans" value={mortgage} onChange={setMortgage} icon={globalCurrency} />
              <CalculatorInput label="Personal & Education Loans" value={otherLoans} onChange={setOtherLoans} icon={globalCurrency} />
              <CalculatorInput label="Credit Card & Consumer Debt" value={creditCardDebt} onChange={setCreditCardDebt} icon={globalCurrency} />

            </CalculatorForm>

            <div style={{marginTop: '25px'}}>
                <Link href="/blog/net-worth-guide" className="read-guide-card" style={{display: 'block', textDecoration: 'none'}}>
                    📖 Roadmap: 5 proven steps to increase your Net Worth
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <>
                <ResultBox title="Financial Snapshot" results={result} formatCurrency={formatCurrency} />
                {result["Current Net Worth"] < 0 && (
                  <div style={{
                      marginTop: '15px', padding: '15px', background: '#fff1f2', 
                      borderRadius: '12px', border: '1px solid #fecaca', color: '#991b1b', 
                      fontSize: '0.8rem', lineHeight: '1.4'
                  }}>
                      <strong>Strategic Note:</strong> A negative net worth is often a temporary stage during periods of high investment or early-career debt. Prioritizing high-interest liabilities will accelerate your path to a positive balance.
                  </div>
                )}
              </>
            ) : (
              <div className="result-box" style={{background: '#f8fafc', color: '#64748b', textAlign: 'center'}}>
                Enter your assets and debts to see your net worth summary.
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        <div className="info-card" style={{marginTop: '40px', padding: '25px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0'}}>
            <h3 style={{color: 'var(--primary)', marginBottom: '10px'}}>Why Track Your Net Worth?</h3>
            <p style={{fontSize: '0.95rem', color: '#475569', lineHeight: '1.6'}}>
                Net worth is the single most accurate metric for personal financial health. Unlike income, which only shows what you earn, net worth reveals what you actually <em>keep</em>. By tracking this number annually, you can ensure that your lifestyle isn't growing faster than your actual wealth.
            </p>
            

[Image of assets and liabilities balance sheet diagram]

        </div>
      </div>
    </>
  );
}