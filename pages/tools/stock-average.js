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

export default function StockAverageCalculator() {
  const { currency } = useCurrency();
  const formatValue = (val) => new Intl.NumberFormat(currency.locale).format(val);
  // Automatically find the data for THIS tool
  const toolData = tools.find(t => t.link === '/tools/stock-average');
  const guideData = Object.values(allToolGuides).find(g => g.tool === "stock-average");
  // 1. STATE MANAGEMENT
  const [buy1Qty, setBuy1Qty] = useState(100);
  const [buy1Price, setBuy1Price] = useState(500);
  
  const [buy2Qty, setBuy2Qty] = useState(100);
  const [buy2Price, setBuy2Price] = useState(400);

  const [result, setResult] = useState(null);

  // 2. CALCULATION LOGIC
  const calculateAverage = () => {
    const q1 = parseFloat(buy1Qty) || 0;
    const p1 = parseFloat(buy1Price) || 0;
    const q2 = parseFloat(buy2Qty) || 0;
    const p2 = parseFloat(buy2Price) || 0;

    if (q1 <= 0 || p1 <= 0) {
      setResult(null);
      return;
    }

    const totalQty = q1 + q2;
    const totalCost = (q1 * p1) + (q2 * p2);
    const avgPrice = totalCost / totalQty;

    setResult({
      "Total Quantity": totalQty,
      "Total Investment": `${currency.symbol}${formatValue(totalCost)}`,
      "Average Price per Share": `${currency.symbol}${formatValue(avgPrice)}`,
      "Break-even Point": `${currency.symbol}${formatValue(avgPrice)}`
    });
  };

  useEffect(() => {
    calculateAverage();
  }, [buy1Qty, buy1Price, buy2Qty, buy2Price]);

  const handleReset = () => {
    setBuy1Qty("");
    setBuy1Price("");
    setBuy2Qty("");
    setBuy2Price("");
    setResult(null);
  };

  return (
    <>
      <ToolSEO tool={toolData} guideData={guideData} />


      <div className="container">
        <div className="tool-intro" style={{textAlign: 'center', marginBottom: '30px'}}>
            <h1 style={{fontSize: '2.5rem', color: 'var(--primary)'}}>📈 Stock Average Calculator</h1>
            <p style={{color: '#666'}}>Calculate your weighted average cost after multiple stock purchases.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()}>
              
              <div style={{marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px dashed #e2e8f0'}}>
                <h4 style={{marginBottom: '10px', color: '#475569'}}>First Purchase</h4>
                <div className="input-row">
                    <CalculatorInput label="Quantity" value={buy1Qty} onChange={setBuy1Qty} placeholder="Ex: 100" />
                    <CalculatorInput label="Purchase Price" value={buy1Price} onChange={setBuy1Price} icon={currency.symbol} />
                </div>
              </div>

              <div>
                <h4 style={{marginBottom: '10px', color: '#475569'}}>Second Purchase (Optional)</h4>
                <div className="input-row">
                    <CalculatorInput label="Quantity" value={buy2Qty} onChange={setBuy2Qty} placeholder="Ex: 50" />
                    <CalculatorInput label="Purchase Price" value={buy2Price} onChange={setBuy2Price} icon={currency.symbol} />
                </div>
              </div>
            </CalculatorForm>

            <div style={{marginTop: '25px'}}>
                <Link href="/blog/stock-average-guide" className="read-guide-card" style={{display: 'block', textDecoration: 'none'}}>
                    📖 Strategy: When to 'Average Down' a falling stock?
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox
                title="Investment Summary"
                results={result}
              />
            ) : (
              <div className="result-box" style={{background: '#f8fafc', color: '#64748b', textAlign: 'center'}}>
                Enter at least the first purchase details to calculate the average.
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        <div className="info-card" style={{marginTop: '40px', padding: '25px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0'}}>
            <h3 style={{color: 'var(--primary)', marginBottom: '10px'}}>What is Averaging Down?</h3>
            <p style={{fontSize: '0.95rem', color: '#475569', lineHeight: '1.6'}}>
                Averaging down is a stock market strategy that involves buying more shares of a stock after it has dropped in price. This reduces the <strong>weighted average cost</strong> of your total holdings.
            </p>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.1rem', color: 'var(--primary)', fontWeight: 'bold', margin: '20px 0' }}>
              <span>Avg Price = </span>
              <div style={{ textAlign: 'center' }}>
                <div style={{ borderBottom: '2px solid var(--primary)', padding: '0 10px' }}>(Q1 × P1) + (Q2 × P2)</div>
                <div>Total Quantity (Q1 + Q2)</div>
              </div>
            </div>

            <p style={{fontSize: '0.95rem', color: '#475569', lineHeight: '1.6', marginTop: '15px'}}>
                While this can help you reach a break-even point faster if the stock recovers, it also increases your total exposure and risk to that specific company. Always ensure your portfolio remains diversified.
            </p>
        </div>
      </div>
    </>
  );
}