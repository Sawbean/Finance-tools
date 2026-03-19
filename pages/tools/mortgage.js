import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function MortgageCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
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

  const calculateMortgage = (e) => {
    e.preventDefault();
    const P = parseFloat(principal) || 0;
    const R = parseFloat(rate) || 0;
    const Y = parseFloat(years) || 0;

    if (P <= 0 || R <= 0 || R > 100 || Y <= 0) {
      alert("⚠️ Please enter valid values");
      return;
    }

    const N = Y * 12;
    const monthlyRate = R / (12 * 100);
    const payment =
      (P * monthlyRate * Math.pow(1 + monthlyRate, N)) /
      (Math.pow(1 + monthlyRate, N) - 1);

    const totalPayment = payment * N;
    const totalInterest = totalPayment - P;

    setResult({ monthlyPayment: payment, totalPayment, totalInterest });
  };

  const resetForm = () => {
    setPrincipal("");
    setRate("");
    setYears("");
    setResult(null);
  };

  return (
    <>
      <Head>
        <title>Mortgage Calculator | ToolFinance</title>
        <meta
          name="description"
          content="Calculate your monthly mortgage payment, total interest, and total cost of your home loan."
        />
        <link
          rel="canonical"
          href="https://finance-tools-mu.vercel.app/tools/mortgage"
        />
      </Head>

      <div className="container">
        <h1>🏠 Mortgage Calculator</h1>

        {/* Use CalculatorForm's submit button */}
        <CalculatorForm onSubmit={calculateMortgage} onReset={resetForm}>
          <CalculatorInput
            placeholder="Loan Amount (Rs)"
            value={principal}
            onChange={(val) => setPrincipal(val)}
          />
          <CalculatorInput
            step="0.01"
            placeholder="Annual Interest Rate (%)"
            value={rate}
            onChange={(val) => setRate(val)}
          />
          <CalculatorInput
            placeholder="Loan Term (Years)"
            value={years}
            onChange={(val) => setYears(val)}
          />
        </CalculatorForm>

        <AdPlaceholder />

        {result && (
          <ResultBox
            title="📊 Mortgage Summary"
            results={result}
            formatCurrency={nepaliCurrency}
          />
        )}

        <Link
          href="/blog/mortgage-calculator-guide"
          className="read-guide-card"
        >
          📖 More About Mortgage
        </Link>
      </div>
    </>
  );
}