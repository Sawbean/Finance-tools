// pages/tools/loan.js
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [result, setResult] = useState(null);

  // Format number in Nepali/Indian style (Rs.)
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
    const P = parseFloat(principal);
    const R = parseFloat(rate);
    const Y = parseFloat(years);

    if (P <= 0 || R <= 0 || R > 100 || Y <= 0) {
      alert("⚠️ Please enter valid values");
      return;
    }

    const N = Y * 12;
    const monthlyRate = R / (12 * 100);
    const emi = Math.round(
      (P * monthlyRate * Math.pow(1 + monthlyRate, N)) /
        (Math.pow(1 + monthlyRate, N) - 1)
    );
    const totalPayment = Math.round(emi * N);
    const totalInterest = Math.round(totalPayment - P);

    setResult({ emi, totalPayment, totalInterest });
  };

  const resetForm = () => {
    setPrincipal("");
    setRate("");
    setYears("");
    setResult(null);
  };

  const jsonLD = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": "Loan Calculator",
    "description":
      "Calculate your loan EMI, total payment, and interest using our simple Loan calculator for Nepal loans.",
    "url": "https://yourdomain.com/tools/loan",
    "applicationCategory": "FinanceApplication",
    "provider": {
      "@type": "Organization",
      "name": "ToolFinance",
      "url": "https://yourdomain.com"
    }
  };

  return (
    <>
      <Head>
        <title>Loan Calculator | ToolFinance</title>
        <meta
          name="description"
          content="Use our Loan Calculator to calculate monthly EMI, total payment, and interest. Ideal for planning loans in Nepal."
        />
        <meta
          name="keywords"
          content="Loan calculator, EMI calculator, monthly installment, interest calculation, Nepal loans, ToolFinance"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLD) }}
        />
      </Head>

      <div className="container">
        <h1>🏦 Loan Calculator</h1>
        <p style={{ textAlign: "center", marginBottom: "25px" }}>
          Enter your loan amount, interest rate, and duration to calculate your monthly payment, total payment, and total interest.
        </p>

        <form onSubmit={calculateLoan} className="form-box">
          <input
            type="number"
            placeholder="Loan Amount (Rs)"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Interest Rate (%)"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Duration (Years)"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            required
          />

          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" style={{ flex: 1 }}>
              Calculate
            </button>
            <button
              type="button"
              onClick={resetForm}
              style={{ flex: 1, background: "#f0e68c", color: "#0a2a66" }}
            >
              Reset
            </button>
          </div>
        </form>

        {result && (
          <div className="result-box">
            <h2>📊 Loan Summary</h2>
            <p>
              <strong>Monthly EMI:</strong> Rs. {nepaliCurrency(result.emi)}
            </p>
            <p>
              <strong>Total Payment:</strong> Rs. {nepaliCurrency(result.totalPayment)}
            </p>
            <p>
              <strong>Total Interest:</strong> Rs. {nepaliCurrency(result.totalInterest)}
            </p>
          </div>
        )}

        {/* Read Full Guide Link (Always Visible) */}
        <div>
          <Link
            href="/blog/loan-calculator-guide"
            title="Read full Loan Calculator Guide"
            aria-label="Read full Loan Calculator Guide"
            className="read-guide-card"
          >
            📖 Read Full Loan Calculator Guide
          </Link>
        </div>
      </div>
    </>
  );
}