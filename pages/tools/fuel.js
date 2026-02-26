import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import CalculatorForm from "../../components/CalculatorForm";
import ResultBox from "../../components/ResultBox";
import AdPlaceholder from "../../components/AdPlaceholder";

export default function FuelCalculator() {
  const [distance, setDistance] = useState("");
  const [mileage, setMileage] = useState("");
  const [price, setPrice] = useState("");
  const [result, setResult] = useState(null);

  const calculateFuel = (e) => {
    e.preventDefault();

    const D = parseFloat(distance);
    const M = parseFloat(mileage);
    const P = parseFloat(price);

    if (D <= 0 || M <= 0 || P <= 0) {
      alert("⚠️ Please enter valid values");
      return;
    }

    const fuelNeeded = (D * M) / 100;
    const totalCost = Math.round(fuelNeeded * P);

    setResult({
      fuelNeeded: fuelNeeded.toFixed(2) + " L",
      totalCost: "Rs. " + totalCost.toLocaleString(),
    });
  };

  const resetForm = () => {
    setDistance("");
    setMileage("");
    setPrice("");
    setResult(null);
  };

  const fields = [
    { type: "number", placeholder: "Distance (KM)", value: distance, onChange: (e) => setDistance(e.target.value), required: true },
    { type: "number", placeholder: "Mileage (L / 100km)", value: mileage, onChange: (e) => setMileage(e.target.value), required: true },
    { type: "number", placeholder: "Fuel Price (Rs/L)", value: price, onChange: (e) => setPrice(e.target.value), required: true },
  ];

  const jsonLD = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Fuel Cost Calculator",
    description: "Estimate fuel consumption and total fuel cost for your trip in Nepal.",
    url: "https://finance-tools-mu.vercel.app/tools/fuel",
    applicationCategory: "FinanceApplication",
  };

  return (
    <>
      <Head>
        <title>Fuel Cost Calculator | ToolFinance</title>
        <meta name="description" content="Estimate fuel consumption and fuel cost using our Fuel Cost Calculator." />
        <link rel="canonical" href="https://finance-tools-mu.vercel.app/tools/fuel" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLD) }} />
      </Head>

      <div className="container">
        <h1>⛽ Fuel Cost Calculator</h1>
        <p style={{ textAlign: "center", marginBottom: "25px" }}>
          Calculate fuel consumption and total cost for your trip.
        </p>

        <CalculatorForm fields={fields} onSubmit={calculateFuel} onReset={resetForm} />

        {result && <ResultBox title="📊 Fuel Summary" results={result} />}

        <AdPlaceholder />

        <Link href="/blog/fuel-calculator-guide" className="read-guide-card">
          📖 Read Fuel Cost Guide
        </Link>
      </div>
    </>
  );
}