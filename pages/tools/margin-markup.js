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

export default function MarginMarkupCalculator() {
  const { currency } = useCurrency();
  // Automatically find the data for THIS tool
  const toolData = tools.find(t => t.link === '/tools/margin-markup');
  const guideData = Object.values(allToolGuides).find(g => g.tool === "margin-markup");
  // 1. STATE MANAGEMENT
  const [cost, setCost] = useState(100);
  const [sellingPrice, setSellingPrice] = useState(125);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // 2. CALCULATION LOGIC
  const calculateMetrics = () => {
    const C = parseFloat(cost) || 0;
    const S = parseFloat(sellingPrice) || 0;

    if (C <= 0 || S <= 0) {
      setResult(null);
      setError("Cost and Selling Price must be greater than zero.");
      return;
    }
    if (S <= C) {
      setResult(null);
      setError("Selling price must be higher than cost to calculate profit.");
      return;
    }
    setError("");

    const profit = S - C;
    const margin = (profit / S) * 100;
    const markup = (profit / C) * 100;

   setResult({
      "Gross Profit": profit, // Raw number
      "Profit Margin": `${((profit / S) * 100).toFixed(2)}%`,
      "Markup Percentage": `${((profit / C) * 100).toFixed(2)}%`,
      "Cost-to-Price Ratio": `${((C / S) * 100).toFixed(1)}%`
    });
  };

  useEffect(() => {
    calculateMetrics();
  }, [cost, sellingPrice]);

  const handleReset = () => {
    setCost("");
    setSellingPrice("");
    setResult(null);
    setError("");
  };

  return (
    <>
      <ToolSEO tool={toolData} guideData={guideData} />
      

      <div className="container">
        <div className="tool-intro" style={{textAlign: 'center', marginBottom: '30px'}}>
            <h1 style={{fontSize: '2.5rem', color: 'var(--primary)'}}>⚖️ Margin vs. Markup</h1>
            <p style={{color: '#666'}}>Compare your profit metrics to ensure your business pricing is sustainable.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()} error={error}>
              <CalculatorInput 
                label="Cost of Item (COGS)" 
                value={cost} 
                onChange={setCost} 
                icon={currency.symbol} 
              />
              
              <CalculatorInput 
                label="Selling Price" 
                value={sellingPrice} 
                onChange={setSellingPrice} 
                icon={currency.symbol} 
              />
              
              <p style={{fontSize: '0.8rem', color: '#64748b', marginTop: '10px', fontStyle: 'italic'}}>
                *Selling price must be higher than cost to calculate profit.
              </p>
            </CalculatorForm>

            <div style={{marginTop: '25px'}}>
                <Link href="/blog/margin-markup-guide" className="read-guide-card" style={{display: 'block', textDecoration: 'none'}}>
                    📖 Business 101: Why a 25% Markup is NOT a 25% Margin
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox
                title="Profit Analysis"
                results={result}
              />
            ) : (
              <div className="result-box" style={{background: '#f8fafc', color: '#64748b', textAlign: 'center'}}>
                Enter cost and selling price to see the comparison.
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        <div className="info-card" style={{marginTop: '40px', padding: '25px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0'}}>
            <h3 style={{color: '#166534', marginBottom: '10px'}}>The Vital Difference</h3>
            <p style={{fontSize: '0.95rem', color: '#166534', lineHeight: '1.6', marginBottom: '15px'}}>
                Understanding the formulas helps you avoid pricing errors:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', textAlign: 'center', margin: '20px 0' }}>
              <div style={{ background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <span style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>Markup</span>
                <div style={{ fontSize: '1rem', color: 'var(--primary)' }}>
                    (Profit / <strong>Cost</strong>) × 100
                </div>
              </div>
              <div style={{ background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <span style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>Margin</span>
                <div style={{ fontSize: '1rem', color: 'var(--primary)' }}>
                    (Profit / <strong>Revenue</strong>) × 100
                </div>
              </div>
            </div>

            <p style={{fontSize: '0.95rem', color: '#166534', lineHeight: '1.6'}}>
              If you buy an item for {formatCurrency(100)} and sell it for {formatCurrency(125)}, 
              your <strong>markup is 25%</strong> but your <strong>margin is only 20%</strong>. 
            </p>
        </div>
      </div>
    </>
  );
}