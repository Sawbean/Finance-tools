import { useState, useEffect } from "react";
import Link from "next/link";
import { useCurrency } from "../../context/CurrencyContext";
import CalculatorForm from "../../components/calculator/CalculatorForm";
import CalculatorInput from "../../components/calculator/CalculatorInput";
import ResultBox from "../../components/calculator/ResultBox";
import AdPlaceholder from "../../components/ads/AdPlaceholder";
import { tools } from '../../data/tools';
import ToolSEO from '../../components/layout/ToolSEO';
import { allToolGuides } from '../../data/tool-guides/index';

export default function FuelCalculator() {
  const { currency } = useCurrency();
  const formatCurrency = (val) => new Intl.NumberFormat(currency.locale, { style: 'currency', currency: currency.code, maximumFractionDigits: 0 }).format(val);
  
  // Automatically find the data for THIS tool
  const toolData = tools.find(t => t.link === '/tools/fuel');
  const guideData = Object.values(allToolGuides).find(g => g.tool === "fuel");
  
  // 1. STATE MANAGEMENT
  const [distance, setDistance] = useState(150);
  const [mileage, setMileage] = useState(15);
  const [price, setPrice] = useState(170); 
  const [passengers, setPassengers] = useState(1);
  const [otherCosts, setOtherCosts] = useState(0);
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // 2. CALCULATION LOGIC
  const calculateFuel = () => {
    setError("");
    const D = parseFloat(distance) || 0;
    const M = parseFloat(mileage) || 0;
    const P = parseFloat(price) || 0;
    const Pax = parseFloat(passengers) || 1;
    const extra = parseFloat(otherCosts) || 0;

    if (D <= 0 || M <= 0 || P <= 0) {
      setResult(null);
      if (distance || mileage || price) setError("Please enter valid trip details.");
      return;
    }

    const effectiveDistance = isRoundTrip ? D * 2 : D;
    const fuelNeeded = effectiveDistance / M;
    const fuelCost = fuelNeeded * P;
    const totalTripCost = fuelCost + extra;
    const costPerPerson = totalTripCost / Pax;
    const savingsPerPerson = totalTripCost - costPerPerson;

    setResult({
      "Total Trip Distance": `${effectiveDistance} KM`,
      "Fuel Required": `${fuelNeeded.toFixed(2)} Liters`,
      "Fuel Expense": Math.round(fuelCost),
      "Tolls & Parking": Math.round(extra),
      "Grand Total": Math.round(totalTripCost),
      "Cost Per Person": Math.round(costPerPerson),
      "_savings": Math.round(savingsPerPerson)
    });
  };

  useEffect(() => {
    calculateFuel();
  }, [distance, mileage, price, passengers, otherCosts, isRoundTrip]);

  const handleReset = () => {
    setError("");
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
      <ToolSEO tool={toolData} guideData={guideData} />

      <div className="container">
        <div className="tool-intro">
            <h1>⛽ Fuel & Trip Calculator</h1>
            <p>Plan your journey and split the bill with ease.</p>
        </div>

        <div className="calculator-grid">
          <div className="form-box">
            <CalculatorForm onReset={handleReset} onSubmit={(e) => e.preventDefault()} error={error}>
              <div className="input-row">
                <CalculatorInput label="Distance (One Way)" value={distance} onChange={setDistance} suffix="KM" />
                <div className="toggle-wrapper">
                    <button 
                        type="button" 
                        className={`trip-toggle-btn ${isRoundTrip ? 'active' : ''}`}
                        onClick={() => setIsRoundTrip(!isRoundTrip)}
                    >
                        {isRoundTrip ? "🔄 Round Trip" : "➡️ One Way"}
                    </button>
                </div>
              </div>

              <div className="input-row">
                <CalculatorInput label="Avg. Mileage" value={mileage} onChange={setMileage} suffix="KM/L" />
                <CalculatorInput label="Fuel Price" value={price} onChange={setPrice} icon={currency.symbol} />
              </div>

              <div className="input-row">
                <CalculatorInput label="Passengers" value={passengers} onChange={setPassengers} icon="👤" />
                <CalculatorInput label="Tolls / Parking" value={otherCosts} onChange={setOtherCosts} icon={currency.symbol} />
              </div>
            </CalculatorForm>

            <div className="guide-card-wrapper">
                <Link href="/blog/fuel-mileage-guide" className="read-guide-card">
                    📖 Mileage Guide: 10 Ways to Increase Vehicle Mileage
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox title="Trip Budget Summary" results={result} />
            ) : (
              <div className="result-box-empty">
                Enter distance and mileage to start planning.
              </div>
            )}
            <div className="sidebar-ad"><AdPlaceholder /></div>
          </div>
        </div>

        {result && (
          <div className="info-card fuel-insight-card">
              <h3>💡 Pro Tip: Optimize Your Journey</h3>
              <p className="info-text">
                  For your trip, splitting the cost between 
                  <strong> {passengers} {passengers > 1 ? 'people' : 'person'}</strong> saves everyone 
                  <strong> {result["_savings"] ? formatCurrency(result["_savings"]) : "---"}</strong>. 
                  <br /><br />
                  To further reduce your 
                  <strong> {formatCurrency(result["Fuel Expense"])}</strong> fuel expense, 
                  try maintaining a steady speed and avoiding rapid acceleration.
              </p>
          </div>
        )}
      </div>
    </>
  );
}