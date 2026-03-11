import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleTools = () => setToolsOpen(!toolsOpen);

  const closeMenu = () => {
    setMenuOpen(false);
    setToolsOpen(false);
  };

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
          <Link href="/" onClick={closeMenu}>Home</Link>

          {/* Tools Dropdown */}
          <div className="tools-dropdown">
            <button className={`tools-btn ${toolsOpen ? "open" : ""}`} onClick={toggleTools}>
              Tools
              <svg viewBox="0 0 10 10" fill="currentColor">
                <polygon points="0,0 10,0 5,6" />
              </svg>
            </button>
            <div className={`tools-menu ${toolsOpen ? "open" : ""}`}>
              <Link href="/tools/emi" onClick={closeMenu}>EMI Calculator</Link>
              <Link href="/tools/loan" onClick={closeMenu}>Loan Calculator</Link>
              <Link href="/tools/fuel" onClick={closeMenu}>Fuel Calculator</Link>
            </div>
          </div>

          <Link href="/blog" onClick={closeMenu}>Financial Blog</Link>
        </nav>
      </div>
    </header>
  );
}