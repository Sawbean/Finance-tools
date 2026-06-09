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

export default function CreditCardPayoffCalculator() {
  const { currency } = useCurrency();

  // Automatically find the data for THIS tool
  const toolData = tools.find(t => t.link === '/tools/credit-card-payoff');
  const guideData = Object.values(allToolGuides).find(g => g.tool === "credit-card-payoff");

  // 1. STATE MANAGEMENT
  const [balance, setBalance] = useState(50000);
  const [interestRate, setInterestRate] = useState(36); 
  const [monthlyPayment, setMonthlyPayment] = useState(5000);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const calculatePayoff = () => {
    setError(""); // Always clear first
    const B = parseFloat(balance) || 0;
    const R = parseFloat(interestRate) || 0;
    const M = parseFloat(monthlyPayment) || 0;

    if (B <= 0) {
        setResult(null);
        return;
    }

    const monthlyRate = R / (12 * 100);
    const firstMonthInterest = B * monthlyRate;
    
    // Updated Safety Check: Use .toLocaleString for the error message
    if (M > 0 && M <= firstMonthInterest) {
      setError(`Payment must be higher than ${currency.symbol}${Math.ceil(firstMonthInterest).toLocaleString(currency.locale)} to cover monthly interest.`);
      setResult(null);
      return;
    }

    if (M <= 0 || R <= 0) {
        setResult(null);
        return;
    }

    let months = 0;
    let remainingBalance = B;
    let totalInterest = 0;

    // Simulation loop for payoff timeline
    while (remainingBalance > 0) {
      const interestForMonth = remainingBalance * monthlyRate;
      totalInterest += interestForMonth;
      remainingBalance = remainingBalance + interestForMonth - M;
      months++;
      if (months > 600) break; // 50-year cap
    }

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    setResult({
      "Time to Freedom": `${years > 0 ? years + " years " : ""}${remainingMonths} months`,
      "Monthly Interest Cost": Math.round(firstMonthInterest), // Raw number
      "Total Interest Paid": Math.round(totalInterest),       // Raw number
      "Total Amount Paid": Math.round(B + totalInterest),      // Raw number
      "Debt Markup": `${((totalInterest / B) * 100).toFixed(0)}% additional cost`
    });
  };

  useEffect(() => {
    calculatePayoff();
  }, [balance, interestRate, monthlyPayment]);

  const handleReset = () => {
    setError("");
    setBalance(""); 
    setInterestRate(36); 
    setMonthlyPayment(""); 
    setResult(null); 
    setError("");
  };

  return (
    <>
      <ToolSEO tool={toolData} guideData={guideData} />

      <div className="container">
        <div className="tool-intro">
            <h1>💳 Credit Card Payoff</h1>
            <p>Stop the interest drain. See exactly when you'll be debt-free.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()} error={error}>
              <CalculatorInput label="Total Balance" value={balance} onChange={setBalance} icon={currency.symbol} />
              
              <div className="input-row">
                <CalculatorInput label="Interest Rate (APR)" value={interestRate} onChange={setInterestRate} suffix="%" />
                <CalculatorInput label="Monthly Payment" value={monthlyPayment} onChange={setMonthlyPayment} icon={currency.symbol} />
              </div>
            </CalculatorForm>

            <div className="guide-card-wrapper">
                <Link href="/blog/credit-card-payoff-guide" className="read-guide-card">
                    📖 Strategy: Snowball vs. Avalanche — Which clears debt faster?
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox title="Payoff Summary" results={result} />
            ) : (
              <div className="result-box-empty">
                {error ? `Please increase your payment amount.` : "Enter your balance to see your debt-free roadmap."}
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        <div className="info-card payoff-info">
            <h3>The "Minimum Payment" Trap</h3>
            <p>
              For instance, if you owe <strong>{currency.symbol}{Number(1000).toLocaleString(currency.locale)}</strong> and only pay the minimum, you might end up paying back double that amount over several years. 
              <br /><br />
              Financial institutions often set the minimum payment at a very low percentage of your balance. This strategy is designed to maximize their interest revenue by keeping you in debt for a longer period. By paying even a small amount above the minimum, you "break the cycle," compound your progress, and save significantly on total interest costs.
            </p>
        </div>
      </div>
    </>
  );
}