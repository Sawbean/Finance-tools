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
  const [distance, setDistance] = useState(100);
  const [mileage, setMileage] = useState(15);
  const [price, setPrice] = useState(1.5);
  const [passengers, setPassengers] = useState(1);
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [result, setResult] = useState(null);

  // 2. CALCULATION LOGIC
  const calculateFuel = () => {
    const D = parseFloat(distance) || 0;
    const M = parseFloat(mileage) || 0;
    const P = parseFloat(price) || 0;
    const Pax = parseFloat(passengers) || 1;

    if (D <= 0 || M <= 0 || P <= 0) return;

    // Adjust distance for Round Trip
    const effectiveDistance = isRoundTrip ? D * 2 : D;
    
    const fuelNeeded = effectiveDistance / M;
    const totalCost = fuelNeeded * P;
    const costPerPerson = totalCost / Pax;

    setResult({
      "Total Distance": `${effectiveDistance} KM`,
      "Fuel Required": `${fuelNeeded.toFixed(2)} Liters`,
      "Total Trip Cost": totalCost, // Formatter will handle the symbol
      "Cost Per Person": costPerPerson
    });
  };

  const resetForm = () => {
    setDistance("");
    setMileage("");
    setPrice("");
    setPassengers(1);
    setIsRoundTrip(false);
    setResult(null);
  };

  // Auto-calculate for better User Experience
  useEffect(() => {
    calculateFuel();
  }, [distance, mileage, price, passengers, isRoundTrip]);

  return (
    <>
      <Head>
        <title>Fuel Cost Calculator | Trip Expense Planner | ToolFinance</title>
        <meta name="description" content="Estimate trip fuel costs, consumption, and split expenses among passengers with our global fuel calculator." />
      </Head>

      <div className="container">
        {/* HEADER SECTION */}
        <div className="tool-intro" style={{textAlign: 'center', marginBottom: '30px'}}>
            <h1 style={{fontSize: '2.5rem', color: 'var(--primary)'}}>⛽ Fuel Cost Calculator</h1>
            <p style={{color: '#666'}}>Calculate trip expenses and split costs with friends easily.</p>
        </div>

        <div className="calculator-grid">
          
          {/* LEFT COLUMN: INPUTS */}
          <div className="form-box">
            <CalculatorForm 
              onSubmit={(e) => {
                e.preventDefault();
                calculateFuel();
              }}
              customButtons={
                <>
                  <button type="submit" className="calc-btn">Calculate Trip</button>
                  <button type="button" className="reset-btn" onClick={resetForm}>Reset</button>
                </>
              }
            >
              
              <CalculatorInput
                label="Trip Distance"
                value={distance}
                onChange={setDistance}
                suffix="KM"
              />

              <div className="input-row">
                <CalculatorInput
                  label="Vehicle Mileage"
                  value={mileage}
                  onChange={setMileage}
                  suffix="KM/L"
                />
                <CalculatorInput
                  label="Fuel Price (per L)"
                  value={price}
                  onChange={setPrice}
                  icon={globalCurrency}
                />
              </div>

              {/* Extra Logic for Travelers & Round Trip */}
              <div className="input-row" style={{marginTop: '15px'}}>
                <CalculatorInput
                  label="Number of Passengers"
                  value={passengers}
                  onChange={setPassengers}
                  icon="👤"
                />
                <div className="tenure-group">
                    <label className="input-label">Trip Type</label>
                    <div className="toggle-wrapper" style={{padding: '10px', background: '#f1f5f9', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', border: isRoundTrip ? '2px solid var(--primary)' : '1px solid #d1d5db'}} onClick={() => setIsRoundTrip(!isRoundTrip)}>
                        <input type="checkbox" checked={isRoundTrip} onChange={() => {}} style={{cursor: 'pointer'}} />
                        <span style={{fontSize: '0.9rem', fontWeight: 'bold'}}>{isRoundTrip ? "Round Trip (Back & Forth)" : "One Way"}</span>
                    </div>
                </div>
              </div>

            </CalculatorForm>
          </div>

          {/* RIGHT COLUMN: RESULTS & SIDEBAR */}
          <div className="result-side">
            {result ? (
              <ResultBox
                title="Trip Estimate"
                results={result}
                formatCurrency={formatCurrency}
              />
            ) : (
              <div className="result-box" style={{background: '#f8fafc', color: '#64748b', textAlign: 'center'}}>
                Enter travel details to see the cost breakdown
              </div>
            )}
            
            <div className="sidebar-ad">
               <AdPlaceholder />
            </div>

            <Link href="/blog/fuel-calculator-guide" className="sidebar-guide-link">
                📖 Tips to Improve Your Fuel Efficiency
            </Link>
          </div>
          
        </div>
      </div>
    </>
  );
}