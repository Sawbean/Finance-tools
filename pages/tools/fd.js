import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function FDCalculator() {
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

  const calculateFD = (e) => {
    e.preventDefault();

    const P = parseFloat(principal) || 0;
    const R = parseFloat(rate) || 0;
    const Y = parseFloat(years) || 0;

    if (P <= 0 || R <= 0 || R > 100 || Y <= 0) {
      alert("⚠️ Please enter valid values");
      return;
    }

    // Compound annually (standard FD assumption)
    const A = P * Math.pow(1 + R / 100, Y);
    const interest = A - P;

    setResult({
      invested: P,
      interest: interest,
      maturityAmount: A,
    });
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
        <title>FD Calculator | ToolFinance</title>
        <meta
          name="description"
          content="Calculate fixed deposit maturity amount, interest earned, and total returns with our FD calculator."
        />
        <link
          rel="canonical"
          href="https://finance-tools-mu.vercel.app/tools/fd"
        />
      </Head>

      <div className="container">
        <h1>🏦 Fixed Deposit (FD) Calculator</h1>

        <CalculatorForm onSubmit={calculateFD} onReset={resetForm}>
          <CalculatorInput
            placeholder="Investment Amount (Rs)"
            value={principal}
            onChange={(val) => setPrincipal(val)}
          />
          <CalculatorInput
            step="0.01"
            placeholder="Interest Rate (%)"
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
            title="📊 FD Summary"
            results={result}
            formatCurrency={nepaliCurrency}
          />
        )}

        <Link
          href="/blog/fd-calculator-guide"
          className="read-guide-card"
        >
          📖 Learn About Fixed Deposits
        </Link>
      </div>
    </>
  );
}