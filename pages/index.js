import ToolCard from "../components/ui/ToolCard";

export default function Home() {
  return (
    <div className="container">

      <h1>Free Online Financial Calculators</h1>

      <p>
        ToolFinance provides simple and accurate financial calculators to help you
        estimate EMI payments, plan loans, and calculate fuel costs. Use our tools
        to make smarter financial decisions quickly and easily.
      </p>

      <h2 className="home-section-title">Popular Financial Tools</h2>

      <div className="tools-grid">
        <ToolCard title="EMI Calculator" link="/tools/emi" />
        <ToolCard title="Loan Calculator" link="/tools/loan" />
        <ToolCard title="Fuel Calculator" link="/tools/fuel" />
        <ToolCard title="Financial Blog" link="/blog" />
      </div>

    </div>
  );
}