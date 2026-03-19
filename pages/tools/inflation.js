// pages/tools/inflation.js
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function InflationCalculator() {
  const [amount, setAmount] = useState("");
  const [inflation, setInflation] = useState("");
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

  const calculateInflation = (e) => {
    e.preventDefault();
    const A = parseFloat(amount) || 0;
    const I = parseFloat(inflation) || 0;
    const Y = parseFloat(years) || 0;

    if (A <= 0 || I <= 0 || I > 100 || Y <= 0) {
      alert("⚠️ Please enter valid values");
      return;
    }

    const futureValue = A * Math.pow(1 + I / 100, Y);
    const lossOfValue = futureValue - A;

    setResult({ futureValue, lossOfValue });
  };

  const resetForm = () => {
    setAmount("");
    setInflation("");
    setYears("");
    setResult(null);
  };

  return (
    <>
      <Head>
        <title>Inflation Impact Calculator | ToolFinance</title>
        <meta
          name="description"
          content="Calculate the future value of your money considering inflation and its purchasing power over time."
        />
        <link
          rel="canonical"
          href="https://finance-tools-mu.vercel.app/tools/inflation"
        />
      </Head>

      <div className="container">
        <h1>💸 Inflation Impact Calculator</h1>

        <CalculatorForm onSubmit={calculateInflation} onReset={resetForm}>
          <CalculatorInput
            placeholder="Current Amount (Rs)"
            value={amount}
            onChange={(val) => setAmount(val)}
          />
          <CalculatorInput
            placeholder="Annual Inflation Rate (%)"
            value={inflation}
            onChange={(val) => setInflation(val)}
          />
          <CalculatorInput
            placeholder="Number of Years"
            value={years}
            onChange={(val) => setYears(val)}
          />
        </CalculatorForm>

        <AdPlaceholder />

        {result && (
          <ResultBox
            title="📊 Inflation Summary"
            results={{
              "Future Value": nepaliCurrency(result.futureValue),
              "Loss of Value": nepaliCurrency(result.lossOfValue),
            }}
          />
        )}

        <Link
          href="/blog/inflation-calculator-guide"
          className="read-guide-card"
        >
          📖 More About Inflation Impact
        </Link>
      </div>
    </>
  );
}