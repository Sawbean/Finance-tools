import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);

  const dropdownRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleTools = (e) => {
    e.stopPropagation();
    setToolsOpen(!toolsOpen);
  };
  const toggleCategory = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };
  const closeMenu = () => {
    setMenuOpen(false);
    setToolsOpen(false);
    setOpenCategory(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setToolsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

        {/* Mobile Hamburger */}
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>

        {/* Navigation */}
        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link href="/" onClick={closeMenu}>Home</Link>

          {/* TOOLS DROPDOWN */}
          <div className="tools-dropdown" ref={dropdownRef}>
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

              {/* Column 1 */}
              <div className={`tools-column ${openCategory === "loans" ? "open" : ""}`}>
                <div className="tools-category" onClick={() => toggleCategory("loans")}>
                  Loans & EMI
                </div>
                <Link href="/tools/emi" onClick={closeMenu}>EMI Calculator</Link>
                <Link href="/tools/mortgage" onClick={closeMenu}>Mortgage Calculator</Link>
                <Link href="/tools/loan" onClick={closeMenu}>Loan Calculator</Link>
                <Link href="/tools/home-loan-vs-rent" onClick={closeMenu}>Home Loan vs Rent</Link>
                <Link href="/tools/loan-eligibility" onClick={closeMenu}>Loan Eligibility</Link>
              </div>

              {/* Column 2 */}
              <div className={`tools-column ${openCategory === "investments" ? "open" : ""}`}>
                <div className="tools-category" onClick={() => toggleCategory("investments")}>
                  Investments & Savings
                </div>
                <Link href="/tools/sip" onClick={closeMenu}>SIP Calculator</Link>
                <Link href="/tools/compound-interest" onClick={closeMenu}>Compound Interest</Link>
                <Link href="/tools/fd-rd-calculator" onClick={closeMenu}>FD & RD Calculator</Link>
                <Link href="/tools/ppf-nps-calculator" onClick={closeMenu}>PPF / NPS Calculator</Link>
                <Link href="/tools/retirement" onClick={closeMenu}>Retirement Calculator</Link>
                <Link href="/tools/savings-goal" onClick={closeMenu}>Savings Goal</Link>
              </div>

              {/* Column 3 */}
              <div className={`tools-column ${openCategory === "taxes" ? "open" : ""}`}>
                <div className="tools-category" onClick={() => toggleCategory("taxes")}>
                  Taxes & Financial Planning
                </div>
                <Link href="/tools/income-tax" onClick={closeMenu}>Income Tax Calculator</Link>
                <Link href="/tools/gst-vat-tax" onClick={closeMenu}>GST / VAT / Tax</Link>
                <Link href="/tools/net-worth" onClick={closeMenu}>Net Worth Calculator</Link>
                <Link href="/tools/credit-card-payoff" onClick={closeMenu}>Credit Card Payoff</Link>
              </div>

              {/* Column 4 */}
              <div className={`tools-column ${openCategory === "quick" ? "open" : ""}`}>
                <div
                  className="tools-category"
                  onClick={() => toggleCategory("quick")}
                >
                  Quick Tools / Misc
                </div>
                <Link href="/tools/fuel" onClick={closeMenu}>Fuel Calculator</Link>
                <Link href="/tools/currency" onClick={closeMenu}>Currency Converter</Link>
                <Link href="/tools/simple-interest" onClick={closeMenu}>Simple Interest</Link>
                <Link href="/tools/inflation" onClick={closeMenu}>Inflation Impact</Link>
              </div>

            </div>
          </div>

          <Link href="/blog" onClick={closeMenu}>Financial Blog</Link>
        </nav>

      </div>
    </header>
  );
}