import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function SavingsGoalCalculator() {
  const [goal, setGoal] = useState("");
  const [currentSavings, setCurrentSavings] = useState("");
  const [years, setYears] = useState("");
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

  const calculateSavings = (e) => {
    e.preventDefault();

    const G = parseFloat(goal) || 0;
    const C = parseFloat(currentSavings) || 0;
    const Y = parseFloat(years) || 0;
    const R = parseFloat(rate) || 0;

    if (G <= 0 || Y <= 0 || R < 0 || R > 100 || C < 0) {
      alert("⚠️ Please enter valid values");
      return;
    }

    const remainingGoal = G - C;
    const n = Y * 12;
    const r = R / (12 * 100);

    let monthlySaving;

    if (r === 0) {
      monthlySaving = remainingGoal / n;
    } else {
      monthlySaving =
        remainingGoal /
        (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    }

    const totalSaved = monthlySaving * n;
    const totalValue = totalSaved + C;


    setResult({
      monthlySaving,
      totalSaved,
      currentSavings: C,
      goal: G,
    });
  };

  const resetForm = () => {
    setGoal("");
    setCurrentSavings("");
    setYears("");
    setRate("");
    setResult(null);
  };

  return (
    <>
      <Head>
        <title>Savings Goal Calculator | ToolFinance</title>
        <meta
          name="description"
          content="Calculate how much you need to save monthly to reach your financial goal."
        />
        <link
          rel="canonical"
          href="https://finance-tools-mu.vercel.app/tools/savings-goal"
        />
      </Head>

      <div className="container">
        <h1>🎯 Savings Goal Calculator</h1>

        <CalculatorForm onSubmit={calculateSavings} onReset={resetForm}>
          <CalculatorInput
            placeholder="Target Amount (Rs)"
            value={goal}
            onChange={(val) => setGoal(val)}
          />
          <CalculatorInput
            placeholder="Current Savings (Rs)"
            value={currentSavings}
            onChange={(val) => setCurrentSavings(val)}
          />
          <CalculatorInput
            placeholder="Time Period (Years)"
            value={years}
            onChange={(val) => setYears(val)}
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
            title="📊 Savings Plan"
            results={result}
            formatCurrency={nepaliCurrency}
          />
        )}

        <Link
          href="/blog/savings-goal-guide"
          className="read-guide-card"
        >
          📖 Learn About Saving Goals
        </Link>
      </div>
    </>
  );
}