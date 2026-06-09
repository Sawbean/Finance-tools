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

export default function IncomeTaxCalculator() {
  const { currency } = useCurrency();

  // Automatically find the data for THIS tool
  const toolData = tools.find(t => t.link === '/tools/income-tax');
  const guideData = Object.values(allToolGuides).find(g => g.tool === "income-tax");
  
  const [income, setIncome] = useState(800000);
  const [deductions, setDeductions] = useState(0);
  const [filingStatus, setFilingStatus] = useState("single");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const calculateTax = () => {
    const grossIncome = parseFloat(income) || 0;
    const totalDeductions = parseFloat(deductions) || 0;
    const taxableIncome = Math.max(0, grossIncome - totalDeductions);

    if (grossIncome <= 0) {
      setResult(null);
      setError(income ? "Income must be greater than zero." : "");
      return;
    }
    setError("");
    let tax = 0;
    const threshold = filingStatus === "single" ? 500000 : 600000;

    if (taxableIncome <= threshold) {
      tax = taxableIncome * 0.01; 
    } else if (taxableIncome <= threshold + 200000) {
      tax = (threshold * 0.01) + (taxableIncome - threshold) * 0.10;
    } else if (taxableIncome <= threshold + 500000) {
      tax = (threshold * 0.01) + (200000 * 0.10) + (taxableIncome - (threshold + 200000)) * 0.20;
    } else if (taxableIncome <= threshold + 1500000) {
      tax = (threshold * 0.01) + (200000 * 0.10) + (300000 * 0.20) + (taxableIncome - (threshold + 500000)) * 0.30;
    } else {
      tax = (threshold * 0.01) + (200000 * 0.10) + (300000 * 0.20) + (1000000 * 0.30) + (taxableIncome - (threshold + 1500000)) * 0.36;
    }

    setResult({
      "Annual Taxable Income": taxableIncome,
      "Total Annual Tax": Math.round(tax),
      "Highest Tax Bracket": taxableIncome > (threshold + 1500000) ? '36%' : taxableIncome > (threshold + 500000) ? '30%' : '10-20%',
      "Effective Tax Rate": `${((tax / grossIncome) * 100).toFixed(2)}%`,
      "Monthly Take-Home": Math.round((grossIncome - tax) / 12),
    });
  };

  useEffect(() => {
    calculateTax();
  }, [income, deductions, filingStatus]);

  const handleReset = () => {
    setIncome(""); 
    setDeductions(""); 
    setFilingStatus("single");
    setResult(null);
    setError("");
  };

  return (
    <>
      <ToolSEO tool={toolData} guideData={guideData} />

      <div className="container">
        <div className="tool-intro">
            <h1>💼 Income Tax Calculator</h1>
            <p>Understand your tax burden and net salary with the latest tax slabs.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()} error={error}>
              
              <CalculatorInput label="Total Annual Income" value={income} onChange={setIncome} icon={currency.symbol} />

              <div className="status-selector">
                <label className="input-label">Filing Status</label>
                <div className="status-buttons">
                  <button 
                    type="button" 
                    className={`status-btn ${filingStatus === 'single' ? 'active' : ''}`}
                    onClick={() => setFilingStatus("single")}
                  >Single</button>
                  <button 
                    type="button" 
                    className={`status-btn ${filingStatus === 'married' ? 'active' : ''}`}
                    onClick={() => setFilingStatus("married")}
                  >Married</button>
                </div>
              </div>

              <button 
                type="button" 
                className="advanced-toggle-btn"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? "▲ Hide Deductions" : "▼ Add Tax Deductions (CIT, PF, Insurance)"}
              </button>

              {showAdvanced && (
                <div className="advanced-fields-box">
                  <CalculatorInput label="Total Deductions" value={deductions} onChange={setDeductions} icon={currency.symbol} />
                  <p className="helper-text">
                    *Deductions like CIT, PF, or Insurance premiums reduce your taxable income.
                  </p>
                </div>
              )}
            </CalculatorForm>

            <div className="guide-card-wrapper">
                <Link href="/blog/income-tax-guide" className="read-guide-card">
                    📖 Tax Guide: How to Legally Reduce Your Income Tax
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox title="Tax Summary" results={result} />
            ) : (
              <div className="result-box-empty">
                Enter income details to see breakdown.
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        <div className="info-card tax-info-card">
            <h3>💡 Understanding Progressive Taxation</h3>
            <p>
             In a progressive tax system, your income is divided into "slabs." For your income of <strong>{formatCurrency(income)}</strong>, the first <strong>{formatCurrency(filingStatus === 'single' ? 500000 : 600000)}</strong> is only taxed at 1% as a social security contribution. You only pay the 30% or 36% rates on the amounts <em>above</em> those high-income thresholds.
            </p>
        </div>
        
      </div>
    </>
  );
}