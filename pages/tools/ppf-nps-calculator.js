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

export default function PPFNPSCalculator() {
  const { currency } = useCurrency();

  // Automatically find the data for THIS tool
  const toolData = tools.find(t => t.link === '/tools/ppf-nps-calculator');
  const guideData = Object.values(allToolGuides).find(g => g.tool === "ppf-nps");
  
  // 1. STATE MANAGEMENT
  const [monthlyInvest, setMonthlyInvest] = useState(12500); 
  const [rate, setRate] = useState(7.1); 
  const [years, setYears] = useState(15); 
  const [taxSlab, setTaxSlab] = useState(0); 
  const [showTax, setShowTax] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // 2. CALCULATION LOGIC
  const calculateWealth = () => {
    const P = parseFloat(monthlyInvest) || 0;
    const R = parseFloat(rate) || 0;
    const Y = parseFloat(years) || 0;
    const tax = parseFloat(taxSlab) / 100;

    if (P <= 0 || R <= 0 || Y <= 0) {
      setResult(null);
      setError("Please enter valid values for all fields.");
      return;
    }
    setError("");

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
      "Total Investment": Math.round(totalInvested),
      "Wealth Gained": Math.round(totalInterest),
      "Maturity Amount": Math.round(maturityValue),
      ...(taxSlab > 0 && { "Total Tax Saved": Math.round(totalTaxSaved) }),
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
    setError("");
  };

  return (
    <>
      <ToolSEO tool={toolData} guideData={guideData} />

      <div className="container">
        <div className="tool-intro ppf-nps-intro">
            <h1>📈 Wealth & Tax Planner</h1>
            <p>Plan your long-term security and track potential tax-saving benefits.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()} error={error}>
              <CalculatorInput label="Monthly Contribution" value={monthlyInvest} onChange={setMonthlyInvest} icon={currency.symbol} />

              <div className="input-row">
                <CalculatorInput label="Expected Rate" value={rate} onChange={setRate} suffix="%" />
                <CalculatorInput label="Duration" value={years} onChange={setYears} suffix="Years" />
              </div>

              <button 
                type="button" 
                className="tax-toggle"
                onClick={() => setShowTax(!showTax)}
              >
                {showTax ? "▲ Hide Tax Analysis" : "▼ Analyze Tax Savings"}
              </button>

              {showTax && (
                <div className="tax-analysis-box">
                    <label className="input-label">Your Income Tax Slab (%)</label>
                    <select 
                      value={taxSlab} 
                      onChange={(e) => setTaxSlab(e.target.value)}
                    >
                      <option value="0">Not Taxable</option>
                      <option value="10">10% Slab</option>
                      <option value="20">20% Slab</option>
                      <option value="30">30% Slab</option>
                    </select>
                    <p className="tax-helper-text">
                        *Calculates approximate savings based on eligible investment contributions.
                    </p>
                </div>
              )}
            </CalculatorForm>

            <div className="guide-card-wrapper">
                <Link href="/blog/ppf-nps-guide" className="read-guide-card">
                    📖 Roadmap: How to maximize long-term compounding benefits
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox title="Maturity Breakdown" results={result}/>
            ) : (
              <div className="result-box-empty">
                Enter contribution details to see your future wealth.
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        <div className="info-card wealth-planner-info">
            <h3>The Power of Long-Term Compounding</h3>
            <p>
              When you invest consistently over 15+ years, your interest starts earning its own interest at an 
              accelerated rate.  For example, in a tax-advantaged account, saving {currency.symbol}{formatCurrency(monthlyInvest)} monthly 
              doesn't just build wealth—it can also reduce your annual tax bill by {currency.symbol}{formatCurrency((monthlyInvest * 12) * (taxSlab/100))} depending 
              on your local laws.
            </p>
        </div>
      </div>
    </>
  );
}