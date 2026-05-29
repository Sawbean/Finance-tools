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
  const { currency } = useCurrency();
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
        <div className="tool-intro" style={{textAlign: 'center', marginBottom: '30px'}}>
            <h1 style={{fontSize: '2.5rem', color: 'var(--primary)'}}>💵 Tax Calculator</h1>
            <p style={{color: '#666'}}>Calculate VAT or GST additions and perform reverse tax extractions instantly.</p>
        </div>

        {/* TAX MODE TOGGLE */}
        <div style={{display: 'flex', justifyContent: 'center', gap: '0', marginBottom: '30px', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', maxWidth: '420px', margin: '0 auto 30px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'}}>
            <button 
                onClick={() => setTaxMode("exclusive")}
                style={{flex: 1, padding: '14px', border: 'none', cursor: 'pointer', background: taxMode === 'exclusive' ? 'var(--primary)' : '#fff', color: taxMode === 'exclusive' ? '#fff' : '#475569', fontWeight: 'bold', transition: 'all 0.2s'}}
            >
                Exclusive (+)
            </button>
            <button 
                onClick={() => setTaxMode("inclusive")}
                style={{flex: 1, padding: '14px', border: 'none', cursor: 'pointer', background: taxMode === 'inclusive' ? 'var(--primary)' : '#fff', color: taxMode === 'inclusive' ? '#fff' : '#475569', fontWeight: 'bold', transition: 'all 0.2s'}}
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

              <div style={{display: 'flex', gap: '8px', marginTop: '15px'}}>
                <button type="button" onClick={() => setTaxRate(13)} className="preset-btn-small">13% VAT</button>
                <button type="button" onClick={() => setTaxRate(18)} className="preset-btn-small">18% GST</button>
                <button type="button" onClick={() => setTaxRate(5)} className="preset-btn-small">5% Tax</button>
              </div>
            </CalculatorForm>

            <div style={{marginTop: '25px'}}>
                <Link href="/blog/gst-vat-tax-guide" className="read-guide-card" style={{display: 'block', textDecoration: 'none'}}>
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
              <div className="result-box" style={{background: '#f8fafc', color: '#64748b', textAlign: 'center'}}>
                Enter amount to see the tax breakdown.
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        <div className="info-card" style={{marginTop: '40px', padding: '25px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0'}}>
            <h3 style={{color: 'var(--primary)', marginBottom: '10px'}}>The Reverse Tax Formula</h3>
            <p style={{fontSize: '0.95rem', color: '#475569', lineHeight: '1.6', marginBottom: '15px'}}>
                When a price is <strong>Tax Inclusive</strong>, you cannot simply subtract the tax percentage from the total. You must use the reverse calculation formula to find the true base price:
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 'bold', margin: '20px 0' }}>
              <span>Base Price = </span>
              <div style={{ textAlign: 'center' }}>
                <div style={{ borderBottom: '2px solid var(--primary)', padding: '0 10px' }}>Total Amount</div>
                <div>1 + (Tax Rate / 100)</div>
              </div>
            </div>

            <p style={{fontSize: '0.95rem', color: '#475569', lineHeight: '1.6', marginTop: '15px'}}>
                For your {formatCurrency(amount)}, the {taxMode} calculation ensures the 
                {taxRate}% share is accurately separated. 
                <br /><br />
                At a {taxRate}% rate, every {currency.symbol}100 of base price equals 
                {currency.symbol}{taxRate} in tax, making the total 
                {currency.symbol}{100 + parseFloat(taxRate)}.
            </p>
        </div>
      </div>

      <style jsx>{`
        .preset-btn-small {
            flex: 1;
            padding: 10px;
            font-size: 0.8rem;
            background: #fff;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            cursor: pointer;
            color: #475569;
            transition: all 0.2s;
        }
        .preset-btn-small:hover {
            border-color: var(--primary);
            color: var(--primary);
            background: #f0fdf4;
        }
      `}</style>
    </>
  );
}