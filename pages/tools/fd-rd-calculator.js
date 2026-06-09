import { useState, useEffect } from "react";
import Link from "next/link";
import { tools } from '../../data/tools';
import ToolSEO from '../../components/layout/ToolSEO';
import { allToolGuides } from '../../data/tool-guides/index';
// Import global utilities
import { useCurrency } from "../../context/CurrencyContext"; 

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function FDRDCalculator() {
  const { currency } = useCurrency();
  const formatValue = (val) => new Intl.NumberFormat(currency.locale).format(val);

  // Automatically find the data for THIS tool
  const toolData = tools.find(t => t.link === '/tools/fd-rd-calculator');
  const guideData = Object.values(allToolGuides).find(g => g.tool === "fd-rd-calculator");
  // 1. STATE MANAGEMENT
  const [activeTab, setActiveTab] = useState("fd");
  const [error, setError] = useState("");
  
  // FD States
  const [fdPrincipal, setFdPrincipal] = useState(100000);
  const [fdRate, setFdRate] = useState(8.5);
  const [fdYears, setFdYears] = useState(5);

  // RD States
  const [rdMonthly, setRdMonthly] = useState(5000);
  const [rdRate, setRdRate] = useState(7.5);
  const [rdYears, setRdYears] = useState(3);

  const [result, setResult] = useState(null);

  // 2. CALCULATION LOGIC
  const calculateResult = () => {
    setError("");

    if (activeTab === "fd") {
      const P = parseFloat(fdPrincipal) || 0;
      const R = parseFloat(fdRate) || 0;
      const Y = parseFloat(fdYears) || 0;

      if (P <= 0 || R <= 0 || Y <= 0) {
        setResult(null);
        if (fdPrincipal || fdRate || fdYears) setError("Please enter valid investment details.");
        return;
      }

      const n = 4; // Quarterly Compounding
      const total = P * Math.pow(1 + R / (100 * n), n * Y);
      const interest = total - P;

      setResult({
        "Principal Amount": P,
        "Total Invested": P,
        "Interest Earned": Math.round(interest),
        "Maturity Amount": Math.round(total)
      });
    } else {
      const M = parseFloat(rdMonthly) || 0;
      const R = parseFloat(rdRate) || 0;
      const Y = parseFloat(rdYears) || 0;

      if (M <= 0 || R <= 0 || Y <= 0) {
        setResult(null);
        if (rdMonthly || rdRate || rdYears) setError("Please enter valid deposit details.");
        return;
      }

      const n = 4; // Quarterly Compounding
      const i = R / 400;
      // RD Maturity Formula (Quarterly Compounding)
      const total = M * ((Math.pow(1 + i, 4 * Y) - 1) / (1 - Math.pow(1 + i, -1/3)));
      const totalInvested = M * (Y * 12);
      const interest = total - totalInvested;

      setResult({
        "Monthly Deposit": M,
        "Total Invested": totalInvested,
        "Interest Earned": Math.round(interest),
        "Maturity Amount": Math.round(total)
      });
    }
  };

  useEffect(() => {
    calculateResult();
  }, [activeTab, fdPrincipal, fdRate, fdYears, rdMonthly, rdRate, rdYears]);

  const handleReset = () => {
      setError("");
      if (activeTab === "fd") {
        setFdPrincipal(100000);
        setFdRate(8.5);
        setFdYears(5);
      } else {
        setRdMonthly(5000);
        setRdRate(7.5);
        setRdYears(3);
      }
    };

  return (
    <>
      <ToolSEO tool={toolData} guideData={guideData} />

      <div className="container">
        <div className="tool-intro">
            <h1>💰 FD & RD Planner</h1>
            <p>Compare guaranteed returns to grow your wealth safely.</p>
        </div>

        <div className="tab-switcher-container">
            <button 
                type="button"
                className={`tab-btn ${activeTab === 'fd' ? 'active' : ''}`}
                onClick={() => {setActiveTab("fd"); setError("");}}
            >
                🏢 Fixed Deposit (FD)
            </button>
            <button 
                type="button"
                className={`tab-btn ${activeTab === 'rd' ? 'active' : ''}`}
                onClick={() => {setActiveTab("rd"); setError("");}}
            >
                🔄 Recurring Deposit (RD)
            </button>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()} error={error}>
              {activeTab === "fd" ? (
                <>
                  <CalculatorInput label="Lumpsum Principal" value={fdPrincipal} onChange={setFdPrincipal} icon={currency.symbol} />
                  <div className="input-row">
                      <CalculatorInput label="Interest Rate" value={fdRate} onChange={setFdRate} suffix="%" />
                      <CalculatorInput label="Duration" value={fdYears} onChange={setFdYears} suffix="Years" />
                  </div>
                </>
              ) : (
                <>
                  <CalculatorInput label="Monthly Deposit" value={rdMonthly} onChange={setRdMonthly} icon={currency.symbol} />
                  <div className="input-row">
                      <CalculatorInput label="Interest Rate" value={rdRate} onChange={setRdRate} suffix="%" />
                      <CalculatorInput label="Duration" value={rdYears} onChange={setRdYears} suffix="Years" />
                  </div>
                </>
              )}
            </CalculatorForm>
            
            <div className="guide-card-wrapper">
                <Link href="/blog/fd-rd-guide" className="read-guide-card">
                    📖 Comparison: FD vs RD — Which strategy fits your goal?
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox title={`${activeTab.toUpperCase()} Maturity Summary`} results={result} />
            ) : (
              <div className="result-box-empty">
                Enter details to calculate maturity roadmap.
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        <div className="info-card fd-rd-info">
            <h3>💡 Strategic Financial Insight</h3>
            <p className="info-text">
              By choosing the <strong>{activeTab === "fd" ? "FD" : "RD"} route</strong>, you are targeting a maturity amount of 
              <strong> {result ? `${currency.symbol}${formatValue(result["Maturity Amount"])}` : "---"}</strong>. 
            </p>
            <p className="info-text">
              Commercial bank deposits typically employ <strong>quarterly compounding</strong>. In a standard Fixed Deposit, your entire principal accumulates interest simultaneously from day one. Conversely, with a Recurring Deposit, your contributions roll in monthly; thus, later deposits compound over shorter horizons, yielding slightly less overall growth than a single up-front lump sum.
            </p>
        </div>
      </div>
    </>
  );
}