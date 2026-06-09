import { useState, useEffect } from "react";
import Link from "next/link"; 
import { tools } from '../../data/tools';
import ToolSEO from '../../components/layout/ToolSEO';
import { allToolGuides } from '../../data/tool-guides/index';
// Import global utilities
import { useCurrency } from "../../context/CurrencyContext"; 

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function EMICalculator() {
  const [error, setError] = useState("");
  const { currency } = useCurrency();
  
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

  const toolData = tools.find(t => t.link === '/tools/emi');
  const guideData = Object.values(allToolGuides).find(g => g.tool === "emi");
  const formatValue = (val) => new Intl.NumberFormat(currency.locale).format(val);

  const handleReset = () => {
    setPrincipal(500000);
    setRate(10.5);
    setDuration(5);
    setDurationType("years");
    setExtraPayment("");
    setProcessingFee("");
    setError("");
    setResult(null);
    setSchedule([]);
  };

  // 2. CALCULATION LOGIC
  const calculateEMI = () => {
    setError("");
    const P = parseFloat(principal) || 0;
    const R = parseFloat(rate) || 0;
    const D = parseFloat(duration) || 0;
    const feeP = parseFloat(processingFee) || 0;
    const extra = parseFloat(extraPayment) || 0;

    if (P <= 0 || R <= 0 || D <= 0) {
        setResult(null);
        setSchedule([]);
        if (principal || rate || duration) setError("Please enter valid loan details.");
        return;
    }

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
        <div className="tool-intro">
            <h1>📊 Advanced EMI Calculator</h1>
            <p>Calculate repayments and see how extra payments save you money.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()} error={error}>
              <CalculatorInput label="Loan Amount" value={principal} onChange={setPrincipal} icon={currency.symbol} />
              
              <div className="input-row">
                <CalculatorInput label="Interest Rate" value={rate} onChange={setRate} suffix="%"/>
                
                <div className="calculator-input-group">
                  <label className="input-label">Duration</label>
                  <div className="input-wrapper emi-duration-wrapper">
                    <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)}/>                  
                    <select value={durationType} onChange={(e) => setDurationType(e.target.value)}>                
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
                  <CalculatorInput label="Extra Monthly Payment" value={extraPayment} onChange={setExtraPayment} icon={currency.symbol} />
                  <CalculatorInput label="Processing Fee (%)" value={processingFee} onChange={setProcessingFee} suffix="%" />
                </div>
              )}
            </CalculatorForm>

            <div className="guide-card-wrapper">
                <Link href="/blog/emi-calculator-guide" className="read-guide-card">
                    📖 Loan Planning Guide: How to pay off your loan 5 years early
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox title="Loan Breakdown" results={result} />
            ) : (
              <div className="result-box-empty">
                Enter loan details to see results
              </div>
            )}
            <div className="sidebar-ad"><AdPlaceholder /></div>
          </div>
        </div>

        <div className="info-card emi-insight-card">
            <h3>💡 Why do extra payments matter?</h3>
            <p className="info-text">
                When you pay even a small "Extra Monthly Payment," that money goes 100% toward your <strong>Principal</strong>, not the interest. This significantly reduces the total interest you pay and helps you become debt-free much faster.
            </p>
            <p className="info-text secondary-insight">
                <strong>Strategy Insight:</strong> By taking a loan of <strong>{currency.symbol}{formatValue(principal)}</strong>, your total commitment (including interest) is 
                <strong> {result ? formatValue(Math.round(result["Total Amount Payable"])) : "---"}</strong>. 
                <br /><br />
                Standard EMIs are designed so you pay mostly interest in the early years. By adding an extra amount, you "break the cycle" of compounding interest. This isn't just a payment; it's a guaranteed return equal to your loan's interest rate.
            </p>
        </div>

        {schedule.length > 0 && (
          <div className="schedule-container">
            <h2 className="schedule-title">📅 Yearly Repayment Schedule</h2>
            <div className="table-responsive">
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
                      <td>{currency.symbol} {formatValue(row.balance)}</td>
                      <td>{currency.symbol} {formatValue(row.interestPaid)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}