import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import AdPlaceholder from "../../components/AdPlaceholder";

export default function FuelCalculator() {
  const [distance, setDistance] = useState("");
  const [efficiency, setEfficiency] = useState("");
  const [fuelPrice, setFuelPrice] = useState("");
  const [result, setResult] = useState(null);

  const calculateFuel = (e) => {
    e.preventDefault();
    const D = parseFloat(distance);
    const E = parseFloat(efficiency);
    const P = parseFloat(fuelPrice);

    if (D <= 0 || E <= 0 || P <= 0) {
      alert("⚠️ Please enter valid values");
      return;
    }

    const fuelUsed = D / E;
    const totalCost = fuelUsed * P;
    setResult({ fuelUsed, totalCost });
  };

  const resetForm = () => {
    setDistance("");
    setEfficiency("");
    setFuelPrice("");
    setResult(null);
  };

  const jsonLD = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: "Fuel Cost Calculator",
    description: "Calculate fuel cost for your trip using distance, mileage, and fuel price in Nepal.",
    url: "https://finance-tools-mu.vercel.app/tools/fuel",
    applicationCategory: "FinanceApplication",
    provider: { "@type": "Organization", name: "ToolFinance", url: "https://finance-tools-mu.vercel.app" },
  };

  return (
    <>
      <Head>
        <title>Fuel Cost Calculator | ToolFinance</title>
        <meta
          name="description"
          content="Use our Fuel Calculator to estimate fuel consumption and total cost for your trip. Perfect for vehicle owners in Nepal."
        />
        <meta
          name="keywords"
          content="Fuel calculator, fuel cost calculator, mileage calculator, trip cost, Nepal, ToolFinance"
        />
        <link
          rel="canonical"
          href="https://finance-tools-mu.vercel.app/tools/fuel"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLD) }}
        />
      </Head>

      <div className="container">
        <h1>⛽ Fuel Cost Calculator</h1>
        <p style={{ textAlign: "center", marginBottom: "25px" }}>
          Enter your travel distance, vehicle mileage, and fuel price to calculate your fuel consumption and total cost.
        </p>

        <form onSubmit={calculateFuel} className="form-box">
          <input
            type="number"
            placeholder="Distance (km)"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Vehicle Mileage (km/l)"
            value={efficiency}
            onChange={(e) => setEfficiency(e.target.value)}
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Fuel Price (Rs/l)"
            value={fuelPrice}
            onChange={(e) => setFuelPrice(e.target.value)}
            required
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" style={{ flex: 1 }}>Calculate</button>
            <button
              type="button"
              onClick={resetForm}
              style={{ flex: 1, background: "#f0e68c", color: "#0a2a66" }}
            >
              Reset
            </button>
          </div>
        </form>

        {/* ✅ Ad Placeholder */}
        <AdPlaceholder />

        {result && (
          <div className="result-box">
            <h2>📊 Fuel Summary</h2>
            <p><strong>Fuel Used:</strong> {result.fuelUsed.toFixed(2)} L</p>
            <p><strong>Total Cost:</strong> Rs. {result.totalCost.toFixed(2)}</p>
          </div>
        )}

        <div>
          <Link
            href="/blog/fuel-calculator-guide"
            title="Read full Fuel Calculator Guide"
            aria-label="Read full Fuel Calculator Guide"
            className="read-guide-card"
          >
            📖 Read Full Fuel Calculator Guide
          </Link>
        </div>
      </div>
    </>
  );
}