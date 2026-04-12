import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

// Import global utilities
import { formatCurrency, globalCurrency } from "../../utils/formatters"; 

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function RetirementCalculator() {
  // 1. STATE MANAGEMENT
  const [currentAge, setCurrentAge] = useState(25);
  const [retireAge, setRetireAge] = useState(60);
  const [monthlySaving, setMonthlySaving] = useState(15000);
  const [existingCorpus, setExistingCorpus] = useState(100000);
  const [rate, setRate] = useState(12);
  const [inflation, setInflation] = useState(6);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [result, setResult] = useState(null);

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
      return;
    };

    const yearsToInvest = retire - age;
    const n = yearsToInvest * 12;
    const r = R / (12 * 100);

    const fvSIP = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const fvCorpus = corpus * Math.pow(1 + r, n);
    const totalFund = fvSIP + fvCorpus;

    const inflationAdjustedValue = totalFund / Math.pow(1 + Inf / 100, yearsToInvest);
    const monthlyPension = (totalFund * 0.05) / 12;

    setResult({
      "Estimated Retirement Fund": totalFund,
      "Monthly Pension (Post-Retire)": monthlyPension,
      "Buying Power (Today's Value)": inflationAdjustedValue,
      "Total Amount Invested": (monthly * n) + corpus,
      "Wealth Growth": totalFund - ((monthly * n) + corpus)
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
  };

  return (
    <>
      <Head>
        <title>Retirement Calculator | Pension & Corpus Planner | ToolFinance</title>
        <meta name="description" content="Plan your retirement corpus with inflation adjustments. See your future monthly pension and wealth growth." />
      </Head>

      <div className="container">
        <div className="tool-intro" style={{textAlign: 'center', marginBottom: '30px'}}>
            <h1 style={{fontSize: '2.5rem', color: 'var(--primary)'}}>👵 Retirement Planner</h1>
            <p style={{color: '#666'}}>Will you have enough for the lifestyle you want? Let's find out.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()}>
              
              <div className="input-row">
                <CalculatorInput label="Current Age" value={currentAge} onChange={setCurrentAge} />
                <CalculatorInput label="Retirement Age" value={retireAge} onChange={setRetireAge} />
              </div>

              <CalculatorInput label="Monthly Investment" value={monthlySaving} onChange={setMonthlySaving} icon={globalCurrency} />
              <CalculatorInput label="Expected Returns (%)" value={rate} onChange={setRate} suffix="%" />

              <button 
                type="button" 
                onClick={() => setShowAdvanced(!showAdvanced)}
                style={{
                  marginTop: '10px', width: '100%', padding: '10px', 
                  background: 'transparent', border: '1px dashed #cbd5e1', 
                  borderRadius: '8px', cursor: 'pointer', color: '#475569', fontSize: '0.85rem'
                }}
              >
                {showAdvanced ? "▲ Hide Advanced Settings" : "▼ Include Existing Wealth & Inflation"}
              </button>

              {showAdvanced && (
                <div style={{marginTop: '15px', padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0'}}>
                  <CalculatorInput label="Current Savings" value={existingCorpus} onChange={setExistingCorpus} icon={globalCurrency} />
                  <CalculatorInput label="Expected Inflation (%)" value={inflation} onChange={setInflation} suffix="%" />
                </div>
              )}
            </CalculatorForm>

            {/* Standardized Guide Card location */}
            <div style={{marginTop: '25px'}}>
                <Link href="/blog/retirement-guide" className="read-guide-card" style={{display: 'block', textDecoration: 'none'}}>
                    📖 Roadmap: How to build a multi-million dollar retirement fund
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox title="Retirement Summary" results={result} formatCurrency={formatCurrency} />
            ) : (
              <div className="result-box" style={{background: '#f8fafc', color: '#64748b', textAlign: 'center'}}>
                Enter your details to see your roadmap.
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        {/* Insight Card */}
        <div className="info-card" style={{marginTop: '40px', padding: '25px', background: '#fdf2f2', borderRadius: '12px', border: '1px solid #fee2e2'}}>
            <h3 style={{color: '#991b1b', marginBottom: '10px'}}>The 4% - 5% Safe Withdrawal Rule</h3>
            <p style={{fontSize: '0.9rem', color: '#991b1b', lineHeight: '1.6'}}>
                Financial experts suggest that if you withdraw <strong>4% to 5%</strong> of your total fund every year, your money should theoretically last for 30+ years. This allows your remaining balance to keep growing even while you are "spending" it during retirement.
            </p>
            
        </div>
      </div>
    </>
  );
}