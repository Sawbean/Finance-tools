import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function CreditCardPayoffCalculator() {
  const [balance, setBalance] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");
  const [result, setResult] = useState(null);

  const nepaliCurrency = (num) => {
    num = Math.round(num);
    let str = num.toString();
    if (str.length <= 3) return str;
    let lastThree = str.slice(-3);
    let remaining = str.slice(0, -3);
    let parts = [];
    while (remaining.length > 2) {
      parts.unshift(remaining.slice(-2));
      remaining = remaining.slice(0, -2);
    }
    if (remaining.length) parts.unshift(remaining);
    return parts.join(",") + "," + lastThree;
  };

  const calculatePayoff = (e) => {
    e.preventDefault();
    const B = parseFloat(balance) || 0;
    const R = parseFloat(interestRate) || 0;
    const M = parseFloat(monthlyPayment) || 0;

    if (B <= 0 || R <= 0 || R > 100 || M <= 0) {
      alert("⚠️ Please enter valid values");
      return;
    }

    const monthlyRate = R / (12 * 100);
    let months = 0;
    let remainingBalance = B;

    while (remainingBalance > 0) {
      remainingBalance = remainingBalance * (1 + monthlyRate) - M;
      months++;
      if (months > 1000) break; // safety to avoid infinite loop
    }

    const totalPaid = M * months;
    const totalInterest = totalPaid - B;

    setResult({ months, totalPaid, totalInterest });
  };

  const resetForm = () => {
    setBalance("");
    setInterestRate("");
    setMonthlyPayment("");
    setResult(null);
  };

  return (
    <>
      <Head>
        <title>Credit Card Payoff Calculator | ToolFinance</title>
        <meta
          name="description"
          content="Plan how to pay off your credit card debt efficiently by calculating months to pay and interest."
        />
        <link
          rel="canonical"
          href="https://finance-tools-mu.vercel.app/tools/credit-card-payoff"
        />
      </Head>

      <div className="container">
        <h1>💳 Credit Card Payoff Calculator</h1>

        <CalculatorForm onSubmit={calculatePayoff} onReset={resetForm}>
          <CalculatorInput
            placeholder="Credit Card Balance (Rs)"
            value={balance}
            onChange={(val) => setBalance(val)}
          />
          <CalculatorInput
            step="0.01"
            placeholder="Interest Rate (%)"
            value={interestRate}
            onChange={(val) => setInterestRate(val)}
          />
          <CalculatorInput
            placeholder="Monthly Payment (Rs)"
            value={monthlyPayment}
            onChange={(val) => setMonthlyPayment(val)}
          />
        </CalculatorForm>

        <AdPlaceholder />

        {result && (
          <ResultBox
            title="📊 Payoff Summary"
            results={{
              "Months to Pay Off": result.months,
              "Total Paid": nepaliCurrency(result.totalPaid),
              "Total Interest Paid": nepaliCurrency(result.totalInterest),
            }}
          />
        )}

        <Link
          href="/blog/credit-card-payoff-guide"
          className="read-guide-card"
        >
          📖 Learn About Credit Card Payoff
        </Link>
      </div>
    </>
  );
}