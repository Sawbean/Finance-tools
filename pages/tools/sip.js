import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function SIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [result, setResult] = useState(null);

  // Nepali currency format
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

  const calculateSIP = (e) => {
    e.preventDefault();

    const P = parseFloat(monthlyInvestment) || 0;
    const R = parseFloat(rate) || 0;
    const Y = parseFloat(years) || 0;

    if (P <= 0 || R <= 0 || R > 100 || Y <= 0) {
      alert("⚠️ Please enter valid values");
      return;
    }

    const n = Y * 12;
    const r = R / (12 * 100);

    const futureValue =
      P *
      ((Math.pow(1 + r, n) - 1) / r) *
      (1 + r);

    const totalInvestment = P * n;
    const totalReturns = futureValue - totalInvestment;

    setResult({
      invested: totalInvestment,
      returns: totalReturns,
      totalValue: futureValue,
    });
  };

  const resetForm = () => {
    setMonthlyInvestment("");
    setRate("");
    setYears("");
    setResult(null);
  };

  return (
    <>
      <Head>
        <title>SIP Calculator | ToolFinance</title>
        <meta
          name="description"
          content="Calculate SIP returns, total investment, and future value with our easy SIP calculator."
        />
        <link
          rel="canonical"
          href="https://finance-tools-mu.vercel.app/tools/sip"
        />
      </Head>

      <div className="container">
        <h1>📈 SIP Calculator</h1>

        <CalculatorForm onSubmit={calculateSIP} onReset={resetForm}>
          <CalculatorInput
            placeholder="Monthly Investment (Rs)"
            value={monthlyInvestment}
            onChange={(val) => setMonthlyInvestment(val)}
          />
          <CalculatorInput
            step="0.01"
            placeholder="Expected Return Rate (%)"
            value={rate}
            onChange={(val) => setRate(val)}
          />
          <CalculatorInput
            placeholder="Time Period (Years)"
            value={years}
            onChange={(val) => setYears(val)}
          />
        </CalculatorForm>

        <AdPlaceholder />

        {result && (
          <ResultBox
            title="📊 SIP Summary"
            results={result}
            formatCurrency={nepaliCurrency}
          />
        )}

        <Link
          href="/blog/sip-calculator-guide"
          className="read-guide-card"
        >
          📖 More About SIP
        </Link>
      </div>
    </>
  );
}