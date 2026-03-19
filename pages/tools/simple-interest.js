// pages/tools/simple-interest.js
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function SimpleInterestCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [result, setResult] = useState(null);

  const nepaliCurrency = (num) => {
    num = Math.round(num * 100) / 100;
    return num.toLocaleString("en-IN", { minimumFractionDigits: 2 });
  };

  const calculateInterest = (e) => {
    e.preventDefault();
    const P = parseFloat(principal) || 0;
    const R = parseFloat(rate) || 0;
    const T = parseFloat(time) || 0;

    if (P <= 0 || R <= 0 || T <= 0) {
      alert("⚠️ Please enter valid values");
      return;
    }

    const interest = (P * R * T) / 100;
    const totalAmount = P + interest;

    setResult({ interest, totalAmount });
  };

  const resetForm = () => {
    setPrincipal("");
    setRate("");
    setTime("");
    setResult(null);
  };

  return (
    <>
      <Head>
        <title>Simple Interest Calculator | ToolFinance</title>
        <meta
          name="description"
          content="Calculate simple interest and total amount for your loan or investment easily."
        />
        <link
          rel="canonical"
          href="https://finance-tools-mu.vercel.app/tools/simple-interest"
        />
      </Head>

      <div className="container">
        <h1>💰 Simple Interest Calculator</h1>

        <CalculatorForm onSubmit={calculateInterest} onReset={resetForm}>
          <CalculatorInput
            placeholder="Principal Amount (Rs)"
            value={principal}
            onChange={(val) => setPrincipal(val)}
          />
          <CalculatorInput
            placeholder="Annual Interest Rate (%)"
            value={rate}
            onChange={(val) => setRate(val)}
          />
          <CalculatorInput
            placeholder="Time Period (Years)"
            value={time}
            onChange={(val) => setTime(val)}
          />
        </CalculatorForm>

        <AdPlaceholder />

        {result && (
          <ResultBox
            title="📊 Simple Interest Result"
            results={{
              "Interest": nepaliCurrency(result.interest),
              "Total Amount": nepaliCurrency(result.totalAmount),
            }}
          />
        )}

        <Link
          href="/blog/simple-interest-guide"
          className="read-guide-card"
        >
          📖 More About Simple Interest
        </Link>
      </div>
    </>
  );
}