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

export default function InflationCalculator() {
  const { currency } = useCurrency();
  const formatValue = (val) => new Intl.NumberFormat(currency.locale).format(val);

  // Automatically find the data for THIS tool
  const toolData = tools.find(t => t.link === '/tools/inflation');
  const guideData = Object.values(allToolGuides).find(g => g.tool === "inflation");

  // 1. STATE MANAGEMENT
  const [amount, setAmount] = useState(100000);
  const [inflation, setInflation] = useState(7); 
  const [years, setYears] = useState(10);
  const [result, setResult] = useState(null);

  // 2. CALCULATION LOGIC
  const calculateInflation = () => {
    const A = parseFloat(amount) || 0;
    const I = parseFloat(inflation) || 0;
    const Y = parseFloat(years) || 0;

    if (A <= 0 || I <= 0 || Y <= 0) {
      setResult(null);
      return;
    }

    // Future cost of current basket of goods
    const futureCost = A * Math.pow(1 + I / 100, Y);
    
    // Future value of today's currency (Purchasing Power)
    const purchasingPower = A / Math.pow(1 + I / 100, Y);

    setResult({
      "Future Cost of Same Items": `${currency.symbol}${formatValue(Math.round(futureCost))}`,
      "Future Purchasing Power": `${currency.symbol}${formatValue(Math.round(purchasingPower))}`,
      "Value Lost to Inflation": `${currency.symbol}${formatValue(Math.round(A - purchasingPower))}`,
      "Total Price Surge": `${((futureCost / A - 1) * 100).toFixed(1)}%`
    });
  };

  useEffect(() => {
    calculateInflation();
  }, [amount, inflation, years]);

  const handleReset = () => {
    setAmount("");
    setInflation(7);
    setYears(10);
    setResult(null);
  };

  return (
    <>
      <ToolSEO tool={toolData} guideData={guideData} />

      <div className="container">
        <div className="tool-intro" style={{textAlign: 'center', marginBottom: '30px'}}>
            <h1 style={{fontSize: '2.5rem', color: 'var(--primary)'}}>💸 Inflation Impact</h1>
            <p style={{color: '#666'}}>Understand how the "Silent Tax" of inflation reduces the value of your money over time.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()}>
              <CalculatorInput
                label="Current Expense / Savings"
                value={amount}
                onChange={setAmount}
                icon={currency.symbol}
              />

              <div className="input-row">
                <CalculatorInput label="Avg. Inflation Rate" value={inflation} onChange={setInflation} suffix="%" />
                <CalculatorInput label="Time Period" value={years} onChange={setYears} suffix="Years" />
              </div>
            </CalculatorForm>

            <div style={{marginTop: '25px'}}>
                <Link href="/blog/inflation-guide" className="read-guide-card" style={{display: 'block', textDecoration: 'none'}}>
                    📖 Strategy: How to beat inflation with SIPs and Equity
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <>
                <ResultBox title="Impact Analysis" results={result} />
                <div style={{
                    marginTop: '20px', padding: '20px', background: '#fff7ed', 
                    borderRadius: '12px', border: '1px solid #fed7aa', textAlign: 'center'
                }}>
                    <h4 style={{color: '#9a3412'}}>💡 Reality Check</h4>
                    <p style={{fontSize: '0.85rem', color: '#475569', marginTop: '5px', lineHeight: '1.4'}}>
                        To maintain your current standard of living in {years} years, you will need 
                        <strong> {formatCurrency(result["Future Cost of Same Items"])}</strong> for every {formatCurrency(amount)} spent today. 
                    </p>
                </div>
              </>
            ) : (
              <div className="result-box" style={{background: '#f8fafc', color: '#64748b', textAlign: 'center'}}>
                Enter values to see the impact on your money.
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        {result && (
            <div className="info-card" style={{marginTop: '40px', padding: '25px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0'}}>
                <h3 style={{color: 'var(--primary)', marginBottom: '10px'}}>What is Purchasing Power?</h3>
                <p style={{fontSize: '0.85rem', color: '#475569', marginTop: '5px', lineHeight: '1.4'}}>
                    To maintain your current standard of living in {years} years, you will need 
                    <strong> {result["Future Cost of Same Items"]}</strong> for every 
                    <strong> {currency.symbol}{formatValue(amount)}</strong> spent today. 
                </p>
            </div>
          )}
      </div>
    </>
  );
}