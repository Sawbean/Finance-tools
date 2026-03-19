import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function FDRDCalculator() {
  const [fdPrincipal, setFdPrincipal] = useState("");
  const [fdRate, setFdRate] = useState("");
  const [fdYears, setFdYears] = useState("");

  const [rdMonthly, setRdMonthly] = useState("");
  const [rdRate, setRdRate] = useState("");
  const [rdYears, setRdYears] = useState("");

  const [fdResult, setFdResult] = useState(null);
  const [rdResult, setRdResult] = useState(null);

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

  // FD calculation
  const calculateFD = (e) => {
    e.preventDefault();
    const P = parseFloat(fdPrincipal) || 0;
    const R = parseFloat(fdRate) || 0;
    const Y = parseFloat(fdYears) || 0;

    if (P <= 0 || R <= 0 || R > 100 || Y <= 0) {
      alert("⚠️ Please enter valid FD values");
      return;
    }

    const n = 12; // monthly compounding
    const total = P * Math.pow(1 + R / (100 * n), n * Y);
    const interest = total - P;

    setFdResult({ total: total, interest });
  };

  // RD calculation
  const calculateRD = (e) => {
    e.preventDefault();
    const M = parseFloat(rdMonthly) || 0;
    const R = parseFloat(rdRate) || 0;
    const Y = parseFloat(rdYears) || 0;

    if (M <= 0 || R <= 0 || R > 100 || Y <= 0) {
      alert("⚠️ Please enter valid RD values");
      return;
    }

    const n = 12; // monthly compounding
    const months = Y * 12;
    let total = 0;
    for (let i = 1; i <= months; i++) {
      total += M * Math.pow(1 + R / (100 * n), months - i + 1);
    }
    const interest = total - M * months;

    setRdResult({ total, interest });
  };

  const resetFD = () => {
    setFdPrincipal("");
    setFdRate("");
    setFdYears("");
    setFdResult(null);
  };

  const resetRD = () => {
    setRdMonthly("");
    setRdRate("");
    setRdYears("");
    setRdResult(null);
  };

  return (
    <>
      <Head>
        <title>FD & RD Calculator | ToolFinance</title>
        <meta
          name="description"
          content="Calculate Fixed Deposit (FD) and Recurring Deposit (RD) maturity and interest in Nepal."
        />
        <link
          rel="canonical"
          href="https://finance-tools-mu.vercel.app/tools/fd-rd-calculator"
        />
      </Head>

      <div className="container">
        <h1>💰 Fixed Deposit & Recurring Deposit Calculator</h1>

        <h2>Fixed Deposit (FD)</h2>
        <CalculatorForm onSubmit={calculateFD} onReset={resetFD}>
          <CalculatorInput
            placeholder="Principal Amount (Rs)"
            value={fdPrincipal}
            onChange={(val) => setFdPrincipal(val)}
          />
          <CalculatorInput
            step="0.01"
            placeholder="Interest Rate (%)"
            value={fdRate}
            onChange={(val) => setFdRate(val)}
          />
          <CalculatorInput
            placeholder="Duration (Years)"
            value={fdYears}
            onChange={(val) => setFdYears(val)}
          />
        </CalculatorForm>

        {fdResult && (
          <ResultBox
            title="📊 FD Summary"
            results={{
              "Total Amount": nepaliCurrency(fdResult.total),
              "Total Interest": nepaliCurrency(fdResult.interest),
            }}
          />
        )}

        <h2>Recurring Deposit (RD)</h2>
        <CalculatorForm onSubmit={calculateRD} onReset={resetRD}>
          <CalculatorInput
            placeholder="Monthly Deposit (Rs)"
            value={rdMonthly}
            onChange={(val) => setRdMonthly(val)}
          />
          <CalculatorInput
            step="0.01"
            placeholder="Interest Rate (%)"
            value={rdRate}
            onChange={(val) => setRdRate(val)}
          />
          <CalculatorInput
            placeholder="Duration (Years)"
            value={rdYears}
            onChange={(val) => setRdYears(val)}
          />
        </CalculatorForm>

        {rdResult && (
          <ResultBox
            title="📊 RD Summary"
            results={{
              "Total Amount": nepaliCurrency(rdResult.total),
              "Total Interest": nepaliCurrency(rdResult.interest),
            }}
          />
        )}

        <AdPlaceholder />

        <Link
          href="/blog/fd-rd-calculator-guide"
          className="read-guide-card"
        >
          📖 Learn About FD & RD
        </Link>
      </div>
    </>
  );
}