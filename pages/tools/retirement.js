import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState("");
  const [retirementAge, setRetirementAge] = useState("");
  const [monthlySaving, setMonthlySaving] = useState("");
  const [rate, setRate] = useState("");
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

  const calculateRetirement = (e) => {
    e.preventDefault();

    const age = parseFloat(currentAge) || 0;
    const retire = parseFloat(retirementAge) || 0;
    const monthly = parseFloat(monthlySaving) || 0;
    const R = parseFloat(rate) || 0;

    if (
      age <= 0 ||
      retire <= age ||
      monthly <= 0 ||
      R < 0 ||
      R > 100
    ) {
      alert("⚠️ Please enter valid values");
      return;
    }

    const years = retire - age;
    const n = years * 12;
    const r = R / (12 * 100);

    const futureValue =
      monthly *
      ((Math.pow(1 + r, n) - 1) / r) *
      (1 + r);

    const totalInvested = monthly * n;
    const interestEarned = futureValue - totalInvested;

    setResult({
      totalInvestment: totalInvested,
      interestEarned: interestEarned,
      retirementFund: futureValue,
      yearsToInvest: years,
    });
  };

  const resetForm = () => {
    setCurrentAge("");
    setRetirementAge("");
    setMonthlySaving("");
    setRate("");
    setResult(null);
  };

  return (
    <>
      <Head>
        <title>Retirement Calculator | ToolFinance</title>
        <meta
          name="description"
          content="Plan your retirement savings by calculating how much you need to invest monthly to build your retirement fund."
        />
        <link
          rel="canonical"
          href="https://finance-tools-mu.vercel.app/tools/retirement"
        />
      </Head>

      <div className="container">
        <h1>👴 Retirement Planning Calculator</h1>

        <CalculatorForm onSubmit={calculateRetirement} onReset={resetForm}>
          <CalculatorInput
            placeholder="Current Age"
            value={currentAge}
            onChange={(val) => setCurrentAge(val)}
          />
          <CalculatorInput
            placeholder="Retirement Age"
            value={retirementAge}
            onChange={(val) => setRetirementAge(val)}
          />
          <CalculatorInput
            placeholder="Monthly Investment (Rs)"
            value={monthlySaving}
            onChange={(val) => setMonthlySaving(val)}
          />
          <CalculatorInput
            step="0.01"
            placeholder="Expected Return Rate (%)"
            value={rate}
            onChange={(val) => setRate(val)}
          />
        </CalculatorForm>

        <AdPlaceholder />

        {result && (
          <ResultBox
            title="📊 Retirement Summary"
            results={result}
            formatCurrency={nepaliCurrency}
          />
        )}

        <Link
          href="/blog/retirement-planning-guide"
          className="read-guide-card"
        >
          📖 Learn About Retirement Planning
        </Link>
      </div>
    </>
  );
}