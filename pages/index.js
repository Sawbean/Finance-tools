// pages/index.js
import ToolCard from "../components/ui/ToolCard";

export default function Home() {
  return (
    <div className="container">
      <h1>🏦 ToolFinance</h1>
      <p>All your finance calculators and guides in one place!</p>

      <div className="tools-grid">
        <ToolCard title="EMI Calculator" link="/tools/emi" />
        <ToolCard title="Loan Calculator" link="/tools/loan" />
        <ToolCard title="Fuel Calculator" link="/tools/fuel" />
        <ToolCard title="Financial Blog" link="/blog" /> {/* Added Blog card */}
      </div>
    </div>
  );
}