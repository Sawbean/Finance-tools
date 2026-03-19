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
        {/* Logo */}
        <div className="logo">
          <Link href="/" onClick={closeMenu}>
            <Image
              src="/images/finlogo.png"
              alt="ToolFinance Logo"
              height={50}
              width={165}
              priority
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link href="/" onClick={closeMenu}>Home</Link>

          <div className="tools-dropdown">
            <button className={`tools-btn ${toolsOpen ? "open" : ""}`} onClick={toggleTools}>
              Tools
              <svg viewBox="0 0 10 10" fill="currentColor">
                <polygon points="0,0 10,0 5,6" />
              </svg>
            </button>

            <div className={`tools-menu ${toolsOpen ? "open" : ""}`}>
              <div className="tools-column">
                <div className="tools-category">Loans & EMI</div>
                <Link href="/tools/emi" onClick={closeMenu}>EMI Calculator</Link>
                <Link href="/tools/mortgage" onClick={closeMenu}>Mortgage Calculator</Link>
                <Link href="/tools/loan" onClick={closeMenu}>Loan Calculator</Link>
                <Link href="/tools/home-loan-vs-rent" onClick={closeMenu}>Home Loan vs Rent</Link>
                <Link href="/tools/loan-eligibility" onClick={closeMenu}>Loan Eligibility</Link>
              </div>

              <div className="tools-column">
                <div className="tools-category">Investments & Savings</div>
                <Link href="/tools/sip" onClick={closeMenu}>SIP Calculator</Link>
                <Link href="/tools/compound-interest" onClick={closeMenu}>Compound Interest</Link>
                <Link href="/tools/fd-rd-calculator" onClick={closeMenu}>FD & RD Calculator</Link>
                <Link href="/tools/ppf-nps-calculator" onClick={closeMenu}>PPF / NPS Calculator</Link>
                <Link href="/tools/retirement" onClick={closeMenu}>Retirement Calculator</Link>
                <Link href="/tools/savings-goal" onClick={closeMenu}>Savings Goal</Link>
              </div>

              <div className="tools-column">
                <div className="tools-category">Taxes & Financial Planning</div>
                <Link href="/tools/income-tax" onClick={closeMenu}>Income Tax Calculator</Link>
                <Link href="/tools/gst-vat-tax" onClick={closeMenu}>GST / VAT / Tax</Link>
                <Link href="/tools/net-worth" onClick={closeMenu}>Net Worth Calculator</Link>
                <Link href="/tools/credit-card-payoff" onClick={closeMenu}>Credit Card Payoff</Link>
                <div className="tools-category" style={{marginTop: '10px'}}>Quick Tools / Misc</div>
                <Link href="/tools/fuel" onClick={closeMenu}>Fuel Calculator</Link>
                <Link href="/tools/currency" onClick={closeMenu}>Currency Converter</Link>
                <Link href="/tools/simple-interest" onClick={closeMenu}>Simple Interest</Link>
                <Link href="/tools/inflation" onClick={closeMenu}>Inflation Impact</Link>
              </div>
            </div>
          </div>

          <Link href="/blog" onClick={closeMenu}>Financial Blog</Link>
        </nav>

        {/* Mobile menu toggle */}
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>
      </div>
    </header>
  );
}