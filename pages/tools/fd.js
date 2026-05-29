import { useState, useEffect } from "react";
import Link from "next/link";
import { allToolGuides } from '../../data/tool-guides/index';
import { useCurrency } from "../../context/CurrencyContext"; 
import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";
import { tools } from '../../data/tools';
import ToolSEO from '../../components/layout/ToolSEO';

export default function FDCalculator() {
  const { currency } = useCurrency();
  const formatCurrency = (val) => new Intl.NumberFormat(currency.locale, { style: 'currency', currency: currency.code }).format(val);
  // Automatically find the data for THIS tool
  const toolData = tools.find(t => t.link === '/tools/fd');
  const guideData = Object.values(allToolGuides).find(g => g.tool === "fd");

  // 1. STATE MANAGEMENT
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(7.5);
  const [years, setYears] = useState(5);
  const [compounding, setCompounding] = useState(4); 
  const [taxRate, setTaxRate] = useState(5); 
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // 2. CALCULATION LOGIC
  const calculateFD = () => {
    setError("");
    const P = parseFloat(principal) || 0;
    const r = (parseFloat(rate) || 0) / 100;
    const t = parseFloat(years) || 0;
    const n = parseFloat(compounding) || 1;
    const tax = (parseFloat(taxRate) || 0) / 100;

    if (P <= 0 || r <= 0 || t <= 0) {
      setResult(null);
      if (principal || rate || years) setError("Please enter valid investment details.");
      return;
    }

    const maturityAmount = P * Math.pow(1 + r / n, n * t);
    const totalInterest = maturityAmount - P;
    const taxDeduction = totalInterest * tax;
    const postTaxMaturity = maturityAmount - taxDeduction;
    const effectiveYield = (Math.pow(1 + r / n, n) - 1) * 100;

    setResult({
      "Principal Amount": P,
      "Total Interest Earned": Math.round(totalInterest),
      "TDS Deduction": Math.round(taxDeduction),
      "Net Maturity Value": Math.round(postTaxMaturity),
      "Effective Annual Yield": `${effectiveYield.toFixed(2)}%`
    });
  };

  useEffect(() => {
    calculateFD();
  }, [principal, rate, years, compounding, taxRate]);

  const handleReset = () => {
    setError("");
    setPrincipal(""); 
    setRate(""); 
    setYears(""); 
    setCompounding(4);
    setTaxRate(5);
    setResult(null);
  };

  return (
    <>
     <ToolSEO tool={toolData} guideData={guideData} />

      <div className="container">
        <div className="tool-intro" style={{textAlign: 'center', marginBottom: '30px'}}>
            <h1 style={{fontSize: '2.5rem', color: 'var(--primary)'}}>🏦 FD Calculator</h1>
            <p style={{color: '#666'}}>Plan your savings with guaranteed bank deposit returns.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            {/* Added error prop for validation feedback */}
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()} error={error}>
              
              <CalculatorInput label="Investment Amount" value={principal} onChange={setPrincipal} icon={currency.symbol} />

              <div className="input-row">
                <CalculatorInput label="Annual Interest Rate" value={rate} onChange={setRate} suffix="%" />
                <CalculatorInput label="Duration" value={years} onChange={setYears} suffix="Years" />
              </div>

              {/* Standardized Advanced Toggle */}
              <button 
                type="button" 
                onClick={() => setShowAdvanced(!showAdvanced)}
                style={{
                  marginTop: '10px', width: '100%', padding: '10px', 
                  background: 'transparent', border: '1px dashed #cbd5e1', 
                  borderRadius: '8px', cursor: 'pointer', color: '#475569', fontSize: '0.85rem'
                }}
              >
                {showAdvanced ? "▲ Hide Settings" : "▼ Compounding & Tax (TDS)"}
              </button>

              {showAdvanced && (
                <div style={{marginTop: '15px', padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0'}}>
                  <div className="input-row">
                    <div style={{flex: 1}}>
                      <label className="input-label">Compounding</label>
                      <select 
                        style={{
                          width: '100%', padding: '12px', borderRadius: '8px', 
                          border: '1px solid #d1d5db', background: '#fff', marginTop: '5px'
                        }}
                        value={compounding} 
                        onChange={(e) => setCompounding(e.target.value)}
                      >
                        <option value="12">Monthly</option>
                        <option value="4">Quarterly (Standard)</option>
                        <option value="1">Yearly</option>
                      </select>
                    </div>
                    <CalculatorInput label="TDS Tax Rate (%)" value={taxRate} onChange={setTaxRate} suffix="%" />
                  </div>
                </div>
              )}
            </CalculatorForm>

            <div style={{marginTop: '25px'}}>
                <Link href="/blog/fd-calculator-guide" className="read-guide-card" style={{display: 'block', textDecoration: 'none'}}>
                    📖 FD Mastery: How to get the highest returns on your savings
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox title="Maturity Breakdown" results={result} />
            ) : (
              <div className="result-box" style={{background: '#f8fafc', color: '#64748b', textAlign: 'center'}}>
                Enter deposit details to calculate your maturity value.
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        {result && (
          <div className="info-card" style={{marginTop: '40px', padding: '25px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #dcfce7'}}>
              <h3 style={{color: '#166534', marginBottom: '10px'}}>The Power of Compounding</h3>
              <p style={{fontSize: '0.9rem', color: '#166534', lineHeight: '1.6'}}>
                  By choosing <strong>{compounding == "4" ? "Quarterly" : compounding == "12" ? "Monthly" : "Yearly"} compounding</strong>, 
                  your effective return is <strong>{result["Effective Annual Yield"]}</strong>—which is higher than 
                  your base rate of {rate}%. 
                  <br /><br />
                  Over {years} years, this compounding effect contributes 
                  significantly to your total earnings of <strong>{formatCurrency(result["Total Interest Earned"])}</strong>.
              </p>
          </div>
        )}
      </div>
    </>
  );
}