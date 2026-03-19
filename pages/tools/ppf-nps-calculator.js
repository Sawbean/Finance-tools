import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function PPFNPSCalculator() {
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

  const calculatePPFNPS = (e) => {
    e.preventDefault();
    const P = parseFloat(principal) || 0;
    const R = parseFloat(rate) || 0;
    const Y = parseFloat(years) || 0;

    if (P <= 0 || R <= 0 || R > 100 || Y <= 0) {
      alert("⚠️ Please enter valid values");
      return;
    }

    const n = 12; // monthly compounding
    const N = Y * 12;

    // Future Value formula for monthly investment: FV = P * [(1+r)^n -1]/r
    const monthlyRate = R / (12 * 100);
    const fv = P * (Math.pow(1 + monthlyRate, N) - 1) / monthlyRate;
    const totalInvestment = P * N;
    const totalInterest = fv - totalInvestment;

    setResult({ fv, totalInvestment, totalInterest });
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
        <title>PPF / NPS Calculator | ToolFinance</title>
        <meta
          name="description"
          content="Calculate future value, total investment, and interest for PPF or NPS monthly contributions in Nepal."
        />
        <link
          rel="canonical"
          href="https://finance-tools-mu.vercel.app/tools/ppf-nps-calculator"
        />
      </Head>

      <div className="container">
        <h1>📈 PPF / NPS Calculator</h1>

        <CalculatorForm onSubmit={calculatePPFNPS} onReset={resetForm}>
          <CalculatorInput
            placeholder="Monthly Contribution (Rs)"
            value={principal}
            onChange={(val) => setPrincipal(val)}
          />
          <CalculatorInput
            step="0.01"
            placeholder="Expected Interest Rate (%)"
            value={rate}
            onChange={(val) => setRate(val)}
          />
          <CalculatorInput
            placeholder="Duration (Years)"
            value={years}
            onChange={(val) => setYears(val)}
          />
        </CalculatorForm>

        {result && (
          <ResultBox
            title="📊 PPF/NPS Summary"
            results={{
              "Future Value": nepaliCurrency(result.fv),
              "Total Investment": nepaliCurrency(result.totalInvestment),
              "Total Interest": nepaliCurrency(result.totalInterest),
            }}
          />
        )}

        <AdPlaceholder />

        <Link
          href="/blog/ppf-nps-calculator-guide"
          className="read-guide-card"
        >
          📖 Learn About PPF & NPS
        </Link>
      </div>
    </>
  );
}