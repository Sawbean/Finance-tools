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

export default function StockAverageCalculator() {
  const { currency } = useCurrency();
  // Automatically find the data for THIS tool
  const toolData = tools.find(t => t.link === '/tools/stock-average');
  const guideData = Object.values(allToolGuides).find(g => g.tool === "stock-average");
  
  // 1. STATE MANAGEMENT
  const [buy1Qty, setBuy1Qty] = useState(100);
  const [buy1Price, setBuy1Price] = useState(500);
  
  const [buy2Qty, setBuy2Qty] = useState(100);
  const [buy2Price, setBuy2Price] = useState(400);

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // 2. CALCULATION LOGIC
  const calculateAverage = () => {
    const q1 = parseFloat(buy1Qty) || 0;
    const p1 = parseFloat(buy1Price) || 0;
    const q2 = parseFloat(buy2Qty) || 0;
    const p2 = parseFloat(buy2Price) || 0;

    if (q1 <= 0 || p1 <= 0) {
      setResult(null);
      setError("Please enter valid positive values for the first purchase.");
      return;
    }
    setError("");

    const totalQty = q1 + q2;
    const totalCost = (q1 * p1) + (q2 * p2);
    const avgPrice = totalQty > 0 ? (totalCost / totalQty) : 0;

    setResult({
      "Total Quantity": totalQty,
      "Total Investment": totalCost,
      "Average Price per Share": avgPrice,
      "Break-even Point": avgPrice
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
    setError("");
  };

  return (
    <>
      <ToolSEO tool={toolData} guideData={guideData} />

      <div className="container">
        <div className="tool-intro stock-intro">
            <h1>📈 Stock Average Calculator</h1>
            <p>Calculate your weighted average cost after multiple stock purchases.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()} error={error}>
              
              <div className="purchase-section">
                <h4>First Purchase</h4>
                <div className="input-row">
                    <CalculatorInput label="Quantity" value={buy1Qty} onChange={setBuy1Qty} placeholder="Ex: 100" />
                    <CalculatorInput label="Purchase Price" value={buy1Price} onChange={setBuy1Price} icon={currency.symbol} />
                </div>
              </div>

              <div className="purchase-section">
                <h4>Second Purchase (Optional)</h4>
                <div className="input-row">
                    <CalculatorInput label="Quantity" value={buy2Qty} onChange={setBuy2Qty} placeholder="Ex: 50" />
                    <CalculatorInput label="Purchase Price" value={buy2Price} onChange={setBuy2Price} icon={currency.symbol} />
                </div>
              </div>
            </CalculatorForm>

            <div className="guide-card-wrapper">
                <Link href="/blog/stock-average-guide" className="read-guide-card">
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
              <div className="result-box-empty">
                Enter at least the first purchase details to calculate the average.
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        <div className="info-card stock-info-card">
            <h3>What is Averaging Down?</h3>
            <p>
                Averaging down is a stock market strategy that involves buying more shares of a stock after it has dropped in price. This reduces the <strong>weighted average cost</strong> of your total holdings.
            </p>
            
            <div className="stock-formula-box">
              <span>Avg Price = </span>
              <div className="fraction">
                <div className="numerator">(Q1 × P1) + (Q2 × P2)</div>
                <div className="denominator">Total Quantity (Q1 + Q2)</div>
              </div>
            </div>

            

            <p className="stock-info-text">
                While this can help you reach a break-even point faster if the stock recovers, it also increases your total exposure and risk to that specific company. Always ensure your portfolio remains diversified.
            </p>
        </div>
      </div>
    </>
  );
}