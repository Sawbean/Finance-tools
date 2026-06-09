import { useState, useEffect } from "react";
import Link from "next/link";

// Import global utilities
import { useCurrency } from "../../context/CurrencyContext";
import { formatCurrency, globalCurrency } from "../../utils/formatters";  
import { allToolGuides } from '../../data/tool-guides/index';
import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";
import { tools } from '../../data/tools';
import ToolSEO from '../../components/layout/ToolSEO';

export default function GSTVATTaxCalculator() {
  const context = useCurrency();
  const currency = context?.currency || { locale: 'en-US', symbol: '$' };
  const formatValue = (val) => new Intl.NumberFormat(currency.locale).format(val);
  
  // Automatically find the data for THIS tool
  const toolData = tools.find(t => t.link === '/tools/gst-vat-tax');
  const guideData = Object.values(allToolGuides).find(g => g.tool === "gst-vat-tax");

  // 1. STATE MANAGEMENT
  const [amount, setAmount] = useState(1000);
  const [taxRate, setTaxRate] = useState(13); 
  const [taxMode, setTaxMode] = useState("exclusive"); // 'exclusive' or 'inclusive'
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // 2. CALCULATION LOGIC
  const calculateTax = () => {
    setError("");
    const A = parseFloat(amount) || 0;
    const R = parseFloat(taxRate) || 0;

    if (A <= 0 || R < 0) {
      setResult(null);
      if (amount || taxRate) setError("Please enter valid figures.");
      return;
    }

    let netAmount, taxAmount, totalAmount;

    if (taxMode === "exclusive") {
      // Add tax to the amount
      taxAmount = (A * R) / 100;
      netAmount = A;
      totalAmount = A + taxAmount;
    } else {
      // Amount already includes tax (Reverse Calculation)
      netAmount = A / (1 + R / 100);
      taxAmount = A - netAmount;
      totalAmount = A;
    }

    setResult({
      "Net Amount (Pre-Tax)": netAmount,
      [`Tax Amount (${R}%)`]: taxAmount,
      "Total Gross Amount": totalAmount,
    });
  };

  useEffect(() => {
    calculateTax();
  }, [amount, taxRate, taxMode]);

  const handleReset = () => {
    setError("");
    setAmount("");
    setTaxRate(13);
    setTaxMode("exclusive");
    setResult(null);
  };

  return (
    <>
      <ToolSEO tool={toolData} guideData={guideData} />

      <div className="container">
        <div className="tool-intro">
            <h1>💵 Tax Calculator</h1>
            <p>Calculate VAT or GST additions and perform reverse tax extractions instantly.</p>
        </div>

        {/* TAX MODE TOGGLE */}
        <div className="tax-mode-toggle">
            <button 
                type="button"
                className={`mode-btn ${taxMode === 'exclusive' ? 'active' : ''}`}
                onClick={() => setTaxMode("exclusive")}
            >
                Exclusive (+)
            </button>
            <button 
                type="button"
                className={`mode-btn ${taxMode === 'inclusive' ? 'active' : ''}`}
                onClick={() => setTaxMode("inclusive")}
            >
                Inclusive (-)
            </button>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()} error={error}>
              <CalculatorInput 
                label={taxMode === "exclusive" ? "Net Price (Pre-Tax)" : "Gross Price (With Tax)"} 
                value={amount} 
                onChange={setAmount} 
                icon={currency.symbol} 
              />
              
              <CalculatorInput label="Tax Rate (%)" value={taxRate} onChange={setTaxRate} suffix="%" />

              <div className="preset-btn-row">
                <button type="button" onClick={() => setTaxRate(13)} className="preset-btn-small">13% VAT</button>
                <button type="button" onClick={() => setTaxRate(18)} className="preset-btn-small">18% GST</button>
                <button type="button" onClick={() => setTaxRate(5)} className="preset-btn-small">5% Tax</button>
              </div>
            </CalculatorForm>

            <div className="guide-card-wrapper">
                <Link href="/blog/gst-vat-tax-guide" className="read-guide-card">
                    📖 Explainer: Inclusive vs. Exclusive Tax — What's the difference?
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox
                title={`${taxMode === 'exclusive' ? 'Tax Addition' : 'Tax Extraction'} Summary`}
                results={result}
              />
            ) : (
              <div className="result-box-empty">
                Enter amount to see the tax breakdown.
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        <div className="info-card tax-info-card">
            <h3>The Reverse Tax Formula</h3>
            <p className="info-text">
                When a price is <strong>Tax Inclusive</strong>, you cannot simply subtract the tax percentage from the total. You must use the reverse calculation formula to find the true base price:
            </p>

            <div className="formula-display">
              <span>Base Price = </span>
              <div className="formula-fraction">
                <div className="numerator">Total Amount</div>
                <div className="denominator">1 + (Tax Rate / 100)</div>
              </div>
            </div>

            <p className="info-text">
                For your {formatCurrency(amount, currency)}, the {taxMode} calculation ensures the 
                {taxRate}% share is accurately separated. 
                <br /><br />
                At a {taxRate}% rate, every {currency.symbol}100 of base price equals 
                {currency.symbol}{taxRate} in tax, making the total 
                {currency.symbol}{100 + parseFloat(taxRate)}.
            </p>
        </div>
      </div>
    </>
  );
}