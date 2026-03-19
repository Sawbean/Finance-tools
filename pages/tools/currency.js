// pages/tools/currency.js
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [result, setResult] = useState(null);

  const nepaliCurrency = (num) => {
    num = Math.round(num * 100) / 100;
    return num.toLocaleString("en-IN", { minimumFractionDigits: 2 });
  };

  const convertCurrency = (e) => {
    e.preventDefault();
    const A = parseFloat(amount) || 0;
    const R = parseFloat(rate) || 0;

    if (A <= 0 || R <= 0) {
      alert("⚠️ Please enter valid values");
      return;
    }

    const converted = A * R;
    setResult({ converted });
  };

  const resetForm = () => {
    setAmount("");
    setRate("");
    setResult(null);
  };

  return (
    <>
      <Head>
        <title>Currency Converter | ToolFinance</title>
        <meta
          name="description"
          content="Convert money between currencies with this simple and accurate online currency converter."
        />
        <link
          rel="canonical"
          href="https://finance-tools-mu.vercel.app/tools/currency"
        />
      </Head>

      <div className="container">
        <h1>💱 Currency Converter</h1>

        <CalculatorForm onSubmit={convertCurrency} onReset={resetForm}>
          <CalculatorInput
            placeholder="Amount"
            value={amount}
            onChange={(val) => setAmount(val)}
          />
          <CalculatorInput
            placeholder="Exchange Rate"
            value={rate}
            onChange={(val) => setRate(val)}
          />
        </CalculatorForm>

        <AdPlaceholder />

        {result && (
          <ResultBox
            title="📊 Conversion Result"
            results={{
              "Converted Amount": nepaliCurrency(result.converted),
            }}
          />
        )}

        <Link
          href="/blog/currency-converter-guide"
          className="read-guide-card"
        >
          📖 More About Currency Conversion
        </Link>
      </div>
    </>
  );
}