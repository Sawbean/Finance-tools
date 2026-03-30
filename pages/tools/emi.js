import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function EMICalculator() {
  // --- MAIN INPUT STATES ---
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [duration, setDuration] = useState("");
  const [durationType, setDurationType] = useState("years"); // Toggle: Years / Months
  const [result, setResult] = useState(null);

  // --- ADVANCED OPTIONS STATES ---
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [extraPayment, setExtraPayment] = useState("");
  const [processingFee, setProcessingFee] = useState("");
  const [insurance, setInsurance] = useState("");

  // --- FORMAT NUMBER AS NEPALI CURRENCY ---
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

  // --- CALCULATION FUNCTION ---
  const calculateEMI = () => {
    const P = parseFloat(principal) || 0;
    const R = parseFloat(rate) || 0;
    let D = parseFloat(duration) || 0;
    const extra = parseFloat(extraPayment) || 0;
    const feePercent = parseFloat(processingFee) || 0;
    const insuranceCost = parseFloat(insurance) || 0;

    if (P <= 0 || R <= 0 || R > 100 || D <= 0) return;

    // Convert duration based on type
    if (durationType === "years") D = D * 12;
    else if (durationType === "months") D = D;
    else if (durationType === "weeks") D = Math.round(D * 52 / 12);
    else if (durationType === "days") D = Math.round(D / 30);

    const monthlyRate = R / (12 * 100);
    let emi = (P * monthlyRate * Math.pow(1 + monthlyRate, D)) /
      (Math.pow(1 + monthlyRate, D) - 1);

    // Add extra payment effect
    if (extra > 0) emi += extra;

    // Total Payment
    let totalPayment = emi * D;

    // Add processing fee and insurance
    totalPayment += P * (feePercent / 100) + insuranceCost;

    const totalInterest = totalPayment - P;

    setResult({
      "Monthly EMI": emi,
      "Total Payment": totalPayment,
      "Total Interest": totalInterest
    });
  };

  // --- REAL-TIME CALCULATION ---
  useEffect(() => {
    calculateEMI();
  }, [principal, rate, duration, durationType, extraPayment, processingFee, insurance]);

  const resetForm = () => {
    setPrincipal("");
    setRate("");
    setDuration("");
    setDurationType("years");
    setExtraPayment("");
    setProcessingFee("");
    setInsurance("");
    setResult(null);
  };

  return (
    <>
      <Head>
        <title>EMI Calculator | ToolFinance</title>
        <meta
          name="description"
          content="Advanced EMI calculator with optional prepayment, fees, and insurance. Calculate monthly EMI, total payment, and interest for loans in Nepal."
        />
        <link
          rel="canonical"
          href="https://finance-tools-mu.vercel.app/tools/emi"
        />
      </Head>

      <div className="container">
        <h1>💰 Advanced EMI Calculator</h1>

        <CalculatorForm onSubmit={(e) => e.preventDefault()} onReset={resetForm} hideDefaultButton={true}  hideDefaultReset={true}>
          {/* Loan Amount */}
          <CalculatorInput
            placeholder="Loan Amount (Rs)"
            value={principal}
            onChange={setPrincipal}
          />

          {/* Interest Rate */}
          <CalculatorInput
            step="0.01"
            placeholder="Interest Rate (%)"
            value={rate}
            onChange={setRate}
          />

          {/* Duration with inline toggle */}
          <div className="duration-wrapper">
            <CalculatorInput
              placeholder="Duration"
              value={duration}
              onChange={setDuration}
            />
            <div className="duration-toggle">
              <button
                type="button"
                className={durationType === "years" ? "active" : ""}
                onClick={() => setDurationType("years")}
              >
                Years
              </button>
              <button
                type="button"
                className={durationType === "months" ? "active" : ""}
                onClick={() => setDurationType("months")}
              >
                Months
              </button>
            </div>
          </div>

          {/* Advanced Options Toggle (CENTERED) */}
          <div className="advanced-toggle center">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? "Hide Advanced Options ▲" : "Show Advanced Options ▼"}
            </button>
          </div>

          {showAdvanced && (
            <div className="advanced-options">
              <CalculatorInput
                placeholder="Extra Monthly Payment (Rs)"
                value={extraPayment}
                onChange={setExtraPayment}
              />
              <CalculatorInput
                placeholder="Processing Fee (%)"
                value={processingFee}
                onChange={setProcessingFee}
              />
              <CalculatorInput
                placeholder="Insurance (Rs)"
                value={insurance}
                onChange={setInsurance}
              />
            </div>
          )}

          {/* Buttons */}
          <div className="calculator-buttons">
            <button type="button" className="calc-btn" onClick={calculateEMI}>
              Calculate
            </button>
            <button type="button" className="reset-btn" onClick={resetForm}>
              Reset
            </button>
          </div>
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
          📖 More About EMI
        </Link>
      </div>
    </>
  );
}