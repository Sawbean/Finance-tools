import { useState, useEffect } from "react";
import Link from "next/link";
import { allToolGuides } from '../../data/tool-guides/index';
// Import global utilities
import { useCurrency } from "../../context/CurrencyContext"; 

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";
import { tools } from '../../data/tools';
import ToolSEO from '../../components/layout/ToolSEO';
import { formatCurrency } from "../../utils/formatters";

export default function NetWorthCalculator() {
  const { currency } = useCurrency();
  // Automatically find the data for THIS tool
  const toolData = tools.find(t => t.link === '/tools/net-worth');
  const guideData = Object.values(allToolGuides).find(g => g.tool === "net-worth");
  
  // 1. STATE MANAGEMENT
  const [cash, setCash] = useState(50000);
  const [investments, setInvestments] = useState(500000);
  const [realEstate, setRealEstate] = useState(0);
  const [error, setError] = useState("");
  
  const [mortgage, setMortgage] = useState(0);
  const [otherLoans, setOtherLoans] = useState(0);
  const [creditCardDebt, setCreditCardDebt] = useState(0);

  const [result, setResult] = useState(null);

  // 2. CALCULATION LOGIC
  const calculateNetWorth = () => {
    const totalAssets = (parseFloat(cash) || 0) + (parseFloat(investments) || 0) + (parseFloat(realEstate) || 0);
    const totalLiabilities = (parseFloat(mortgage) || 0) + (parseFloat(otherLoans) || 0) + (parseFloat(creditCardDebt) || 0);
    const netWorth = totalAssets - totalLiabilities;
    
    if (totalAssets === 0 && totalLiabilities === 0) {
      setResult(null);
      return;
    }

    setResult({
      "Total Assets": totalAssets, 
      "Total Liabilities": totalLiabilities,
      "Current Net Worth": netWorth,
      "Debt-to-Asset Ratio": `${totalAssets > 0 ? ((totalLiabilities / totalAssets) * 100).toFixed(1) : 0}%`
    });
  };

  useEffect(() => {
    calculateNetWorth();
  }, [cash, investments, realEstate, mortgage, otherLoans, creditCardDebt]);

  const handleReset = () => {
    setCash(""); setInvestments(""); setRealEstate("");
    setMortgage(""); setOtherLoans(""); setCreditCardDebt("");
    setResult(null);
    setError("");
  };

  return (
    <>
      <ToolSEO tool={toolData} guideData={guideData} />

      <div className="container">
        <div className="tool-intro net-worth-intro">
            <h1>💰 Net Worth Calculator</h1>
            <p>Measure your financial progress by balancing what you own against what you owe.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()} error={error}>
              
              <h3 className="section-title assets-color">
                <span>🏠</span> Assets (What you OWN)
              </h3>
              <CalculatorInput label="Cash & Bank Balance" value={cash} onChange={setCash} icon={currency.symbol} />
              <CalculatorInput label="Investments (Stocks, Funds, Gold)" value={investments} onChange={setInvestments} icon={currency.symbol} />
              <CalculatorInput label="Real Estate & Property" value={realEstate} onChange={setRealEstate} icon={currency.symbol} />

              <hr className="divider" />

              <h3 className="section-title liabilities-color">
                <span>📉</span> Liabilities (What you OWE)
              </h3>
              <CalculatorInput label="Home & Property Loans" value={mortgage} onChange={setMortgage} icon={currency.symbol} />
              <CalculatorInput label="Personal & Education Loans" value={otherLoans} onChange={setOtherLoans} icon={currency.symbol} />
              <CalculatorInput label="Credit Card & Consumer Debt" value={creditCardDebt} onChange={setCreditCardDebt} icon={currency.symbol} />

            </CalculatorForm>

            <div className="guide-card-wrapper">
                <Link href="/blog/net-worth-guide" className="read-guide-card">
                    📖 Roadmap: 5 proven steps to increase your Net Worth
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <>
                <ResultBox title="Financial Snapshot" results={result}/>
                {result["Current Net Worth"] < 0 && (
                  <div className="strategic-note">
                      <strong>Strategic Note:</strong> A negative net worth is often a temporary stage during periods of high investment or early-career debt. Prioritizing high-interest liabilities will accelerate your path to a positive balance.
                  </div>
                )}
              </>
            ) : (
              <div className="result-box-empty">
                Enter your assets and debts to see your net worth summary.
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        <div className="info-card net-worth-info-card">
            <h3>Why Track Your Net Worth?</h3>
            <p>
              Net worth is the single most accurate metric for personal financial health. 
              For example, if you own a home worth {currency.symbol}{formatCurrency(300000)} but owe 
              {currency.symbol}{formatCurrency(200000)} on the mortgage, your net worth from that 
              asset is {currency.symbol}{formatCurrency(100000)}. By tracking this annually, you 
              ensure your wealth is actually growing, not just your income.
            </p>
            
            

[Image of assets and liabilities balance sheet diagram]

        </div>
      </div>
    </>
  );
}