import { useState, useEffect } from "react";
import Link from "next/link";

// Import global utilities
import { formatCurrency, globalCurrency } from "../../utils/formatters"; 
import { allToolGuides } from '../../data/tool-guides/index';
import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";
import { tools } from '../../data/tools';
import ToolSEO from '../../components/layout/ToolSEO';

export default function IncomeTaxCalculator() {
  // Automatically find the data for THIS tool
  const toolData = tools.find(t => t.link === '/tools/income-tax');
  const guideData = Object.values(allToolGuides).find(g => g.tool === "income-tax");
  const [income, setIncome] = useState(800000);
  const [deductions, setDeductions] = useState(0);
  const [filingStatus, setFilingStatus] = useState("single");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [result, setResult] = useState(null);

  const calculateTax = () => {
    const grossIncome = parseFloat(income) || 0;
    const totalDeductions = parseFloat(deductions) || 0;
    const taxableIncome = Math.max(0, grossIncome - totalDeductions);

    if (grossIncome <= 0) return;

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
      "Total Annual Tax": tax,
      "Effective Tax Rate": `${((tax / grossIncome) * 100).toFixed(2)}%`,
      "Monthly Take-Home": (grossIncome - tax) / 12,
      "Annual Net Income": grossIncome - tax,
    });
  };

  useEffect(() => {
    calculateTax();
  }, [income, deductions, filingStatus]);

  const handleReset = () => {
    setIncome(""); 
    setDeductions(0); 
    setFilingStatus("single");
    setResult(null);
  };

  return (
    <>
      <ToolSEO tool={toolData} guideData={guideData} />

      <div className="container">
        <div className="tool-intro" style={{textAlign: 'center', marginBottom: '30px'}}>
            <h1 style={{fontSize: '2.5rem', color: 'var(--primary)'}}>💼 Income Tax Calculator</h1>
            <p style={{color: '#666'}}>Understand your tax burden and net salary with the latest tax slabs.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()}>
              
              <CalculatorInput label="Total Annual Income" value={income} onChange={setIncome} icon={globalCurrency} />

              <div style={{marginBottom: '20px'}}>
                <label className="input-label">Filing Status</label>
                <div style={{display: 'flex', gap: '10px', marginTop: '5px'}}>
                  <button 
                    type="button" 
                    onClick={() => setFilingStatus("single")}
                    style={{
                        flex: 1, padding: '12px', borderRadius: '10px', cursor: 'pointer', 
                        border: filingStatus === 'single' ? '2px solid var(--primary)' : '1px solid #d1d5db', 
                        background: filingStatus === 'single' ? '#eff6ff' : '#fff', 
                        color: filingStatus === 'single' ? 'var(--primary)' : '#64748b',
                        fontWeight: 'bold', transition: '0.3s'
                    }}
                  >Single</button>
                  <button 
                    type="button" 
                    onClick={() => setFilingStatus("married")}
                    style={{
                        flex: 1, padding: '12px', borderRadius: '10px', cursor: 'pointer', 
                        border: filingStatus === 'married' ? '2px solid var(--primary)' : '1px solid #d1d5db', 
                        background: filingStatus === 'married' ? '#eff6ff' : '#fff', 
                        color: filingStatus === 'married' ? 'var(--primary)' : '#64748b',
                        fontWeight: 'bold', transition: '0.3s'
                    }}
                  >Married</button>
                </div>
              </div>

              <button 
                type="button" 
                onClick={() => setShowAdvanced(!showAdvanced)}
                style={{
                  marginTop: '10px', width: '100%', padding: '10px', 
                  background: 'transparent', border: '1px dashed #cbd5e1', 
                  borderRadius: '8px', cursor: 'pointer', color: '#475569', fontSize: '0.85rem'
                }}
              >
                {showAdvanced ? "▲ Hide Deductions" : "▼ Add Tax Deductions (CIT, PF, Insurance)"}
              </button>

              {showAdvanced && (
                <div style={{marginTop: '15px', padding: '15px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0'}}>
                  <CalculatorInput label="Total Deductions" value={deductions} onChange={setDeductions} icon={globalCurrency} />
                  <p style={{fontSize: '0.75rem', color: '#64748b', marginTop: '8px'}}>
                    *Deductions like CIT, PF, or Insurance premiums reduce your taxable income.
                  </p>
                </div>
              )}
            </CalculatorForm>

            <div style={{marginTop: '25px'}}>
                <Link href="/blog/income-tax-guide" className="read-guide-card" style={{display: 'block', textDecoration: 'none'}}>
                    📖 Tax Guide: How to Legally Reduce Your Income Tax
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox title="Tax Summary" results={result} formatCurrency={formatCurrency} />
            ) : (
              <div className="result-box" style={{background: '#f8fafc', color: '#64748b', textAlign: 'center'}}>
                Enter income details to see breakdown.
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        <div className="info-card" style={{marginTop: '40px', padding: '25px', background: '#f0f9ff', borderRadius: '12px', border: '1px solid #bae6fd'}}>
            <h3 style={{color: '#0369a1', marginBottom: '15px'}}>💡 Understanding Progressive Taxation</h3>
            <p style={{fontSize: '0.95rem', lineHeight: '1.6', color: '#0369a1'}}>
                In a progressive tax system, your income is divided into "slabs." You only pay the higher tax rate on the portion of your income that falls into that specific slab.
            </p>
            
        </div>
      </div>
    </>
  );
}