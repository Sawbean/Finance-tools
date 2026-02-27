import Link from "next/link";

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-container">
        <div className="logo">
          <Link href="/">ToolFinance</Link>
        </div>

        <nav className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/tools/emi">EMI</Link>
          <Link href="/tools/loan">Loan</Link>
          <Link href="/tools/fuel">Fuel</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/contact">Disclaimer</Link>
        </nav>
      </div>
    </header>
  );
}