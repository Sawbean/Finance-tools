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
import { formatCurrency } from "../../utils/formatters";

export default function SavingsGoalCalculator() {
  const { currency } = useCurrency();
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
  const [error, setError] = useState("");

  const calculateSavings = () => {
    let G = parseFloat(goal) || 0;
    const C = parseFloat(currentSavings) || 0;
    const Y = parseFloat(years) || 0;
    const R = parseFloat(rate) || 0;
    const inf = parseFloat(inflation) || 0;

    if (G <= 0 || Y <= 0) {
      setResult(null);
      setError("Target amount and years must be positive.");
      return;
    }
    setError("");

    const inflationAdjustedGoal = G * Math.pow(1 + inf / 100, Y);
    const n = Y * 12;
    const r = R / (12 * 100);
    
    const futureValueOfCurrent = C * Math.pow(1 + r, n);
    const amountToFund = Math.max(0, inflationAdjustedGoal - futureValueOfCurrent);

    let monthlySaving = 0;
    if (amountToFund > 0) {
      monthlySaving = r === 0 ? (amountToFund / n) : (amountToFund / ((Math.pow(1 + r, n) - 1) / r));
    }

    setResult({
      "Inflation Adjusted Goal": Math.round(inflationAdjustedGoal),
      "Existing Savings Growth": Math.round(futureValueOfCurrent),
      "Monthly Saving Needed": Math.ceil(monthlySaving),
      "Weekly Micro-Goal": Math.ceil(monthlySaving / 4.33),
      "Total Interest Earned": Math.round(inflationAdjustedGoal - (monthlySaving * n) - C)
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
    setError("");
  };

  return (
    <>
      <ToolSEO tool={toolData} guideData={guideData} />

      <div className="container">
        <div className="tool-intro savings-intro">
            <h1>🎯 Savings Goal Calculator</h1>
            <p>Plan your future by breaking down big dreams into small steps.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()} error={error}>
              <CalculatorInput label="Target Amount (Today's Value)" value={goal} onChange={setGoal} icon={currency.symbol} />
              
              <div className="input-row">
                <CalculatorInput label="Current Savings" value={currentSavings} onChange={setCurrentSavings} icon={currency.symbol} />
                <CalculatorInput label="Years to Reach" value={years} onChange={setYears} suffix="Years" />
              </div>

              <CalculatorInput label="Expected Annual Return (%)" value={rate} onChange={setRate} suffix="%" />

              <button 
                type="button" 
                className="advanced-toggle"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? "▲ Hide Inflation Settings" : "▼ Factor in Inflation?"}
              </button>

              {showAdvanced && (
                <div className="inflation-box">
                  <CalculatorInput label="Estimated Inflation Rate (%)" value={inflation} onChange={setInflation} suffix="%" />
                  <p className="inflation-helper-text">
                    💡 Inflation reduces your purchasing power. We adjust your goal so you can afford your target in the future.
                  </p>
                </div>
              )}
            </CalculatorForm>

            <div className="guide-card-wrapper">
                <Link href="/blog/savings-goal-guide" className="read-guide-card">
                    📖 Roadmap: How to reach your financial goals faster
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox title="Your Savings Plan" results={result}/>
            ) : (
              <div className="result-box-empty">
                Enter your target to see your roadmap.
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        <div className="info-card inflation-info-card">
            <h3>Beat the "Silent Thief" (Inflation)</h3>
            <p>
                Inflation reduces your <strong>purchasing power</strong> over time.  For example, if inflation is 5%, 
                an item costing {currency.symbol}{formatCurrency(100)} today will cost 
                roughly {currency.symbol}{formatCurrency(163)} in 10 years. 
                By investing your savings in assets that outpace inflation, you ensure your 
                hard-earned money stays valuable.
            </p>
        </div>
      </div>
    </>
  );
}