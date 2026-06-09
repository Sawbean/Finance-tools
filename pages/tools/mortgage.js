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

export default function MortgageCalculator() {
  const { currency } = useCurrency();
  // Automatically find the data for THIS tool
  const toolData = tools.find(t => t.link === '/tools/mortgage');
  const guideData = Object.values(allToolGuides).find(g => g.tool === "mortgage");
  
  // 1. STATE MANAGEMENT
  const [homePrice, setHomePrice] = useState(5000000);
  const [downPayment, setDownPayment] = useState(1000000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);
  
  const [propertyTax, setPropertyTax] = useState(0.1);
  const [insurance, setInsurance] = useState(15000);   
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // 2. CALCULATION LOGIC
  const calculateMortgage = () => {
    const P_Home = parseFloat(homePrice) || 0;
    const DP = parseFloat(downPayment) || 0;
    const R = parseFloat(rate) || 0;
    const Y = parseFloat(years) || 0;

    const principal = P_Home - DP;

    if (principal <= 0 || R <= 0 || Y <= 0) {
      setResult(null);
      setError(principal <= 0 ? "Down payment cannot exceed home price." : "Please enter valid interest and term values.");
      return;
    }
    setError("");
    const N = Y * 12;
    const monthlyRate = R / (12 * 100);
    
    const monthlyPI = (principal * monthlyRate * Math.pow(1 + monthlyRate, N)) / (Math.pow(1 + monthlyRate, N) - 1);
    const monthlyTax = (P_Home * (parseFloat(propertyTax) / 100)) / 12;
    const monthlyIns = (parseFloat(insurance) || 0) / 12;

    setResult({
      "Total Loan Amount": Math.round(principal),
      "Down Payment (%)": `${((DP / P_Home) * 100).toFixed(1)}%`,
      "Monthly P & I": Math.round(monthlyPI),
      "Property Tax & Ins": Math.round(monthlyTax + monthlyIns),
      "Total Monthly Payment": Math.round(monthlyPI + monthlyTax + monthlyIns),
      "Total Interest (Full Term)": Math.round((monthlyPI * N) - principal)
    });
  };

  useEffect(() => {
    calculateMortgage();
  }, [homePrice, downPayment, rate, years, propertyTax, insurance]);

  const handleReset = () => {
    setHomePrice(""); setDownPayment(""); setRate(""); setYears("");
    setPropertyTax(""); 
    setInsurance("");
    setResult(null);
    setError("");
  };

  return (
    <>
      <ToolSEO tool={toolData} guideData={guideData} />

      <div className="container">
        <div className="tool-intro mortgage-intro">
            <h1>🏠 Mortgage Calculator</h1>
            <p>Calculate your true cost of home ownership including hidden fees.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()} error={error}>
              
              <CalculatorInput label="Home Purchase Price" value={homePrice} onChange={setHomePrice} icon={currency.symbol} />
              
              <div className="input-row">
                <CalculatorInput label="Down Payment" value={downPayment} onChange={setDownPayment} icon={currency.symbol} />
                <div className="down-payment-percentage">
                    <strong>{((downPayment/homePrice)*100 || 0).toFixed(1)}%</strong> of price
                </div>
              </div>

              <div className="input-row">
                <CalculatorInput label="Interest Rate" value={rate} onChange={setRate} suffix="%" />
                <CalculatorInput label="Loan Term" value={years} onChange={setYears} suffix="Years" />
              </div>

              <button 
                type="button" 
                className="advanced-toggle"
                onClick={() => setShowAdvanced(!showAdvanced)} 
              >
                {showAdvanced ? "▲ Hide Taxes & Insurance" : "▼ Add Taxes & Insurance"}
              </button>

              {showAdvanced && (
                <div className="advanced-options">
                  <div className="input-row">
                    <CalculatorInput label="Property Tax (%)" value={propertyTax} onChange={setPropertyTax} suffix="%" />
                    <CalculatorInput label="Annual Insurance" value={insurance} onChange={setInsurance} icon={currency.symbol} />
                  </div>
                </div>
              )}
            </CalculatorForm>

            <div className="guide-card-wrapper">
                <Link href="/blog/mortgage-calculator-guide" className="read-guide-card">
                    📖 Home Loan Guide: 5 Mistakes to Avoid
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox title="Payment Breakdown" results={result}/>
            ) : (
              <div className="result-box-empty">
                Enter property details to see monthly costs.
              </div>
            )}
            <div className="sidebar-ad"><AdPlaceholder /></div>
          </div>
        </div>

        <div className="info-card mortgage-info-card">
            <h3>⚖️ What is PITI?</h3>
            <p>
                PITI stands for <strong>Principal, Interest, Taxes, and Insurance</strong>. 
                For instance, on a {formatCurrency(5000000)} home, adding 1% in annual property tax 
                adds {formatCurrency(Math.round(5000000 * 0.01 / 12))} to your monthly bill.
            </p>
        </div>
      </div>
    </>
  );
}