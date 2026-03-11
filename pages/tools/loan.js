import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function LoanCalculator() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [result, setResult] = useState(null);

  const formatCurrency = (num) => {
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

    const P = parseFloat(amount) || 0;
    const R = parseFloat(rate) || 0;
    const Y = parseFloat(years) || 0;

    if (P <= 0 || R <= 0 || R > 100 || Y <= 0) {
      alert("Enter valid values");
      return;
    }

    const interest = (P * R * Y) / 100;
    const totalPayable = P + interest;

    setResult({
      principal: Math.round(P),
      totalInterest: Math.round(interest),
      totalPayable: Math.round(totalPayable),
    });
  };

  const resetForm = () => {
    setAmount("");
    setRate("");
    setYears("");
    setResult(null);
  };

  return (
    <>
      <Head>
        <title>Loan Calculator | ToolFinance</title>
        <meta
          name="description"
          content="Calculate total interest and total payable loan amount in Nepal."
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
            onChange={(val) => setAmount(val)}
          />
          <CalculatorInput
            step="0.01"
            placeholder="Interest Rate (%)"
            value={rate}
            onChange={(val) => setRate(val)}
          />
          <CalculatorInput
            placeholder="Loan Duration (Years)"
            value={years}
            onChange={(val) => setYears(val)}
          />
        </CalculatorForm>

        <AdPlaceholder />

        {result && (
          <ResultBox
            title="Loan Summary"
            results={result}
            formatCurrency={formatCurrency}
          />
        )}

        <Link href="/blog/loan-calculator-guide" className="read-guide-card">
          📖 More About Loan
        </Link>
      </div>
    </>
  );
}