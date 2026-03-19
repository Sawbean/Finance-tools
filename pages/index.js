// pages/index.js
import ToolCard from "../components/ui/ToolCard";
import { tools } from "../data/tools";

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
        {tools.map((tool) => (
          <ToolCard key={tool.link} title={tool.title} link={tool.link} />
        ))}
      </div>

    </div>
  );
}