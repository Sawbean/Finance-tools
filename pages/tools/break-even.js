import { useState, useEffect } from "react";
import Link from "next/link";
import { tools } from '../../data/tools';
import ToolSEO from '../../components/layout/ToolSEO';
import { allToolGuides } from '../../data/tool-guides/index';
import Image from "next/image";

// Import global utilities
import { useCurrency } from "../../context/CurrencyContext"; 

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function BreakEvenCalculator() {
  const { currency } = useCurrency();
  // Automatically find the data for THIS tool
  const toolData = tools.find(t => t.link === '/tools/break-even');

  const guideData = Object.values(allToolGuides).find(g => g.tool === "break-even");
  const [error, setError] = useState("");

  // 1. STATE MANAGEMENT
  const [fixedCosts, setFixedCosts] = useState(50000);
  const [variableCost, setVariableCost] = useState(300);
  const [sellingPrice, setSellingPrice] = useState(800);
  const [result, setResult] = useState(null);
  // 2. CALCULATION LOGIC
  const calculateBreakEven = () => {
  setError("");
  const FC = parseFloat(fixedCosts) || 0;
  const VC = parseFloat(variableCost) || 0;
  const SP = parseFloat(sellingPrice) || 0;

  if (SP > 0 && SP <= VC) {
    setError("Selling price must be greater than variable cost to reach break-even.");
    setResult(null);
    return;
  }

  if (FC <= 0 || SP <= VC) {
    setResult(null);
    setError("");
    return;
  }

    const contributionMargin = SP - VC;
    const units = FC / contributionMargin;
    const breakEvenSales = units * SP;

    setResult({
      "Units to Break-Even": Math.ceil(units), // Sending as a number
      "Sales Volume Needed": Math.round(breakEvenSales), // Sending as a number
      "Contribution Margin": `${((contributionMargin / SP) * 100).toFixed(1)}% per unit`,
      "Profit per Unit": Math.round(contributionMargin) // Sending as a number
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
    setError("");
  };

  return (
    <>
      <ToolSEO tool={toolData} guideData={guideData} />

      <div className="container">
        <div className="tool-intro" >
            <h1>⚖️ Break-Even Analysis</h1>
            <p>Find out exactly how many units you need to sell to cover all your costs.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()} error={error}>
              <CalculatorInput 
                label="Total Fixed Costs (Rent, Salaries, etc.)" 
                value={fixedCosts} 
                onChange={setFixedCosts} 
                icon={currency.symbol} 
              />
              
              <div className="input-row">
                <CalculatorInput 
                    label="Variable Cost per Unit" 
                    value={variableCost} 
                    onChange={setVariableCost} 
                    icon={currency.symbol} 
                />
                <CalculatorInput 
                    label="Selling Price per Unit" 
                    value={sellingPrice} 
                    onChange={setSellingPrice} 
                    icon={currency.symbol} 
                />
              </div>
              
              <p className="helper">
                *Note: Selling price must be higher than the variable cost per unit.
              </p>
            </CalculatorForm>

            <div>
              <Link href="/blog/break-even-guide" className="read-guide-card">
                📖 Business Strategy: How to lower your break-even point?
              </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox
                title="Profitability Threshold"
                results={result}
              />
            ) : (
              <div className="result-box-empty">
                Enter your costs and pricing to see the break-even point.
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        <div className="info-card">
            <h3>The Break-Even Formula</h3>
            <p>
              To calculate the break-even point in units, we divide total fixed costs by the "Contribution Margin" (the profit made on each individual unit sold).
            </p>

            {/* Graph showing fixed costs, variable costs, and total revenue intersection */}
            <div className="info-image-container">
              <img src="/images/path-to-graph.webp" alt="Break-Even Analysis Graph showing revenue and cost intersection" loading="lazy" />
            </div>

            <div className="formula-box">
              <span>BEP (Units) = </span>
              <div className="fraction">
                <div className="numerator">Total Fixed Costs</div>
                <div>Price per Unit - Variable Cost per Unit</div>
              </div>
            </div>

            <p className="info-text">
                <strong>Fixed Costs:</strong> Expenses that stay the same regardless of sales (e.g., Rent at {currency.symbol}{Number(2000).toLocaleString(currency.locale)}/mo).<br />
                <strong>Variable Costs:</strong> Expenses that change based on volume (e.g., Materials at {currency.symbol}{Number(50).toLocaleString(currency.locale)} per unit).
            </p>
        </div>
      </div>
    </>
  );
}