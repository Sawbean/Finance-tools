import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-container">
        <div className="logo">
          <Link href="/">ToolFinance</Link>
        </div>

        {/* Hamburger (mobile only) */}
        <button
          className="menu-toggle"
          aria-label="Toggle navigation"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          <Link href="/" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/tools/emi" onClick={() => setOpen(false)}>EMI</Link>
          <Link href="/tools/loan" onClick={() => setOpen(false)}>Loan</Link>
          <Link href="/tools/fuel" onClick={() => setOpen(false)}>Fuel</Link>
          <Link href="/blog" onClick={() => setOpen(false)}>Blog</Link>
          <Link href="/about" onClick={() => setOpen(false)}>About</Link>
          <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
          <Link href="/contact" onClick={() => setOpen(false)}>Disclaimer</Link>
        </nav>
      </div>
    </header>
  );
}