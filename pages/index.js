import ToolCard from "../components/ui/ToolCard";

export default function Home() {
  return (
    <div className="container">
      <h1>🏦 ToolFinance</h1>
      <p>
        ToolFinance provides free online financial calculators to help you plan loans,
        estimate EMI payments, and calculate fuel costs. Use our simple tools to make
        smarter financial decisions quickly and easily.
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