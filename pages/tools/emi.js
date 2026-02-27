import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function EMICalculator() {
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

  const calculateEMI = (e) => {
    e.preventDefault();
    const P = parseFloat(principal);
    const R = parseFloat(rate);
    const Y = parseFloat(years);

    if (P <= 0 || R <= 0 || R > 100 || Y <= 0) {
      alert("⚠️ Please enter valid values");
      return;
    }

    const N = Y * 12;
    const monthlyRate = R / (12 * 100);
    const emi =
      (P * monthlyRate * Math.pow(1 + monthlyRate, N)) /
      (Math.pow(1 + monthlyRate, N) - 1);

    const totalPayment = emi * N;
    const totalInterest = totalPayment - P;

    setResult({ monthlyEMI: emi, totalPayment, totalInterest });
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
        <title>EMI Calculator | ToolFinance</title>
        <meta
          name="description"
          content="Calculate EMI, total payment, and interest for loans in Nepal."
        />
        <link
          rel="canonical"
          href="https://finance-tools-mu.vercel.app/tools/emi"
        />
      </Head>

      <div className="container">
        <h1>💰 EMI Calculator</h1>

        <CalculatorForm onSubmit={calculateEMI} onReset={resetForm}>
          <CalculatorInput
            placeholder="Loan Amount (Rs)"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
          />
          <CalculatorInput
            step="0.01"
            placeholder="Interest Rate (%)"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
          <CalculatorInput
            placeholder="Duration (Years)"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </CalculatorForm>

        <AdPlaceholder />

        {result && (
          <ResultBox
            title="📊 EMI Summary"
            results={result}
            formatCurrency={nepaliCurrency}
          />
        )}

        <Link href="/blog/emi-calculator-guide" className="read-guide-card">
          📖 Read Full EMI Calculator Guide
        </Link>
      </div>
    </>
  );
}