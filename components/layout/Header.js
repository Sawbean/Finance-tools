import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import styles from "./Header.module.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const [dropdownStyle, setDropdownStyle] = useState({});

  const dropdownRef = useRef(null);
  const toolsBtnRef = useRef(null);

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

  // Desktop dropdown positioning
  useEffect(() => {
    if (toolsOpen && toolsBtnRef.current && dropdownRef.current) {
      const btnRect = toolsBtnRef.current.getBoundingClientRect();
      const menu = dropdownRef.current;
      const viewportWidth = window.innerWidth;
      const menuWidth = menu.offsetWidth;

      let left = btnRect.left; // align with button
      if (left + menuWidth > viewportWidth - 16) { // 16px padding
        left = viewportWidth - menuWidth - 16;
      }
      if (left < 16) left = 16;

      setDropdownStyle({ left: `${left}px` });
    }
  }, [toolsOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setToolsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={styles.siteHeader}>
      <div className={styles.headerContainer}>
        {/* Logo */}
        <div className={styles.logo}>
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

        {/* Nav Links */}
        <nav className={`${styles.navLinks} ${menuOpen ? styles.open : ""}`}>
          <Link href="/" onClick={closeMenu}>Home</Link>

          {/* Tools Dropdown */}
          <div className={styles.toolsDropdown} ref={dropdownRef}>
            <button
              ref={toolsBtnRef}
              className={`${styles.toolsBtn} ${toolsOpen ? styles.open : ""}`}
              onClick={toggleTools}
            >
              Tools
              <svg viewBox="0 0 10 10" fill="currentColor">
                <polygon points="0,0 10,0 5,6" />
              </svg>
            </button>

            <div
              className={`${styles.toolsMenu} ${toolsOpen ? styles.open : ""}`}
              style={dropdownStyle}
            >
              {/* Column 1 */}
              <div className={`${styles.toolsColumn} ${openCategory === "loans" ? styles.open : ""}`}>
                <div className={styles.toolsCategory} onClick={() => toggleCategory("loans")}>Loans & EMI</div>
                <Link href="/tools/emi" onClick={closeMenu}>EMI Calculator</Link>
                <Link href="/tools/mortgage" onClick={closeMenu}>Mortgage Calculator</Link>
                <Link href="/tools/loan" onClick={closeMenu}>Loan Calculator</Link>
                <Link href="/tools/home-loan-vs-rent" onClick={closeMenu}>Home Loan vs Rent</Link>
                <Link href="/tools/loan-eligibility" onClick={closeMenu}>Loan Eligibility</Link>
              </div>

              {/* Column 2 */}
              <div className={`${styles.toolsColumn} ${openCategory === "investments" ? styles.open : ""}`}>
                <div className={styles.toolsCategory} onClick={() => toggleCategory("investments")}>Investments & Savings</div>
                <Link href="/tools/sip" onClick={closeMenu}>SIP Calculator</Link>
                <Link href="/tools/compound-interest" onClick={closeMenu}>Compound Interest</Link>
                <Link href="/tools/fd-rd-calculator" onClick={closeMenu}>FD & RD Calculator</Link>
                <Link href="/tools/ppf-nps-calculator" onClick={closeMenu}>PPF / NPS Calculator</Link>
                <Link href="/tools/retirement" onClick={closeMenu}>Retirement Calculator</Link>
                <Link href="/tools/savings-goal" onClick={closeMenu}>Savings Goal</Link>
              </div>

              {/* Column 3 */}
              <div className={`${styles.toolsColumn} ${openCategory === "taxes" ? styles.open : ""}`}>
                <div className={styles.toolsCategory} onClick={() => toggleCategory("taxes")}>Taxes & Financial Planning</div>
                <Link href="/tools/income-tax" onClick={closeMenu}>Income Tax Calculator</Link>
                <Link href="/tools/gst-vat-tax" onClick={closeMenu}>GST / VAT / Tax</Link>
                <Link href="/tools/net-worth" onClick={closeMenu}>Net Worth Calculator</Link>
                <Link href="/tools/credit-card-payoff" onClick={closeMenu}>Credit Card Payoff</Link>
              </div>

              {/* Column 4 */}
              <div className={`${styles.toolsColumn} ${openCategory === "quick" ? styles.open : ""}`}>
                <div className={styles.toolsCategory} onClick={() => toggleCategory("quick")}>Quick Tools / Misc</div>
                <Link href="/tools/fuel" onClick={closeMenu}>Fuel Calculator</Link>
                <Link href="/tools/currency" onClick={closeMenu}>Currency Converter</Link>
                <Link href="/tools/simple-interest" onClick={closeMenu}>Simple Interest</Link>
                <Link href="/tools/inflation" onClick={closeMenu}>Inflation Impact</Link>
              </div>
            </div>
          </div>

          <Link href="/blog" onClick={closeMenu}>Financial Blog</Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button className={styles.menuToggle} onClick={toggleMenu}>
          ☰
        </button>
      </div>
    </header>
  );
}