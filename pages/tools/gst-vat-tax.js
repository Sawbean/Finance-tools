// pages/tools/gst-vat-tax.js
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function GSTVATTaxCalculator() {
  const [amount, setAmount] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [result, setResult] = useState(null);

  const nepaliCurrency = (num) => {
    num = Math.round(num * 100) / 100;
    return num.toLocaleString("en-IN", { minimumFractionDigits: 2 });
  };

  const calculateTax = (e) => {
    e.preventDefault();
    const A = parseFloat(amount) || 0;
    const R = parseFloat(taxRate) || 0;

    if (A <= 0 || R < 0) {
      alert("⚠️ Please enter valid values");
      return;
    }

    const tax = (A * R) / 100;
    const totalAmount = A + tax;

    setResult({ tax, totalAmount });
  };

  const resetForm = () => {
    setAmount("");
    setTaxRate("");
    setResult(null);
  };

  return (
    <>
      <Head>
        <title>GST / VAT / Tax Calculator | ToolFinance</title>
        <meta
          name="description"
          content="Calculate GST, VAT, or any tax on your amount and get the total payable amount instantly."
        />
        <link
          rel="canonical"
          href="https://finance-tools-mu.vercel.app/tools/gst-vat-tax"
        />
      </Head>

      <div className="container">
        <h1>💵 GST / VAT / Tax Calculator</h1>

        <CalculatorForm onSubmit={calculateTax} onReset={resetForm}>
          <CalculatorInput
            placeholder="Amount (Rs)"
            value={amount}
            onChange={(val) => setAmount(val)}
          />
          <CalculatorInput
            placeholder="Tax Rate (%)"
            value={taxRate}
            onChange={(val) => setTaxRate(val)}
          />
        </CalculatorForm>

        <AdPlaceholder />

        {result && (
          <ResultBox
            title="📊 Tax Calculation Result"
            results={{
              "Tax Amount": nepaliCurrency(result.tax),
              "Total Amount": nepaliCurrency(result.totalAmount),
            }}
          />
        )}

        <Link
          href="/blog/gst-vat-tax-guide"
          className="read-guide-card"
        >
          📖 More About GST / VAT / Tax
        </Link>
      </div>
    </>
  );
}