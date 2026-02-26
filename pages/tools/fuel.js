import { useState } from "react";
import Head from "next/head";

import CalculatorForm from "../../components/CalculatorForm";
import CalculatorInput from "../../components/CalculatorInput";
import ResultBox from "../../components/ResultBox";
import AdPlaceholder from "../../components/AdPlaceholder";

export default function FuelCalculator() {
  const [distance, setDistance] = useState("");
  const [mileage, setMileage] = useState("");
  const [fuelPrice, setFuelPrice] = useState("");
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

  const calculateFuelCost = (e) => {
    e.preventDefault();

    const D = parseFloat(distance);
    const M = parseFloat(mileage);
    const P = parseFloat(fuelPrice);

    if (D <= 0 || M <= 0 || P <= 0) {
      alert("⚠️ Please enter valid values");
      return;
    }

    const fuelRequired = D / M;
    const totalCost = fuelRequired * P;

    setResult({
      distance: `${D} km`,
      fuelRequired: `${fuelRequired.toFixed(2)} liters`,
      totalCost,
    });
  };

  const resetForm = () => {
    setDistance("");
    setMileage("");
    setFuelPrice("");
    setResult(null);
  };

  return (
    <>
      <Head>
        <title>Fuel Cost Calculator | ToolFinance</title>
        <meta
          name="description"
          content="Calculate fuel cost for your trip based on distance, mileage, and fuel price."
        />
        <link
          rel="canonical"
          href="https://finance-tools-mu.vercel.app/tools/fuel"
        />
      </Head>

      <div className="container">
        <h1>⛽ Fuel Cost Calculator</h1>

        <CalculatorForm onSubmit={calculateFuelCost} onReset={resetForm}>
          <CalculatorInput
            placeholder="Distance (km)"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
          />
          <CalculatorInput
            placeholder="Mileage (km per liter)"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
          />
          <CalculatorInput
            placeholder="Fuel Price (Rs per liter)"
            value={fuelPrice}
            onChange={(e) => setFuelPrice(e.target.value)}
          />
        </CalculatorForm>

        <AdPlaceholder />

        {result && (
          <ResultBox
            title="📊 Fuel Cost Summary"
            results={result}
            formatCurrency={nepaliCurrency}
          />
        )}
      </div>
    </>
  );
}