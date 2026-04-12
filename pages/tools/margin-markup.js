import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

// Import global utilities
import { formatCurrency, globalCurrency } from "../../utils/formatters"; 

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function MarginMarkupCalculator() {
  // 1. STATE MANAGEMENT
  const [cost, setCost] = useState(100);
  const [sellingPrice, setSellingPrice] = useState(125);
  const [result, setResult] = useState(null);

  // 2. CALCULATION LOGIC
  const calculateMetrics = () => {
    const C = parseFloat(cost) || 0;
    const S = parseFloat(sellingPrice) || 0;

    if (C <= 0 || S <= 0 || S <= C) {
      setResult(null);
      return;
    }

    const profit = S - C;
    const margin = (profit / S) * 100;
    const markup = (profit / C) * 100;

    setResult({
      "Gross Profit": profit,
      "Profit Margin": `${margin.toFixed(2)}%`,
      "Markup Percentage": `${markup.toFixed(2)}%`,
      "Cost to Price Ratio": `${((C / S) * 100).toFixed(1)}%`
    });
  };

  useEffect(() => {
    calculateMetrics();
  }, [cost, sellingPrice]);

  const handleReset = () => {
    setCost("");
    setSellingPrice("");
    setResult(null);
  };

  return (
    <>
      <Head>
        <title>Margin vs Markup Calculator | Business Profit Tools | ToolFinance</title>
        <meta 
          name="description" 
          content="Calculate profit margin and markup percentages instantly. Understand the difference between margin and markup to price your products correctly." 
        />
      </Head>

      <div className="container">
        <div className="tool-intro" style={{textAlign: 'center', marginBottom: '30px'}}>
            <h1 style={{fontSize: '2.5rem', color: 'var(--primary)'}}>⚖️ Margin vs. Markup</h1>
            <p style={{color: '#666'}}>Compare your profit metrics to ensure your business pricing is sustainable.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()}>
              <CalculatorInput 
                label="Cost of Item (COGS)" 
                value={cost} 
                onChange={setCost} 
                icon={globalCurrency} 
              />
              
              <CalculatorInput 
                label="Selling Price" 
                value={sellingPrice} 
                onChange={setSellingPrice} 
                icon={globalCurrency} 
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
                formatCurrency={formatCurrency}
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
                If you buy an item for $100 and sell it for $125, your <strong>markup is 25%</strong> but your <strong>margin is only 20%</strong>. This distinction is critical because business expenses are usually calculated as a percentage of total revenue (margin).
            </p>
        </div>
      </div>
    </>
  );
}