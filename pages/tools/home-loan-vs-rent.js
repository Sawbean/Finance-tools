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

export default function HomeLoanVsRentCalculator() {
  const { currency } = useCurrency();
  // Automatically find the data for THIS tool
  const toolData = tools.find(t => t.link === '/tools/home-loan-vs-rent');
  const guideData = Object.values(allToolGuides).find(g => g.tool === "home-loan-vs-rent");
  // 1. STATE MANAGEMENT
  const [homePrice, setHomePrice] = useState(15000000); 
  const [loanRate, setLoanRate] = useState(11);
  const [loanYears, setLoanYears] = useState(20);
  const [monthlyRent, setMonthlyRent] = useState(35000);
  const [propertyAppreciation, setPropertyAppreciation] = useState(5);
  const [rentIncrease, setRentIncrease] = useState(8);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // 2. CALCULATION LOGIC
  const calculateComparison = () => {
    const P = parseFloat(homePrice) || 0;
    const R = parseFloat(loanRate) || 0;
    const Y = parseFloat(loanYears) || 0;
    const initialRent = parseFloat(monthlyRent) || 0;
    const appRate = parseFloat(propertyAppreciation) / 100;
    const rentIncRate = parseFloat(rentIncrease) / 100;

    if (P <= 0 || R <= 0 || Y <= 0) {
      setResult(null);
      setError(homePrice <= 0 ? "Property price must be greater than zero." : "");
      return;
    }
    setError("");

    // EMI Calculation
    const N = Y * 12;
    const monthlyRate = R / (12 * 100);
    const monthlyEMI = (P * monthlyRate * Math.pow(1 + monthlyRate, N)) / (Math.pow(1 + monthlyRate, N) - 1);
    const totalLoanCost = monthlyEMI * N;
    const totalInterest = totalLoanCost - P;

    // Rent Calculation (Compound Growth)
    let totalRentCost = 0;
    let currentYearlyRent = initialRent * 12;
    for (let i = 0; i < Y; i++) {
        totalRentCost += currentYearlyRent;
        currentYearlyRent *= (1 + rentIncRate);
    }

    // Future Value of Home
    const futureHomeValue = P * Math.pow(1 + appRate, Y);
    const netHomeWealth = futureHomeValue - totalLoanCost;

    setResult({
      "Monthly EMI": monthlyEMI,
      "Total Loan Cost": totalLoanCost,
      "Total Interest Payable": totalInterest,
      "Total Rent (20Y)": totalRentCost,
      "Estimated Future Value": futureHomeValue,
      "Net Wealth (If Buying)": netHomeWealth,
    });
  };

  useEffect(() => {
    calculateComparison();
  }, [homePrice, loanRate, loanYears, monthlyRent, propertyAppreciation, rentIncrease]);

  const handleReset = () => {
    setHomePrice(15000000);
    setLoanRate(11);
    setLoanYears(20);
    setMonthlyRent(35000);
    setPropertyAppreciation(5);
    setRentIncrease(8);
    setResult(null);
  };

  return (
    <>
     <ToolSEO tool={toolData} guideData={guideData} />

      <div className="container">
        <div className="tool-intro" style={{textAlign: 'center', marginBottom: '30px'}}>
            <h1 style={{fontSize: '2.5rem', color: 'var(--primary)'}}>🏡 Home Loan vs Rent</h1>
            <p style={{color: '#666'}}>Compare the financial impact of owning versus renting over your loan tenure.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()} error={error}>
              <CalculatorInput label="Property Price" value={homePrice} onChange={setHomePrice} icon={currency.symbol} />
              
              <div className="input-row">
                <CalculatorInput label="Loan Rate" value={loanRate} onChange={setLoanRate} suffix="%" />
                <CalculatorInput label="Tenure" value={loanYears} onChange={setLoanYears} suffix="Yrs" />
              </div>

              <CalculatorInput label="Current Monthly Rent" value={monthlyRent} onChange={setMonthlyRent} icon={currency.symbol} />

              <button 
                type="button" 
                onClick={() => setShowAdvanced(!showAdvanced)}
                style={{
                  marginTop: '10px', width: '100%', padding: '10px', 
                  background: 'transparent', border: '1px dashed #cbd5e1', 
                  borderRadius: '8px', cursor: 'pointer', color: '#475569', fontSize: '0.85rem'
                }}
              >
                {showAdvanced ? "▲ Hide Market Projections" : "▼ Include Appreciation & Rent Growth"}
              </button>

              {showAdvanced && (
                <div style={{marginTop: '15px', padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0'}}>
                  <div className="input-row">
                    <CalculatorInput label="Home Appreciation" value={propertyAppreciation} onChange={setPropertyAppreciation} suffix="%/yr" />
                    <CalculatorInput label="Annual Rent Hike" value={rentIncrease} onChange={setRentIncrease} suffix="%/yr" />
                  </div>
                  <p style={{fontSize: '0.75rem', color: '#64748b', marginTop: '10px'}}>
                    *Market appreciation varies by location; 5-8% is often used for long-term estimates.
                  </p>
                </div>
              )}
            </CalculatorForm>

            <div style={{marginTop: '25px'}}>
                <Link href="/blog/home-loan-vs-rent-guide" className="read-guide-card" style={{display: 'block', textDecoration: 'none'}}>
                    📖 Guide: Is real estate still a strong investment in 2026?
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <>
                <ResultBox title="Financial Comparison" results={result}  />
                <div style={{
                    marginTop: '20px', padding: '20px', borderRadius: '12px', 
                    textAlign: 'center', border: '2px dashed #e2e8f0',
                    background: result["Net Wealth (If Buying)"] > 0 ? '#f0fdf4' : '#fff7ed'
                }}>
                    <h4 style={{color: result["Net Wealth (If Buying)"] > 0 ? '#166534' : '#9a3412'}}>💡 Quick Verdict</h4>
                    <p style={{fontSize: '0.85rem', marginTop: '5px', color: '#475569'}}>
                        {result["Net Wealth (If Buying)"] > 0 
                        ? "Buying creates significant long-term wealth in this scenario as appreciation outpaces interest costs." 
                        : "Renting may be more beneficial here, especially if you invest the difference between rent and EMI."}
                    </p>
                </div>
              </>
            ) : (
              <div className="result-box" style={{background: '#f8fafc', color: '#64748b', textAlign: 'center'}}>
                Enter details to compare buying vs. renting.
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

       {result && (
        <div className="info-card" style={{marginTop: '40px', padding: '25px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0'}}>
            <h3 style={{color: 'var(--primary)', marginBottom: '10px'}}>Buy vs Rent: The Opportunity Cost</h3>
            <p style={{fontSize: '0.9rem', color: '#475569', lineHeight: '1.6'}}>
                In your scenario, your initial rent of <strong>{formatCurrency(monthlyRent)}</strong> will grow to 
                <strong> {formatCurrency(Math.round(monthlyRent * Math.pow(1 + rentIncrease/100, loanYears)))}</strong> 
                by year {loanYears} if the {rentIncrease}% annual hike continues. 
                <br /><br />
                Meanwhile, your EMI stays fixed at <strong>{formatCurrency(result["Monthly EMI"])}</strong>. 
                The real question is whether the <strong>{formatCurrency(result["Total Interest Payable"])}</strong> 
                you pay in interest is a fair price for owning an asset that could be worth 
                <strong> {formatCurrency(result["Estimated Future Value"])}</strong>.
            </p>           
        </div>
      )}
            </div>
    </>
  );
}