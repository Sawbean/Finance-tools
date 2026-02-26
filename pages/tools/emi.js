import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import CalculatorForm from "../../components/CalculatorForm";
import ResultBox from "../../components/ResultBox";
import AdPlaceholder from "../../components/AdPlaceholder";

export default function EMICalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [result, setResult] = useState(null);

  // Nepali currency formatting
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

  // EMI calculation
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
    const emi = Math.round((P * monthlyRate * Math.pow(1 + monthlyRate, N)) / (Math.pow(1 + monthlyRate, N) - 1));
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

  // Form fields for modular CalculatorForm
  const fields = [
    { type: "number", placeholder: "Loan Amount (Rs)", value: principal, onChange: (e) => setPrincipal(e.target.value), required: true },
    { type: "number", step: "0.01", placeholder: "Interest Rate (%)", value: rate, onChange: (e) => setRate(e.target.value), required: true },
    { type: "number", placeholder: "Duration (Years)", value: years, onChange: (e) => setYears(e.target.value), required: true },
  ];

  // JSON-LD structured data for SEO
  const jsonLD = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: "EMI Calculator",
    description: "Calculate your monthly EMI, total payment, and interest using our EMI calculator for loans in Nepal.",
    url: "https://finance-tools-mu.vercel.app/tools/emi",
    applicationCategory: "FinanceApplication",
    areaServed: { "@type": "Country", name: "Nepal" },
    audience: { "@type": "Audience", audienceType: "Loan Borrowers" },
    provider: { "@type": "Organization", name: "ToolFinance", url: "https://finance-tools-mu.vercel.app" },
    offers: { "@type": "Offer", price: "0", priceCurrency: "NPR" },
  };

  return (
    <>
      <Head>
        <title>EMI Calculator | ToolFinance</title>
        <meta name="description" content="Calculate your monthly EMI, total payment, and interest using our EMI calculator. Perfect for loans in Nepal." />
        <meta name="keywords" content="EMI calculator, loan EMI, monthly installment, finance calculator, Nepal loans, ToolFinance" />
        <link rel="canonical" href="https://finance-tools-mu.vercel.app/tools/emi" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLD) }} />
      </Head>

      <div className="container">
        <h1>💰 EMI Calculator</h1>
        <p style={{ textAlign: "center", marginBottom: "25px" }}>
          Enter your loan details below to calculate your monthly EMI, total payment, and total interest.
        </p>

        {/* Modular Calculator Form */}
        <CalculatorForm fields={fields} onSubmit={calculateEMI} onReset={resetForm} />

        {/* Modular Result Box */}
        {result && <ResultBox title="📊 EMI Summary" results={result} formatCurrency={nepaliCurrency} />}

        {/* Ad placeholder */}
        <AdPlaceholder />

        {/* Internal link to blog */}
        <div>
          <Link href="/blog/emi-calculator-guide" className="read-guide-card" title="Read full EMI Calculator Guide">
            📖 Read Full EMI Calculator Guide
          </Link>
        </div>
      </div>
    </>
  );
}