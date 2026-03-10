import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleTools = () => setToolsOpen(!toolsOpen);

  // Close menu when user navigates
  useEffect(() => {
    const handleRouteChange = () => {
      setMenuOpen(false);
      setToolsOpen(false);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router.events]);

  return (
    <header className={`site-header ${menuOpen ? "menu-active" : ""}`}>
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <Link href="/">ToolFinance</Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
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
            </div>
          </div>

          <Link href="/blog">Blog</Link>
          <Link href="/about">About Us</Link>
        </nav>
      </div>

      {/* Overlay when menu is open */}
      {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)} />}
    </header>
  );
}