import { useState, useEffect } from "react";
import Link from "next/link";

// Import global utilities
import { formatCurrency, globalCurrency } from "../../utils/formatters";  
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
   const formatValue = (val) => new Intl.NumberFormat(currency.locale).format(val);
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
      "Fuel Expense": `${currency.symbol}${formatValue(Math.round(fuelCost))}`,
      "Tolls & Parking": `${currency.symbol}${formatValue(Math.round(extra))}`,
      "Grand Total": `${currency.symbol}${formatValue(Math.round(totalTripCost))}`,
      "Cost Per Person": `${currency.symbol}${formatValue(Math.round(costPerPerson))}`
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
      <ToolSEO tool={toolData} guideData={guideData} />

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
                <CalculatorInput label="Fuel Price" value={price} onChange={setPrice} icon={currency.symbol} />
              </div>

              <div className="input-row">
                <CalculatorInput label="Passengers" value={passengers} onChange={setPassengers} icon="👤" />
                <CalculatorInput label="Tolls / Parking" value={otherCosts} onChange={setOtherCosts} icon={currency.symbol} />
              </div>
            </CalculatorForm>

            <div style={{marginTop: '25px'}}>
                <Link href="/blog/fuel-mileage-guide" className="read-guide-card" style={{display: 'block', textDecoration: 'none'}}>
                    📖 Mileage Guide: 10 Ways to Increase Vehicle Mileage
                </Link>
            </div>
          </div>

          <div className="result-side">
            {result ? (
              <ResultBox title="Trip Budget Summary" results={result}  />
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
                  For your {effectiveDistance} KM trip, splitting the cost between 
                  <strong> {passengers} people</strong> saves everyone 
                  <strong> {currency.symbol}{formatValue(Math.round(totalTripCost - costPerPerson))}</strong> 
                  compared to driving alone. To further reduce your 
                  <strong> {currency.symbol}{formatValue(Math.round(fuelCost))}</strong> fuel expense, 
                  try maintaining a steady speed and avoiding rapid acceleration.
              </p>
        </div>
      </div>
    </>
  );
}