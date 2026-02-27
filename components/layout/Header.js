import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleTools = () => setToolsOpen(!toolsOpen);

  return (
    <header className="site-header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <Link href="/">ToolFinance</Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>

        {/* Navigation */}
        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link href="/">Home</Link>

          {/* Tools Dropdown */}
          <div className="tools-dropdown">
            <button className="tools-btn" onClick={toggleTools}>
              Tools ▼
            </button>
            <div className={`tools-menu ${toolsOpen ? "open" : ""}`}>
              <Link href="/tools/emi">EMI Calculator</Link>
              <Link href="/tools/loan">Loan Calculator</Link>
              <Link href="/tools/fuel">Fuel Calculator</Link>
              {/* Future calculators */}
            </div>
          </div>

          <Link href="/blog">Blog</Link>
        </nav>
      </div>
    </header>
  );
}