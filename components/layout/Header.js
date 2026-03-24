import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);

  const dropdownRef = useRef(null);

  /* ===============================
     TOGGLE FUNCTIONS
  ============================== */

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    document.body.classList.toggle("menu-open");

    if (!menuOpen) {
      setToolsOpen(false);
      setOpenCategory(null);
    }
  };

  const toggleTools = (e) => {
    e.stopPropagation();
    setToolsOpen(!toolsOpen);

    if (!toolsOpen) {
      setOpenCategory(null);
    }
  };

  /* 🔥 UPDATED (SMART FLIP LOGIC) */
  const toggleCategory = (category, event) => {
    const isSame = openCategory === category;
    setOpenCategory(isSame ? null : category);

    if (!isSame && event) {
      const item = event.currentTarget.parentElement;

      // reset first
      item.classList.remove("flip");

      const rect = item.getBoundingClientRect();
      const spaceRight = window.innerWidth - rect.right;

      // if not enough space → open LEFT
      if (spaceRight < 280) {
        item.classList.add("flip");
      }
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setToolsOpen(false);
    setOpenCategory(null);
    document.body.classList.remove("menu-open");
  };

  /* ===============================
     CLICK OUTSIDE FIX
  ============================== */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        window.innerWidth > 768 &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setToolsOpen(false);
        setOpenCategory(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ===============================
     UI
  ============================== */

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

              {/* Loans */}
              <div className="tools-item">
                <div
                  className="tools-category"
                  onClick={(e) => toggleCategory("loans", e)}
                >
                  Loans & EMI
                </div>

                <div className={`tools-submenu ${openCategory === "loans" ? "open" : ""}`}>
                  <Link href="/tools/emi" onClick={closeMenu}>EMI Calculator</Link>
                  <Link href="/tools/mortgage" onClick={closeMenu}>Mortgage Calculator</Link>
                  <Link href="/tools/loan" onClick={closeMenu}>Loan Calculator</Link>
                  <Link href="/tools/home-loan-vs-rent" onClick={closeMenu}>Home Loan vs Rent</Link>
                  <Link href="/tools/loan-eligibility" onClick={closeMenu}>Loan Eligibility</Link>
                </div>
              </div>

              {/* Investments */}
              <div className="tools-item">
                <div
                  className="tools-category"
                  onClick={(e) => toggleCategory("investments", e)}
                >
                  Investments & Savings
                </div>

                <div className={`tools-submenu ${openCategory === "investments" ? "open" : ""}`}>
                  <Link href="/tools/sip" onClick={closeMenu}>SIP Calculator</Link>
                  <Link href="/tools/compound-interest" onClick={closeMenu}>Compound Interest</Link>
                  <Link href="/tools/fd-rd-calculator" onClick={closeMenu}>FD & RD Calculator</Link>
                  <Link href="/tools/ppf-nps-calculator" onClick={closeMenu}>PPF / NPS Calculator</Link>
                  <Link href="/tools/retirement" onClick={closeMenu}>Retirement Calculator</Link>
                  <Link href="/tools/savings-goal" onClick={closeMenu}>Savings Goal</Link>
                </div>
              </div>

              {/* Taxes */}
              <div className="tools-item">
                <div
                  className="tools-category"
                  onClick={(e) => toggleCategory("taxes", e)}
                >
                  Taxes & Financial Planning
                </div>

                <div className={`tools-submenu ${openCategory === "taxes" ? "open" : ""}`}>
                  <Link href="/tools/income-tax" onClick={closeMenu}>Income Tax Calculator</Link>
                  <Link href="/tools/gst-vat-tax" onClick={closeMenu}>GST / VAT / Tax</Link>
                  <Link href="/tools/net-worth" onClick={closeMenu}>Net Worth Calculator</Link>
                  <Link href="/tools/credit-card-payoff" onClick={closeMenu}>Credit Card Payoff</Link>
                </div>
              </div>

              {/* Quick Tools */}
              <div className="tools-item">
                <div
                  className="tools-category"
                  onClick={(e) => toggleCategory("quick", e)}
                >
                  Quick Tools / Misc
                </div>

                <div className={`tools-submenu ${openCategory === "quick" ? "open" : ""}`}>
                  <Link href="/tools/fuel" onClick={closeMenu}>Fuel Calculator</Link>
                  <Link href="/tools/currency" onClick={closeMenu}>Currency Converter</Link>
                  <Link href="/tools/simple-interest" onClick={closeMenu}>Simple Interest</Link>
                  <Link href="/tools/inflation" onClick={closeMenu}>Inflation Impact</Link>
                </div>
              </div>

            </div>
          </div>

          <Link href="/blog" onClick={closeMenu}>Financial Blog</Link>
        </nav>

        {/* Hamburger */}
        <button
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          ☰
        </button>

      </div>
    </header>
  );
}