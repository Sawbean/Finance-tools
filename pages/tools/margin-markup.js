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
      "Gross Profit": profit,
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
        <div className="tool-intro margin-markup-intro">
            <h1>⚖️ Margin vs. Markup</h1>
            <p>Compare your profit metrics to ensure your business pricing is sustainable.</p>
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
              
              <p className="helper-text">
                *Selling price must be higher than cost to calculate profit.
              </p>
            </CalculatorForm>

            <div className="guide-card-wrapper">
                <Link href="/blog/margin-markup-guide" className="read-guide-card">
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
              <div className="result-box-empty">
                Enter cost and selling price to see the comparison.
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        <div className="info-card margin-info-card">
            <h3>The Vital Difference</h3>
            <p>
                Understanding the formulas helps you avoid pricing errors:
            </p>

            <div className="formula-grid">
              <div className="formula-box">
                <span className="formula-title">Markup</span>
                <div className="formula-eq">
                    (Profit / <strong>Cost</strong>) × 100
                </div>
              </div>
              <div className="formula-box">
                <span className="formula-title">Margin</span>
                <div className="formula-eq">
                    (Profit / <strong>Revenue</strong>) × 100
                </div>
              </div>
            </div>

            <p>
              If you buy an item for {formatCurrency(100)} and sell it for {formatCurrency(125)}, 
              your <strong>markup is 25%</strong> but your <strong>margin is only 20%</strong>. 
            </p>
        </div>
      </div>
    </>
  );
}

