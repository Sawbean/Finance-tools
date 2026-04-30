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

export default function EMICalculator() {
  // Automatically find the data for THIS tool
  const toolData = tools.find(t => t.link === '/tools/emi');
  const guideData = Object.values(allToolGuides).find(g => g.tool === "emi");
  // 1. STATE MANAGEMENT
  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(10.5);
  const [duration, setDuration] = useState(5);
  const [durationType, setDurationType] = useState("years");
  const [result, setResult] = useState(null);
  const [schedule, setSchedule] = useState([]);

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [extraPayment, setExtraPayment] = useState("");
  const [processingFee, setProcessingFee] = useState("");

  // 2. CALCULATION LOGIC
  const calculateEMI = () => {
    const P = parseFloat(principal) || 0;
    const R = parseFloat(rate) || 0;
    const D = parseFloat(duration) || 0;
    const feeP = parseFloat(processingFee) || 0;
    const extra = parseFloat(extraPayment) || 0;

    if (P <= 0 || R <= 0 || D <= 0) return;

    const n = durationType === "years" ? D * 12 : D;
    const r = R / (12 * 100);
    
    const baseEMI = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const monthlyEMI = baseEMI + extra;

    let remainingBalance = P;
    let totalInterest = 0;
    let tempSchedule = [];
    let month = 1;

    while (remainingBalance > 0 && month <= n + 120) {
      const interestForMonth = remainingBalance * r;
      const principalForMonth = Math.min(monthlyEMI - interestForMonth, remainingBalance);
      
      remainingBalance -= principalForMonth;
      totalInterest += interestForMonth;

      if (month % 12 === 0 || remainingBalance <= 0) {
        tempSchedule.push({
          period: month % 12 === 0 ? `Year ${month / 12}` : "Final",
          balance: Math.max(0, remainingBalance),
          interestPaid: totalInterest
        });
      }
      month++;
      if (remainingBalance <= 0) break;
    }

    const totalProcessingFee = P * (feeP / 100);
    const totalPayable = P + totalInterest + totalProcessingFee;

    setResult({
      "Monthly EMI": monthlyEMI,
      "Total Interest": totalInterest,
      "Processing Fee": totalProcessingFee,
      "Total Amount Payable": totalPayable,
      "New Loan Tenure": `${(month - 1)} Months`
    });
    setSchedule(tempSchedule);
  };

  useEffect(() => {
    calculateEMI();
  }, [principal, rate, duration, durationType, extraPayment, processingFee]);

  return (
    <>
       <ToolSEO tool={toolData} guideData={guideData} />

      <div className="container">
        <div className="tool-intro" style={{textAlign: 'center', marginBottom: '30px'}}>
            <h1 style={{fontSize: '2.5rem', color: 'var(--primary)'}}>📊 Advanced EMI Calculator</h1>
            <p style={{color: '#666'}}>Calculate repayments and see how extra payments save you money.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onSubmit={(e) => e.preventDefault()}>
              <CalculatorInput label="Loan Amount" value={principal} onChange={setPrincipal} icon={globalCurrency} />
              
              <div className="input-row">
              {/* 1. Interest Rate Input */}
              <CalculatorInput 
                label="Interest Rate" 
                value={rate} 
                onChange={setRate} 
                suffix="%"/>
                {/* 2. Duration Input with Select Menu */}
              <div className="calculator-input-group">
                <label className="input-label">Duration</label>
                <div className="input-wrapper" style={{ display: 'flex', gap: '5px' }}>
                  <input 
                    type="number" 
                    style={{ width: '65%' }} 
                    value={duration} 
                    onChange={(e) => setDuration(e.target.value)}/>                  
                  <select 
                    style={{ width: '35%', padding: '10px', borderRadius: '10px', border: '1px solid #d1d5db' }} 
                    value={durationType} 
                    onChange={(e) => setDurationType(e.target.value)}>                 
                    <option value="years">Yrs</option>
                    <option value="months">Mo</option>
                  </select>
                </div>
              </div>
            </div>

              <div className="advanced-toggle-container">
                <button type="button" className="advanced-btn" onClick={() => setShowAdvanced(!showAdvanced)}>
                    {showAdvanced ? "▲ Hide Advanced Options" : "▼ Add Extra Payments & Fees"}
                </button>
              </div>

              {showAdvanced && (
                <div className="advanced-fields">
                  <CalculatorInput label="Extra Monthly Payment" value={extraPayment} onChange={setExtraPayment} icon={globalCurrency} />
                  <CalculatorInput label="Processing Fee (%)" value={processingFee} onChange={setProcessingFee} suffix="%" />
                </div>
              )}
            </CalculatorForm>

            {/* Standardized Guide Card beneath form */}
            <div style={{marginTop: '25px'}}>
                <Link href="/blog/emi-calculator-guide" className="read-guide-card" style={{display: 'block', textDecoration: 'none'}}>
                    📖 Loan Planning Guide: How to pay off your loan 5 years early
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox title="Loan Breakdown" results={result} formatCurrency={formatCurrency} />
            ) : (
              <div className="result-box" style={{background: '#f8fafc', color: '#64748b', textAlign: 'center'}}>
                Enter loan details to see results
              </div>
            )}
            <div className="sidebar-ad"><AdPlaceholder /></div>
          </div>
        </div>

        {/* Insight Card to explain Amortization */}
        <div className="info-card" style={{marginTop: '40px', padding: '25px', background: '#f0f9ff', borderRadius: '12px', border: '1px solid #bae6fd'}}>
            <h3 style={{color: '#0369a1', marginBottom: '10px'}}>💡 Why do extra payments matter?</h3>
            <p style={{fontSize: '0.9rem', color: '#0369a1', lineHeight: '1.6'}}>
                When you pay even a small "Extra Monthly Payment," that money goes 100% toward your <strong>Principal</strong>, not the interest. This significantly reduces the total interest you pay and helps you become debt-free much faster.
            </p>
            
        </div>

        {/* Amortization Schedule Table */}
        {schedule.length > 0 && (
          <div className="schedule-container" style={{marginTop: '40px'}}>
            <h2 style={{marginBottom: '20px', textAlign: 'center'}}>📅 Yearly Repayment Schedule</h2>
            <div style={{overflowX: 'auto'}}>
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th>Period</th>
                    <th>Remaining Principal</th>
                    <th>Total Interest Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((row, index) => (
                    <tr key={index}>
                      <td>{row.period}</td>
                      <td>{formatCurrency(row.balance)}</td>
                      <td>{formatCurrency(row.interestPaid)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .schedule-table {
          width: 100%; border-collapse: collapse; margin-top: 10px; background: #fff;
          border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        }
        .schedule-table th, .schedule-table td { padding: 15px; text-align: left; border-bottom: 1px solid #f1f5f9; }
        .schedule-table th { background: #f8fafc; color: #64748b; font-weight: 600; }
        .schedule-table tr:last-child { font-weight: bold; background: #f0fdf4; }
      `}</style>
    </>
  );
}