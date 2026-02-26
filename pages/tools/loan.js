import { useState } from "react";
import Head from "next/head";

import CalculatorForm from "../../components/CalculatorForm";
import CalculatorInput from "../../components/CalculatorInput";
import ResultBox from "../../components/ResultBox";
import AdPlaceholder from "../../components/AdPlaceholder";

export default function LoanCalculator() {
  const [amount, setAmount] = useState("");
  const [interest, setInterest] = useState("");
  const [years, setYears] = useState("");
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

  const calculateLoan = (e) => {
    e.preventDefault();

    const P = parseFloat(amount);
    const R = parseFloat(interest);
    const Y = parseFloat(years);

    if (P <= 0 || R <= 0 || R > 100 || Y <= 0) {
      alert("⚠️ Please enter valid values");
      return;
    }

    const totalInterest = (P * R * Y) / 100;
    const totalPayment = P + totalInterest;

    setResult({
      loanAmount: P,
      totalInterest,
      totalPayment,
    });
  };

  const resetForm = () => {
    setAmount("");
    setInterest("");
    setYears("");
    setResult(null);
  };

  return (
    <>
      <Head>
        <title>Loan Calculator | ToolFinance</title>
        <meta
          name="description"
          content="Calculate total loan repayment and interest amount easily."
        />
        <link
          rel="canonical"
          href="https://finance-tools-mu.vercel.app/tools/loan"
        />
      </Head>

      <div className="container">
        <h1>🏦 Loan Calculator</h1>

        <CalculatorForm onSubmit={calculateLoan} onReset={resetForm}>
          <CalculatorInput
            placeholder="Loan Amount (Rs)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <CalculatorInput
            step="0.01"
            placeholder="Interest Rate (% per year)"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
          />
          <CalculatorInput
            placeholder="Duration (Years)"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </CalculatorForm>

        <AdPlaceholder />

        {result && (
          <ResultBox
            title="📊 Loan Summary"
            results={result}
            formatCurrency={nepaliCurrency}
          />
        )}
      </div>
    </>
  );
}