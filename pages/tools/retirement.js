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

export default function RetirementCalculator() {
  const { currency } = useCurrency();

  // Automatically find the data for THIS tool
  const toolData = tools.find(t => t.link === '/tools/retirement');
  const guideData = Object.values(allToolGuides).find(g => g.tool === "retirement");
  
  // 1. STATE MANAGEMENT
  const [currentAge, setCurrentAge] = useState(25);
  const [retireAge, setRetireAge] = useState(60);
  const [monthlySaving, setMonthlySaving] = useState(15000);
  const [existingCorpus, setExistingCorpus] = useState(100000);
  const [rate, setRate] = useState(12);
  const [inflation, setInflation] = useState(6);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // 2. CALCULATION LOGIC
  const calculateRetirement = () => {
    const age = parseFloat(currentAge) || 0;
    const retire = parseFloat(retireAge) || 0;
    const monthly = parseFloat(monthlySaving) || 0;
    const corpus = parseFloat(existingCorpus) || 0;
    const R = parseFloat(rate) || 0;
    const Inf = parseFloat(inflation) || 0;

    if (retire <= age || age <= 0) {
      setResult(null);
      setError("Retirement age must be greater than current age.");
      return;
    }
    setError("");

    const yearsToInvest = retire - age;
    const n = yearsToInvest * 12;
    const r = R / (12 * 100);

    const fvSIP = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const fvCorpus = corpus * Math.pow(1 + r, n);
    const totalFund = fvSIP + fvCorpus;

    const inflationAdjustedValue = totalFund / Math.pow(1 + Inf / 100, yearsToInvest);
    const monthlyPension = (totalFund * 0.05) / 12;

    setResult({
      "Estimated Retirement Fund": Math.round(totalFund),
      "Monthly Pension (Post-Retire)": Math.round(monthlyPension),
      "Buying Power (Today's Value)": Math.round(inflationAdjustedValue),
      "Total Amount Invested": Math.round((monthly * n) + corpus),
      "Wealth Growth": Math.round(totalFund - ((monthly * n) + corpus))
    });
  };

  useEffect(() => {
    calculateRetirement();
  }, [currentAge, retireAge, monthlySaving, existingCorpus, rate, inflation]);

  const handleReset = () => {
    setCurrentAge(25); 
    setRetireAge(60); 
    setMonthlySaving(""); 
    setExistingCorpus(0); 
    setResult(null);
    setError("");
  };

  return (
    <>
      <ToolSEO tool={toolData} guideData={guideData} />

      <div className="container">
        <div className="tool-intro retirement-intro">
            <h1>👵 Retirement Planner</h1>
            <p>Will you have enough for the lifestyle you want? Let's find out.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()} error={error}>
              
              <div className="input-row">
                <CalculatorInput label="Current Age" value={currentAge} onChange={setCurrentAge} />
                <CalculatorInput label="Retirement Age" value={retireAge} onChange={setRetireAge} />
              </div>

              <CalculatorInput label="Monthly Investment" value={monthlySaving} onChange={setMonthlySaving} icon={currency.symbol} />
              <CalculatorInput label="Expected Returns (%)" value={rate} onChange={setRate} suffix="%" />

              <button 
                type="button" 
                className="advanced-toggle"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? "▲ Hide Advanced Settings" : "▼ Include Existing Wealth & Inflation"}
              </button>

              {showAdvanced && (
                <div className="advanced-options">
                  <CalculatorInput label="Current Savings" value={existingCorpus} onChange={setExistingCorpus} icon={currency.symbol} />
                  <CalculatorInput label="Expected Inflation (%)" value={inflation} onChange={setInflation} suffix="%" />
                </div>
              )}
            </CalculatorForm>

            <div className="guide-card-wrapper">
                <Link href="/blog/retirement-guide" className="read-guide-card">
                    📖 Roadmap: How to build a multi-million dollar retirement fund
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox title="Retirement Summary" results={result}/>
            ) : (
              <div className="result-box-empty">
                Enter your details to see your roadmap.
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        <div className="info-card retirement-info-card">
            <h3>The 4% - 5% Safe Withdrawal Rule</h3>
            <p>
              Financial experts suggest that if you withdraw <strong>4% to 5%</strong> of your total fund every year, 
              your money should theoretically last for 30+ years.  For instance, a fund of 
              {currency.symbol}{formatCurrency(1000000)} could provide you with an annual income 
              of {currency.symbol}{formatCurrency(40000)} to {currency.symbol}{formatCurrency(50000)} while 
              the principal stays relatively intact.
            </p>
        </div>
      </div>
    </>
  );
}