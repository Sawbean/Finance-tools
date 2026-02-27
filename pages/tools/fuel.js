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

    const D = +distance;
    const M = +mileage;
    const P = +price;

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
            label="Distance (KM)"
            value={distance}
            onChange={setDistance}
          />
          <CalculatorInput
            label="Mileage (KM/L)"
            value={mileage}
            onChange={setMileage}
          />
          <CalculatorInput
            label="Fuel Price (Rs/L)"
            value={price}
            onChange={setPrice}
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