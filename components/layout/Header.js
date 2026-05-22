import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const dropdownRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (!menuOpen) {
      setToolsOpen(false);
      setOpenCategory(null);
    }
  };

  const toggleTools = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setToolsOpen(!toolsOpen);
    setOpenCategory(null); 
  };

  const toggleCategory = (category, event) => {
    event.stopPropagation();
    const isSame = openCategory === category;
    setOpenCategory(isSame ? null : category);

    if (window.innerWidth > 768 && !isSame) {
      const item = event.currentTarget.parentElement;
      item.classList.remove("flip");
      const rect = item.getBoundingClientRect();
      if (window.innerWidth - rect.right < 280) {
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth > 768 && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setToolsOpen(false);
        setOpenCategory(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="site-header">
      <div className="header-container">
        <div className="logo">
          <Link href="/" onClick={closeMenu}>
            <Image src="/images/finlogo.png" alt="ToolFinance" height={45} width={150} priority />
          </Link>
        </div>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link href="/" className="nav-item" onClick={closeMenu}>Home</Link>

          <div className={`tools-dropdown ${toolsOpen ? "active" : ""}`} ref={dropdownRef}>
            <button className="tools-btn" onClick={toggleTools}>
              Tools <span className="arrow">▾</span>
            </button>

            <div className={`tools-menu ${toolsOpen ? "show" : ""}`}>
              {/* Category 1: Loans */}
              <div className="tools-item">
                <div className={`category-title ${openCategory === 'loans' ? 'active' : ''}`} 
                     onClick={(e) => toggleCategory("loans", e)}>
                  Loans & EMI <span className="chevron">▸</span>
                </div>
                <div className={`tools-submenu ${openCategory === "loans" ? "show" : ""}`}>
                  <Link href="/tools/emi" onClick={closeMenu}>EMI Calculator</Link>
                  <Link href="/tools/mortgage" onClick={closeMenu}>Mortgage Calculator</Link>
                  <Link href="/tools/loan" onClick={closeMenu}>Loan Calculator</Link>
                  <Link href="/tools/home-loan-vs-rent" onClick={closeMenu}>Home Loan vs Rent</Link>
                  <Link href="/tools/loan-eligibility" onClick={closeMenu}>Loan Eligibility</Link>
                </div>
              </div>

              {/* Category 2: Investments */}
              <div className="tools-item">
                <div className={`category-title ${openCategory === 'invest' ? 'active' : ''}`} 
                     onClick={(e) => toggleCategory("invest", e)}>
                  Investments <span className="chevron">▸</span>
                </div>
                <div className={`tools-submenu ${openCategory === "invest" ? "show" : ""}`}>
                  <Link href="/tools/sip" onClick={closeMenu}>SIP Calculator</Link>
                  <Link href="/tools/lumpsum" onClick={closeMenu}>Lumpsum Investment</Link>
                  <Link href="/tools/compound-interest" onClick={closeMenu}>Compound Interest</Link>
                  <Link href="/tools/fd-rd-calculator" onClick={closeMenu}>FD & RD Calculator</Link>
                  <Link href="/tools/fd" onClick={closeMenu}>FD Calculator</Link>
                  <Link href="/tools/retirement" onClick={closeMenu}>Retirement Plan</Link>
                  <Link href="/tools/simple-interest" onClick={closeMenu}>Simple Interest</Link>
                </div>
              </div>

              {/* Category 3: Business & Stock */}
              <div className="tools-item">
                <div className={`category-title ${openCategory === 'business' ? 'active' : ''}`} 
                     onClick={(e) => toggleCategory("business", e)}>
                  Stock & Business <span className="chevron">▸</span>
                </div>
                <div className={`tools-submenu ${openCategory === "business" ? "show" : ""}`}>
                  <Link href="/tools/stock-average" onClick={closeMenu}>Stock Average</Link>
                  <Link href="/tools/dividend-yield" onClick={closeMenu}>Dividend Yield</Link>
                  <Link href="/tools/margin-markup" onClick={closeMenu}>Margin vs Markup</Link>
                  <Link href="/tools/break-even" onClick={closeMenu}>Break-Even Calculator</Link>
                </div>
              </div>

              {/* Category 4: Taxes & Misc */}
              <div className="tools-item">
                <div className={`category-title ${openCategory === 'misc' ? 'active' : ''}`} 
                     onClick={(e) => toggleCategory("misc", e)}>
                  Tax & Quick Tools <span className="chevron">▸</span>
                </div>
                <div className={`tools-submenu ${openCategory === "misc" ? "show" : ""}`}>
                  <Link href="/tools/credit-card-payoff" onClick={closeMenu}>Credit Card Payoff</Link>
                  <Link href="/tools/ppf-nps-calculator" onClick={closeMenu}>PPF & NPS Calculator</Link>
                  <Link href="/tools/savings-goal" onClick={closeMenu}>Saving Goal Calculator</Link>
                  <Link href="/tools/income-tax" onClick={closeMenu}>Income Tax</Link>
                  <Link href="/tools/gst-vat-tax" onClick={closeMenu}>GST / VAT / Tax</Link>
                  <Link href="/tools/net-worth" onClick={closeMenu}>Net Worth Calculator</Link>
                  <Link href="/tools/fuel" onClick={closeMenu}>Fuel Calculator</Link>
                  <Link href="/tools/currency" onClick={closeMenu}>Currency Converter</Link>
                  <Link href="/tools/inflation" onClick={closeMenu}>Inflation Impact</Link>
                  
                </div>
              </div>
            </div>
          </div>

          <Link href="/blog" className="nav-item" onClick={closeMenu}>Blog</Link>
          <div className="mobile-toggle-wrapper">
            <span>Theme Mode</span>
            <ThemeToggle />
          </div>
        </nav>

        <button className={`menu-toggle ${menuOpen ? "active" : ""}`} onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>
    </header>
  );
}