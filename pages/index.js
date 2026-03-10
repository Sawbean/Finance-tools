// pages/index.js
import ToolCard from "../components/ui/ToolCard";

export default function Home() {
  return (
    <div className="container">
      <h1>🏦 ToolFinance</h1>

      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
        Free Online Financial Calculators
      </h2>

      <p style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto 25px auto" }}>
        ToolFinance provides free and easy-to-use financial calculators to help
        you plan loans, estimate EMI payments, and calculate fuel costs for
        trips or daily commuting. Our tools are designed to simplify financial
        planning and help you make smarter money decisions.
      </p>

      <p style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto 35px auto" }}>
        Start using tools like our <a href="/tools/emi">EMI Calculator</a>,{" "}
        <a href="/tools/loan">Loan Calculator</a>, and{" "}
        <a href="/tools/fuel">Fuel Cost Calculator</a> to better understand
        your financial commitments.
      </p>

      <div className="tools-grid">
        <ToolCard title="EMI Calculator" link="/tools/emi" />
        <ToolCard title="Loan Calculator" link="/tools/loan" />
        <ToolCard title="Fuel Calculator" link="/tools/fuel" />
        <ToolCard title="Financial Blog" link="/blog" />
      </div>
    </div>
  );
}