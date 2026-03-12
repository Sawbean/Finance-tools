import Link from "next/link";
import Image from "next/image";
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
        {/* Logo LEFT */}
        <div className="logo">
          <Link href="/">
            <Image
              src="/images/finlogo.png"
              alt="ToolFinance Logo"
              height={110}   // Match your CSS height
              width={165}    // Adjust width to keep your logo's shape
              priority
            />
          </Link>
        </div>

        {/* Navigation RIGHT */}
        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link href="/" onClick={closeMenu}>Home</Link>

          <div className="tools-dropdown">
            <button
              className={`tools-btn ${toolsOpen ? "open" : ""}`}
              onClick={toggleTools}
            >
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

        {/* Mobile Menu Toggle */}
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>
      </div>
    </header>
  );
}