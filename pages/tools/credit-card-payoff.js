import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

// Import global utilities
import { formatCurrency, globalCurrency } from "../../utils/formatters"; 

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function CreditCardPayoffCalculator() {
  const [balance, setBalance] = useState(50000);
  const [interestRate, setInterestRate] = useState(36); 
  const [monthlyPayment, setMonthlyPayment] = useState(5000);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const calculatePayoff = () => {
    const B = parseFloat(balance) || 0;
    const R = parseFloat(interestRate) || 0;
    const M = parseFloat(monthlyPayment) || 0;

    if (B <= 0 || R <= 0 || M <= 0) {
      setResult(null);
      return;
    }

    const monthlyRate = R / (12 * 100);
    const firstMonthInterest = B * monthlyRate;
    
    // Safety Check: Payment vs Interest
    if (M <= firstMonthInterest) {
      setError(`Your payment must be higher than ${formatCurrency(firstMonthInterest)} to cover the monthly interest.`);
      setResult(null);
      return;
    } else {
      setError("");
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
      "Total Interest Paid": totalInterest,
      "Total Amount Paid": B + totalInterest,
      "Monthly Interest Cost": firstMonthInterest,
      "Debt Markup": `${((totalInterest / B) * 100).toFixed(0)}% additional cost`
    });
  };

  useEffect(() => {
    calculatePayoff();
  }, [balance, interestRate, monthlyPayment]);

  const handleReset = () => {
    setBalance(""); 
    setInterestRate(36); 
    setMonthlyPayment(""); 
    setResult(null); 
    setError("");
  };

  return (
    <>
      <Head>
        <title>Credit Card Payoff Calculator | Debt Timeline Tool | ToolFinance</title>
        <meta name="description" content="Calculate how long it takes to pay off credit card debt globally. See the true cost of interest and plan your debt-free date." />
      </Head>

      <div className="container">
        <div className="tool-intro" style={{textAlign: 'center', marginBottom: '30px'}}>
            <h1 style={{fontSize: '2.5rem', color: 'var(--primary)'}}>💳 Credit Card Payoff</h1>
            <p style={{color: '#666'}}>Stop the interest drain. See exactly when you'll be debt-free.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()}>
              <CalculatorInput label="Total Balance" value={balance} onChange={setBalance} icon={globalCurrency} />
              
              <div className="input-row">
                <CalculatorInput label="Interest Rate (APR)" value={interestRate} onChange={setInterestRate} suffix="%" />
                <CalculatorInput label="Monthly Payment" value={monthlyPayment} onChange={setMonthlyPayment} icon={globalCurrency} />
              </div>

              {error && (
                <div style={{
                    color: '#dc2626', background: '#fef2f2', padding: '12px', 
                    borderRadius: '8px', fontSize: '0.8rem', marginTop: '15px', 
                    border: '1px solid #fecaca', fontWeight: '500'
                }}>
                  ⚠️ {error}
                </div>
              )}
            </CalculatorForm>

            <div style={{marginTop: '25px'}}>
                <Link href="/blog/credit-card-payoff-guide" className="read-guide-card" style={{display: 'block', textDecoration: 'none'}}>
                    📖 Strategy: Snowball vs. Avalanche — Which clears debt faster?
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox title="Payoff Summary" results={result} formatCurrency={formatCurrency} />
            ) : (
              <div className="result-box" style={{background: '#f8fafc', color: '#64748b', textAlign: 'center'}}>
                {error ? "Please increase your payment amount." : "Enter your balance to see your debt-free roadmap."}
              </div>
            )}
            <AdPlaceholder />
          </div>
        </div>

        <div className="info-card" style={{marginTop: '40px', padding: '25px', background: '#fff7ed', borderRadius: '12px', border: '1px solid #ffedd5'}}>
            <h3 style={{color: '#9a3412', marginBottom: '10px'}}>The "Minimum Payment" Trap</h3>
            <p style={{fontSize: '0.95rem', color: '#9a3412', lineHeight: '1.6'}}>
                Financial institutions often set the minimum payment at a very low percentage of your balance. This strategy is designed to maximize interest revenue over a longer period. By paying even a small amount above the minimum, you compound your progress and save significantly on total interest.
            </p>
            
        </div>
      </div>
    </>
  );
}