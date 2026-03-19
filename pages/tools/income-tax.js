import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function IncomeTaxCalculator() {
  const [income, setIncome] = useState("");
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

  const calculateTax = (e) => {
    e.preventDefault();

    const inc = parseFloat(income) || 0;

    if (inc <= 0) {
      alert("⚠️ Please enter valid income");
      return;
    }

    let tax = 0;

    // Simple progressive tax (example model)
    if (inc <= 500000) {
      tax = inc * 0.01;
    } else if (inc <= 700000) {
      tax = 500000 * 0.01 + (inc - 500000) * 0.10;
    } else if (inc <= 1000000) {
      tax = 500000 * 0.01 + 200000 * 0.10 + (inc - 700000) * 0.20;
    } else {
      tax =
        500000 * 0.01 +
        200000 * 0.10 +
        300000 * 0.20 +
        (inc - 1000000) * 0.30;
    }

    const netIncome = inc - tax;

    setResult({
      income: inc,
      tax: tax,
      netIncome: netIncome,
    });
  };

  const resetForm = () => {
    setIncome("");
    setResult(null);
  };

  return (
    <>
      <Head>
        <title>Income Tax Calculator | ToolFinance</title>
        <meta
          name="description"
          content="Calculate your income tax, net salary, and tax breakdown easily with our income tax calculator."
        />
        <link
          rel="canonical"
          href="https://finance-tools-mu.vercel.app/tools/income-tax"
        />
      </Head>

      <div className="container">
        <h1>💼 Income Tax Calculator</h1>

        <CalculatorForm onSubmit={calculateTax} onReset={resetForm}>
          <CalculatorInput
            placeholder="Annual Income (Rs)"
            value={income}
            onChange={(val) => setIncome(val)}
          />
        </CalculatorForm>

        <AdPlaceholder />

        {result && (
          <ResultBox
            title="📊 Tax Summary"
            results={result}
            formatCurrency={nepaliCurrency}
          />
        )}

        <Link
          href="/blog/income-tax-guide"
          className="read-guide-card"
        >
          📖 Learn About Income Tax
        </Link>
      </div>
    </>
  );
}