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
import ToolSEO from "../../components/layout/ToolSEO";
import { formatCurrency } from "../../utils/formatters";

export default function SIPCalculator() {
  const { currency } = useCurrency();
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
  const [error, setError] = useState("");
  
  // 2. CALCULATION LOGIC
  const calculateSIP = () => {
    const P = parseFloat(monthlyInvestment) || 0;
    const R = parseFloat(rate) || 0;
    const Y = parseFloat(years) || 0;
    const S = parseFloat(stepUp) || 0;

    if (P <= 0 || R <= 0 || Y <= 0) {
      setResult(null);
      setError("Please enter valid positive values.");
      return;
    }
    setError("");

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
      "Amount Invested": Math.round(totalInvested),
      "Estimated Returns": Math.round(totalValue - totalInvested),
      "Total Wealth Created": Math.round(totalValue),
      "Wealth Multiplier": `${(totalValue / totalInvested).toFixed(2)}x`
    });
  };

  useEffect(() => {
    calculateSIP();
  }, [monthlyInvestment, rate, years, stepUp]);

  const handleReset = () => {
    setMonthlyInvestment("");
    setRate("");
    setYears("");
    setStepUp(0);
    setResult(null);
    setError("");
  };

  return (
    <>
      <ToolSEO tool={toolData} guideData={guideData} />

      <div className="container">
        <div className="tool-intro sip-intro">
            <h1>📈 SIP Wealth Calculator</h1>
            <p>Plan your financial freedom with the power of compounding.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()} error={error}>
              <CalculatorInput label="Monthly Investment" value={monthlyInvestment} onChange={setMonthlyInvestment} icon={currency.symbol} />
              
              <div className="input-row">
                <CalculatorInput label="Expected Returns" value={rate} onChange={setRate} suffix="%" />
                <CalculatorInput label="Time Period" value={years} onChange={setYears} suffix="Years" />
              </div>

              <button 
                type="button" 
                className="sip-toggle"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? "▲ Hide Step-Up" : "▼ Add Annual Step-Up (%)"}
              </button>

              {showAdvanced && (
                <div className="step-up-box">
                  <CalculatorInput label="Annual Increase (%)" value={stepUp} onChange={setStepUp} suffix="%" />
                  <p className="step-up-helper">
                    💡 <strong>Step-up SIP:</strong> Increasing your investment yearly drastically boosts long-term wealth.
                  </p>
                </div>
              )}
            </CalculatorForm>

            <div className="guide-card-wrapper">
                <Link href="/blog/sip-calculator-guide" className="read-guide-card">
                    📖 SIP Guide: How to Choose the Right Mutual Fund
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox title="Investment Summary" results={result}/>
            ) : (
              <div className="result-box-empty">
                Adjust parameters to see your investment grow.
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        <div className="info-card sip-info-card">
            <h3>The Magic of Compounding</h3>
            <p>
              A Systematic Investment Plan (SIP) allows you to invest small amounts regularly. 
              For example, investing just {currency.symbol}{formatCurrency(100)} every month can 
              grow into a significant fund over 20 years. This exponential growth is why the 
              "Time Period" often matters more than the "Amount" you start with.
            </p>
            

[Image of compound interest vs simple interest graph]

        </div>
      </div>
    </>
  );
}