import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function NetWorthCalculator() {
  const [assets, setAssets] = useState("");
  const [liabilities, setLiabilities] = useState("");
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

  const calculateNetWorth = (e) => {
    e.preventDefault();
    const A = parseFloat(assets) || 0;
    const L = parseFloat(liabilities) || 0;

    if (A < 0 || L < 0) {
      alert("⚠️ Please enter valid positive numbers");
      return;
    }

    const netWorth = A - L;
    setResult({ assets: A, liabilities: L, netWorth });
  };

  const resetForm = () => {
    setAssets("");
    setLiabilities("");
    setResult(null);
  };

  return (
    <>
      <Head>
        <title>Net Worth Calculator | ToolFinance</title>
        <meta
          name="description"
          content="Calculate your net worth by subtracting liabilities from your assets."
        />
        <link
          rel="canonical"
          href="https://finance-tools-mu.vercel.app/tools/net-worth"
        />
      </Head>

      <div className="container">
        <h1>💰 Net Worth Calculator</h1>

        <CalculatorForm onSubmit={calculateNetWorth} onReset={resetForm}>
          <CalculatorInput
            placeholder="Total Assets (Rs)"
            value={assets}
            onChange={(val) => setAssets(val)}
          />
          <CalculatorInput
            placeholder="Total Liabilities (Rs)"
            value={liabilities}
            onChange={(val) => setLiabilities(val)}
          />
        </CalculatorForm>

        {result && (
          <ResultBox
            title="📊 Net Worth Summary"
            results={{
              "Total Assets": nepaliCurrency(result.assets),
              "Total Liabilities": nepaliCurrency(result.liabilities),
              "Net Worth": nepaliCurrency(result.netWorth),
            }}
          />
        )}

        <AdPlaceholder />

        <Link
          href="/blog/net-worth-calculator-guide"
          className="read-guide-card"
        >
          📖 Learn About Net Worth
        </Link>
      </div>
    </>
  );
}