import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function FuelCalculator() {
  const [distance, setDistance] = useState("");
  const [mileage, setMileage] = useState("");
  const [price, setPrice] = useState("");
  const [result, setResult] = useState(null);

  const formatCurrency = (num) => Math.round(num).toLocaleString("en-IN");

  const calculateFuel = (e) => {
    e.preventDefault();

    const D = parseFloat(distance) || 0;
    const M = parseFloat(mileage) || 0;
    const P = parseFloat(price) || 0;

    if (D <= 0 || M <= 0 || P <= 0) {
      alert("Enter valid values");
      return;
    }

    const fuelNeeded = D / M;
    const totalCost = fuelNeeded * P;

    setResult({
      fuelRequired: `${fuelNeeded.toFixed(2)} liters`,
      totalCost: Math.round(totalCost),
    });
  };

  const resetForm = () => {
    setDistance("");
    setMileage("");
    setPrice("");
    setResult(null);
  };

  return (
    <>
      <Head>
        <title>Fuel Cost Calculator | ToolFinance</title>
        <meta
          name="description"
          content="Calculate fuel consumption and travel cost in Nepal."
        />
        <link
          rel="canonical"
          href="https://finance-tools-mu.vercel.app/tools/fuel"
        />
      </Head>

      <div className="container">
        <h1>⛽ Fuel Cost Calculator</h1>

        <CalculatorForm onSubmit={calculateFuel} onReset={resetForm}>
          <CalculatorInput
            placeholder="Distance (KM)"
            value={distance}
            onChange={(val) => setDistance(val)}
          />
          <CalculatorInput
            placeholder="Mileage (KM/L)"
            value={mileage}
            onChange={(val) => setMileage(val)}
          />
          <CalculatorInput
            placeholder="Fuel Price (Rs/L)"
            value={price}
            onChange={(val) => setPrice(val)}
          />
        </CalculatorForm>

        <AdPlaceholder />

        {result && (
          <ResultBox
            title="Fuel Cost Summary"
            results={result}
            formatCurrency={formatCurrency}
          />
        )}

        <Link href="/blog/fuel-calculator-guide" className="read-guide-card">
          📖 Read Fuel Calculator Guide
        </Link>
      </div>
    </>
  );
}