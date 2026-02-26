import ToolCard from "../components/ToolCard";

export default function Home() {
  return (
    <div className="container">
      <h1>🏦 ToolFinance</h1>
      <p style={{ textAlign: "center", marginBottom: "30px" }}>
        All your finance calculators in one place!
      </p>

      <div className="tools-grid">
        <ToolCard title="EMI Calculator" link="/tools/emi" />
        <ToolCard title="Loan Calculator" link="/tools/loan" />
        <ToolCard title="Fuel Calculator" link="/tools/fuel" />
      </div>
    </div>
  );
}