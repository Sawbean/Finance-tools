import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3>ToolFinance</h3>
          <p>
            Free online financial calculators and guides to help you make
            smarter money decisions.
          </p>
        </div>

        <div className="footer-column">
          <h4>Quick Links</h4>
          <Link href="/tools/emi">EMI Calculator</Link>
          <Link href="/tools/loan">Loan Calculator</Link>
          <Link href="/tools/fuel">Fuel Cost Calculator</Link>
          <Link href="/blog">Financial Blog</Link>
        </div>

        <div className="footer-column">
          <h4>Legal</h4>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms">Terms & Conditions</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} ToolFinance. All rights reserved.
      </div>
    </footer>
  );
}