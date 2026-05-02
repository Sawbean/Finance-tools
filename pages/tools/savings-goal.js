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

export default function SavingsGoalCalculator() {
  const { currency } = useCurrency();
  const formatValue = (val) => new Intl.NumberFormat(currency.locale).format(val);
  // Automatically find the data for THIS tool
  const toolData = tools.find(t => t.link === '/tools/savings-goal');
  const guideData = Object.values(allToolGuides).find(g => g.tool === "savings-goal");
  const [goal, setGoal] = useState(1000000);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(8);
  const [inflation, setInflation] = useState(5); 
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [result, setResult] = useState(null);

  const calculateSavings = () => {
    let G = parseFloat(goal) || 0;
    const C = parseFloat(currentSavings) || 0;
    const Y = parseFloat(years) || 0;
    const R = parseFloat(rate) || 0;
    const inf = parseFloat(inflation) || 0;

    if (G <= 0 || Y <= 0) return;

    const inflationAdjustedGoal = G * Math.pow(1 + inf / 100, Y);
    const n = Y * 12;
    const r = R / (12 * 100);
    
    const futureValueOfCurrent = C * Math.pow(1 + r, n);
    const amountToFund = Math.max(0, inflationAdjustedGoal - futureValueOfCurrent);

    let monthlySaving = 0;
    if (amountToFund > 0) {
      if (r === 0) {
        monthlySaving = amountToFund / n;
      } else {
        monthlySaving = amountToFund / ((Math.pow(1 + r, n) - 1) / r);
      }
    }

    setResult({
    "Inflation Adjusted Goal": `${currency.symbol}${formatValue(Math.round(inflationAdjustedGoal))}`,
    "Existing Savings Growth": `${currency.symbol}${formatValue(Math.round(futureValueOfCurrent))}`,
    "Monthly Saving Needed": `${currency.symbol}${formatValue(Math.ceil(monthlySaving))}`,
    "Weekly Micro-Goal": `${currency.symbol}${formatValue(Math.ceil(monthlySaving / 4.33))}`,
    "Total Interest Earned": `${currency.symbol}${formatValue(Math.round(inflationAdjustedGoal - (monthlySaving * n) - C))}`,
  });
  };

  useEffect(() => {
    calculateSavings();
  }, [goal, currentSavings, years, rate, inflation]);

  const handleReset = () => {
    setGoal(""); 
    setCurrentSavings(""); 
    setYears(""); 
    setRate(""); 
    setInflation(0); 
    setResult(null);
  };

  return (
    <>
      
      <ToolSEO tool={toolData} guideData={guideData} />

      <div className="container">
        <div className="tool-intro" style={{textAlign: 'center', marginBottom: '30px'}}>
            <h1 style={{fontSize: '2.5rem', color: 'var(--primary)'}}>🎯 Savings Goal Calculator</h1>
            <p style={{color: '#666'}}>Plan your future by breaking down big dreams into small steps.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()}>
              <CalculatorInput label="Target Amount (Today's Value)" value={goal} onChange={setGoal} icon={currency.symbol} />
              
              <div className="input-row">
                <CalculatorInput label="Current Savings" value={currentSavings} onChange={setCurrentSavings} icon={currency.symbol} />
                <CalculatorInput label="Years to Reach" value={years} onChange={setYears} suffix="Years" />
              </div>

              <CalculatorInput label="Expected Annual Return (%)" value={rate} onChange={setRate} suffix="%" />

              <button 
                type="button" 
                onClick={() => setShowAdvanced(!showAdvanced)}
                style={{
                  marginTop: '10px', width: '100%', padding: '10px', 
                  background: 'transparent', border: '1px dashed #cbd5e1', 
                  borderRadius: '8px', cursor: 'pointer', color: '#475569', fontSize: '0.85rem'
                }}
              >
                {showAdvanced ? "▲ Hide Inflation Settings" : "▼ Factor in Inflation?"}
              </button>

              {showAdvanced && (
                <div style={{marginTop: '15px', padding: '15px', background: '#fffbeb', borderRadius: '10px', border: '1px solid #fef3c7'}}>
                  <CalculatorInput label="Estimated Inflation Rate (%)" value={inflation} onChange={setInflation} suffix="%" />
                  <p style={{fontSize: '0.75rem', color: '#92400e', marginTop: '8px'}}>
                    💡 Inflation reduces your purchasing power. We adjust your goal so you can afford your target in the future.
                  </p>
                </div>
              )}
            </CalculatorForm>

            {/* Standardized Guide Card location */}
            <div style={{marginTop: '25px'}}>
                <Link href="/blog/savings-goal-guide" className="read-guide-card" style={{display: 'block', textDecoration: 'none'}}>
                    📖 Roadmap: How to reach your financial goals faster
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox title="Your Savings Plan" results={result}/>
            ) : (
              <div className="result-box" style={{background: '#f8fafc', color: '#64748b', textAlign: 'center'}}>
                Enter your target to see your roadmap.
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        <div className="info-card" style={{marginTop: '40px', padding: '25px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0'}}>
            <h3 style={{marginBottom: '15px'}}>Beat the "Silent Thief" (Inflation)</h3>
            <p style={{fontSize: '0.95rem', lineHeight: '1.6', color: '#475569'}}>
                Inflation reduces your <strong>purchasing power</strong> over time. For example, if inflation is 5%, 
                an item costing {currency.symbol}{formatValue(100)} today will cost 
                roughly {currency.symbol}{formatValue(163)} in 10 years. 
                By investing your savings in assets that outpace inflation, you ensure your 
                hard-earned money stays valuable.
            </p>
        </div>
      </div>
    </>
  );
}