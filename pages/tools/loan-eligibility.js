import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function LoanEligibilityCalculator() {
  const [income, setIncome] = useState("");
  const [existingEMI, setExistingEMI] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
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

  const calculateEligibility = (e) => {
    e.preventDefault();
    const monthlyIncome = parseFloat(income) || 0;
    const currentEMI = parseFloat(existingEMI) || 0;
    const rate = parseFloat(interestRate) || 0;
    const years = parseFloat(loanTerm) || 0;

    if (
      monthlyIncome <= 0 ||
      currentEMI < 0 ||
      rate <= 0 ||
      rate > 100 ||
      years <= 0
    ) {
      alert("⚠️ Please enter valid values");
      return;
    }

    const maxEMI = monthlyIncome * 0.5 - currentEMI; // banks usually allow 50% of income
    const n = years * 12;
    const r = rate / (12 * 100);

    const eligibleLoan = (maxEMI * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));

    setResult({ eligibleLoan: eligibleLoan, maxEMI: maxEMI });
  };

  const resetForm = () => {
    setIncome("");
    setExistingEMI("");
    setInterestRate("");
    setLoanTerm("");
    setResult(null);
  };

  return (
    <>
      <Head>
        <title>Loan Eligibility Calculator | ToolFinance</title>
        <meta
          name="description"
          content="Check your loan eligibility based on your income, existing EMIs, interest rate, and loan term."
        />
        <link
          rel="canonical"
          href="https://finance-tools-mu.vercel.app/tools/loan-eligibility"
        />
      </Head>

      <div className="container">
        <h1>🏦 Loan Eligibility Calculator</h1>

        <CalculatorForm onSubmit={calculateEligibility} onReset={resetForm}>
          <CalculatorInput
            placeholder="Monthly Income (Rs)"
            value={income}
            onChange={(val) => setIncome(val)}
          />
          <CalculatorInput
            placeholder="Existing EMI (Rs)"
            value={existingEMI}
            onChange={(val) => setExistingEMI(val)}
          />
          <CalculatorInput
            step="0.01"
            placeholder="Interest Rate (%)"
            value={interestRate}
            onChange={(val) => setInterestRate(val)}
          />
          <CalculatorInput
            placeholder="Loan Term (Years)"
            value={loanTerm}
            onChange={(val) => setLoanTerm(val)}
          />
        </CalculatorForm>

        <AdPlaceholder />

        {result && (
          <ResultBox
            title="📊 Loan Eligibility Summary"
            results={{
              "Eligible Loan Amount": nepaliCurrency(result.eligibleLoan),
              "Max Monthly EMI": nepaliCurrency(result.maxEMI),
            }}
          />
        )}

        <Link
          href="/blog/loan-eligibility-guide"
          className="read-guide-card"
        >
          📖 Learn About Loan Eligibility
        </Link>
      </div>
    </>
  );
}