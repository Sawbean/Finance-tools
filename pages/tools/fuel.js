import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

// Import global utilities
import { formatCurrency, globalCurrency } from "../../utils/formatters"; 

import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function FuelCalculator() {
  // 1. STATE MANAGEMENT
  const [distance, setDistance] = useState(150);
  const [mileage, setMileage] = useState(15);
  const [price, setPrice] = useState(170); 
  const [passengers, setPassengers] = useState(1);
  const [otherCosts, setOtherCosts] = useState(0);
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [result, setResult] = useState(null);

  // 2. CALCULATION LOGIC
  const calculateFuel = () => {
    const D = parseFloat(distance) || 0;
    const M = parseFloat(mileage) || 0;
    const P = parseFloat(price) || 0;
    const Pax = parseFloat(passengers) || 1;
    const extra = parseFloat(otherCosts) || 0;

    if (D <= 0 || M <= 0 || P <= 0) return;

    const effectiveDistance = isRoundTrip ? D * 2 : D;
    const fuelNeeded = effectiveDistance / M;
    const fuelCost = fuelNeeded * P;
    const totalTripCost = fuelCost + extra;
    const costPerPerson = totalTripCost / Pax;

    setResult({
      "Total Trip Distance": `${effectiveDistance} KM`,
      "Fuel Required": `${fuelNeeded.toFixed(2)} Liters`,
      "Fuel Expense": fuelCost,
      "Tolls & Parking": extra,
      "Grand Total": totalTripCost,
      "Cost Per Person": costPerPerson
    });
  };

  useEffect(() => {
    calculateFuel();
  }, [distance, mileage, price, passengers, otherCosts, isRoundTrip]);

  // Clean Reset Function
  const handleReset = () => {
    setDistance(""); 
    setMileage(""); 
    setPrice(170); 
    setPassengers(1); 
    setOtherCosts(""); 
    setIsRoundTrip(false);
    setResult(null);
  };

  return (
    <>
      <Head>
        <title>Fuel Cost Calculator | Trip Expense Splitter | ToolFinance</title>
        <meta name="description" content="Calculate fuel consumption, total trip costs, and split expenses among passengers instantly." />
      </Head>

      <div className="container">
        <div className="tool-intro" style={{textAlign: 'center', marginBottom: '30px'}}>
            <h1 style={{fontSize: '2.5rem', color: 'var(--primary)'}}>⛽ Fuel & Trip Calculator</h1>
            <p style={{color: '#666'}}>Plan your journey and split the bill with ease.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            {/* The reset button is handled inside this component now */}
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()}>
              
              <div className="input-row">
                <CalculatorInput label="Distance (One Way)" value={distance} onChange={setDistance} suffix="KM" />
                <div className="toggle-container" style={{flex: 1, paddingTop: '28px'}}>
                    <button 
                        type="button" 
                        onClick={() => setIsRoundTrip(!isRoundTrip)}
                        style={{
                            width: '100%', padding: '12px', borderRadius: '10px', 
                            border: `2px solid ${isRoundTrip ? 'var(--primary)' : '#e2e8f0'}`,
                            background: isRoundTrip ? 'var(--primary)' : '#fff',
                            color: isRoundTrip ? '#fff' : '#475569',
                            fontWeight: 'bold', transition: '0.3s', cursor: 'pointer'
                        }}
                    >
                        {isRoundTrip ? "🔄 Round Trip" : "➡️ One Way"}
                    </button>
                </div>
              </div>

              <div className="input-row">
                <CalculatorInput label="Avg. Mileage" value={mileage} onChange={setMileage} suffix="KM/L" />
                <CalculatorInput label="Fuel Price" value={price} onChange={setPrice} icon={globalCurrency} />
              </div>

              <div className="input-row">
                <CalculatorInput label="Passengers" value={passengers} onChange={setPassengers} icon="👤" />
                <CalculatorInput label="Tolls / Parking" value={otherCosts} onChange={setOtherCosts} icon={globalCurrency} />
              </div>
            </CalculatorForm>

            <div style={{marginTop: '25px'}}>
                <Link href="/blog/fuel-efficiency-guide" className="read-guide-card" style={{display: 'block', textDecoration: 'none'}}>
                    📖 Mileage Guide: 10 Ways to Increase Vehicle Mileage
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox title="Trip Budget Summary" results={result} formatCurrency={formatCurrency} />
            ) : (
              <div className="result-box" style={{background: '#f8fafc', color: '#64748b', textAlign: 'center'}}>
                Enter distance and mileage to start planning.
              </div>
            )}
            <div className="sidebar-ad"><AdPlaceholder /></div>
          </div>
        </div>

        <div className="info-card" style={{marginTop: '40px', padding: '25px', background: '#ecfdf5', borderRadius: '12px', border: '1px solid #a7f3d0'}}>
            <h3 style={{color: '#065f46', marginBottom: '10px'}}>💡 Pro Tip: Optimize Your Journey</h3>
            <p style={{fontSize: '0.9rem', color: '#065f46', lineHeight: '1.6'}}>
                Driving at a steady speed of 60-80 KM/H can improve fuel efficiency by up to 20%. Removing unnecessary weight and keeping tires properly inflated also reduces fuel consumption.
            </p>
        </div>
      </div>
    </>
  );
}