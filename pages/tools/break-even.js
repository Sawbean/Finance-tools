import { useState, useEffect } from "react";
import Link from "next/link";
import { tools } from '../../data/tools';
import ToolSEO from '../../components/layout/ToolSEO';
import { allToolGuides } from '../../data/tool-guides/index';

// Import global utilities
import { formatCurrency, globalCurrency } from "../../utils/formatters"; 

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function BreakEvenCalculator() {
  // Automatically find the data for THIS tool
  const toolData = tools.find(t => t.link === '/tools/break-even');

  const guideData = Object.values(allToolGuides).find(g => g.tool === "break-even");

  // 1. STATE MANAGEMENT
  const [fixedCosts, setFixedCosts] = useState(50000);
  const [variableCost, setVariableCost] = useState(300);
  const [sellingPrice, setSellingPrice] = useState(800);
  const [result, setResult] = useState(null);

  // 2. CALCULATION LOGIC
  const calculateBreakEven = () => {
    const FC = parseFloat(fixedCosts) || 0;
    const VC = parseFloat(variableCost) || 0;
    const SP = parseFloat(sellingPrice) || 0;

    if (FC <= 0 || SP <= VC) {
      setResult(null);
      return;
    }

    const contributionMargin = SP - VC;
    const units = FC / contributionMargin;
    const breakEvenSales = units * SP;

    setResult({
      "Break-Even Units": Math.ceil(units),
      "Break-Even Sales Value": breakEvenSales,
      "Unit Contribution Margin": contributionMargin,
      "Margin of Safety (%)": "Enter target sales to calculate"
    });
  };

  useEffect(() => {
    calculateBreakEven();
  }, [fixedCosts, variableCost, sellingPrice]);

  const handleReset = () => {
    setFixedCosts("");
    setVariableCost("");
    setSellingPrice("");
    setResult(null);
  };

  return (
    <>
      <ToolSEO tool={toolData} guideData={guideData} />

      <div className="container">
        <div className="tool-intro" style={{textAlign: 'center', marginBottom: '30px'}}>
            <h1 style={{fontSize: '2.5rem', color: 'var(--primary)'}}>⚖️ Break-Even Analysis</h1>
            <p style={{color: '#666'}}>Find out exactly how many units you need to sell to cover all your costs.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()}>
              <CalculatorInput 
                label="Total Fixed Costs (Rent, Salaries, etc.)" 
                value={fixedCosts} 
                onChange={setFixedCosts} 
                icon={globalCurrency} 
              />
              
              <div className="input-row">
                <CalculatorInput 
                    label="Variable Cost per Unit" 
                    value={variableCost} 
                    onChange={setVariableCost} 
                    icon={globalCurrency} 
                />
                <CalculatorInput 
                    label="Selling Price per Unit" 
                    value={sellingPrice} 
                    onChange={setSellingPrice} 
                    icon={globalCurrency} 
                />
              </div>
              
              <p style={{fontSize: '0.8rem', color: '#64748b', marginTop: '10px', fontStyle: 'italic'}}>
                *Note: Selling price must be higher than the variable cost per unit.
              </p>
            </CalculatorForm>

            <div style={{marginTop: '25px'}}>
                <Link href="/blog/break-even-guide" className="read-guide-card" style={{display: 'block', textDecoration: 'none'}}>
                    📖 Business Strategy: How to lower your break-even point?
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox
                title="Profitability Threshold"
                results={result}
                formatCurrency={formatCurrency}
              />
            ) : (
              <div className="result-box" style={{background: '#f8fafc', color: '#64748b', textAlign: 'center'}}>
                Enter your costs and pricing to see the break-even point.
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        <div className="info-card" style={{marginTop: '40px', padding: '25px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0'}}>
            <h3 style={{color: 'var(--primary)', marginBottom: '10px'}}>The Break-Even Formula</h3>
            <p style={{fontSize: '0.95rem', color: '#475569', lineHeight: '1.6', marginBottom: '15px'}}>
                To calculate the break-even point in units, we divide total fixed costs by the "Contribution Margin" (the profit made on each individual unit sold).
            </p>

            

[Image of break-even point graph showing fixed costs variable costs and total revenue]


            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 'bold', margin: '20px 0' }}>
              <span>BEP (Units) = </span>
              <div style={{ textAlign: 'center' }}>
                <div style={{ borderBottom: '2px solid var(--primary)', padding: '0 10px' }}>Total Fixed Costs</div>
                <div>Price per Unit - Variable Cost per Unit</div>
              </div>
            </div>

            <p style={{fontSize: '0.95rem', color: '#475569', lineHeight: '1.6', marginTop: '15px'}}>
                <strong>Fixed Costs:</strong> Expenses that stay the same regardless of sales (e.g., rent).<br />
                <strong>Variable Costs:</strong> Expenses that change based on production volume (e.g., raw materials).
            </p>
        </div>
      </div>
    </>
  );
}