import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import CalculatorForm from "../../components/CalculatorForm";
import ResultBox from "../../components/ResultBox";
import AdPlaceholder from "../../components/AdPlaceholder";

export default function LoanCalculator() {
  const [amount, setAmount] = useState("");
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

  const calculateLoan = (e) => {
    e.preventDefault();
    const P = parseFloat(amount);
    const R = parseFloat(rate);
    const Y = parseFloat(years);

    if (P <= 0 || R <= 0 || R > 100 || Y <= 0) {
      alert("⚠️ Please enter valid values");
      return;
    }

    const totalInterest = Math.round((P * R * Y) / 100);
    const totalPayment = Math.round(P + totalInterest);
    const monthlyPayment = Math.round(totalPayment / (Y * 12));

    setResult({ monthlyPayment, totalInterest, totalPayment });
  };

  const resetForm = () => {
    setAmount("");
    setRate("");
    setYears("");
    setResult(null);
  };

  const fields = [
    { type: "number", placeholder: "Loan Amount (Rs)", value: amount, onChange: (e) => setAmount(e.target.value), required: true },
    { type: "number", step: "0.01", placeholder: "Interest Rate (%)", value: rate, onChange: (e) => setRate(e.target.value), required: true },
    { type: "number", placeholder: "Loan Duration (Years)", value: years, onChange: (e) => setYears(e.target.value), required: true },
  ];

  const jsonLD = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: "Loan Calculator",
    description: "Calculate monthly loan payment, total interest, and total payment for loans in Nepal.",
    url: "https://finance-tools-mu.vercel.app/tools/loan",
    applicationCategory: "FinanceApplication",
    areaServed: { "@type": "Country", name: "Nepal" },
    provider: { "@type": "Organization", name: "ToolFinance" },
  };

  return (
    <>
      <Head>
        <title>Loan Calculator | ToolFinance</title>
        <meta name="description" content="Calculate monthly loan payment, total interest, and total payment using our Loan Calculator for Nepal." />
        <link rel="canonical" href="https://finance-tools-mu.vercel.app/tools/loan" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLD) }} />
      </Head>

      <div className="container">
        <h1>🏦 Loan Calculator</h1>
        <p style={{ textAlign: "center", marginBottom: "25px" }}>
          Calculate your monthly loan payment, total interest, and total payable amount.
        </p>

        <CalculatorForm fields={fields} onSubmit={calculateLoan} onReset={resetForm} />

        {result && <ResultBox title="📊 Loan Summary" results={result} formatCurrency={nepaliCurrency} />}

        <AdPlaceholder />

        <Link href="/blog/loan-calculator-guide" className="read-guide-card">
          📖 Read Loan Calculator Guide
        </Link>
      </div>
    </>
  );
}