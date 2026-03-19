import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function HomeLoanVsRentCalculator() {
  const [homePrice, setHomePrice] = useState("");
  const [loanRate, setLoanRate] = useState("");
  const [loanYears, setLoanYears] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
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

  const calculateComparison = (e) => {
    e.preventDefault();

    const P = parseFloat(homePrice) || 0;
    const R = parseFloat(loanRate) || 0;
    const Y = parseFloat(loanYears) || 0;
    const rent = parseFloat(monthlyRent) || 0;

    if (P <= 0 || R <= 0 || R > 100 || Y <= 0 || rent < 0) {
      alert("⚠️ Please enter valid values");
      return;
    }

    const N = Y * 12;
    const monthlyRate = R / (12 * 100);
    const monthlyEMI = (P * monthlyRate * Math.pow(1 + monthlyRate, N)) /
                       (Math.pow(1 + monthlyRate, N) - 1);
    const totalLoanPayment = monthlyEMI * N;
    const totalRentPayment = rent * N;

    const difference = totalRentPayment - totalLoanPayment;

    setResult({ monthlyEMI, totalLoanPayment, totalRentPayment, difference });
  };

  const resetForm = () => {
    setHomePrice("");
    setLoanRate("");
    setLoanYears("");
    setMonthlyRent("");
    setResult(null);
  };

  return (
    <>
      <Head>
        <title>Home Loan vs Rent Calculator | ToolFinance</title>
        <meta
          name="description"
          content="Compare total cost of buying a home with loan vs paying rent in Nepal."
        />
        <link
          rel="canonical"
          href="https://finance-tools-mu.vercel.app/tools/home-loan-vs-rent"
        />
      </Head>

      <div className="container">
        <h1>🏡 Home Loan vs Rent Calculator</h1>

        <CalculatorForm onSubmit={calculateComparison} onReset={resetForm}>
          <CalculatorInput
            placeholder="Home Price (Rs)"
            value={homePrice}
            onChange={(val) => setHomePrice(val)}
          />
          <CalculatorInput
            step="0.01"
            placeholder="Loan Interest Rate (%)"
            value={loanRate}
            onChange={(val) => setLoanRate(val)}
          />
          <CalculatorInput
            placeholder="Loan Duration (Years)"
            value={loanYears}
            onChange={(val) => setLoanYears(val)}
          />
          <CalculatorInput
            placeholder="Monthly Rent (Rs)"
            value={monthlyRent}
            onChange={(val) => setMonthlyRent(val)}
          />
        </CalculatorForm>

        {result && (
          <ResultBox
            title="📊 Home Loan vs Rent Summary"
            results={{
              "Monthly EMI": nepaliCurrency(result.monthlyEMI),
              "Total Loan Payment": nepaliCurrency(result.totalLoanPayment),
              "Total Rent Payment": nepaliCurrency(result.totalRentPayment),
              "Rent vs Loan Difference": nepaliCurrency(result.difference),
            }}
          />
        )}

        <AdPlaceholder />

        <Link
          href="/blog/home-loan-vs-rent-guide"
          className="read-guide-card"
        >
          📖 Learn About Home Loan vs Rent
        </Link>
      </div>
    </>
  );
}