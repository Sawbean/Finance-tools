import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* About */}
        <div className="footer-column">
          <div className="footer-brand">ToolFinance</div>
          <div className="footer-description">
            Free online financial calculators and guides to help you make smarter money decisions.
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-column">
          <h4>Quick Links</h4>
          
          <Link href="/tools/emi">EMI Calculator</Link>
          <Link href="/tools/loan">Loan Calculator</Link>
          <Link href="/tools/fuel">Fuel Calculator</Link>
          <Link href="/blog">Financial Blog</Link>
        </div>

        {/* Legal */}
        <div className="footer-column">
          <h4>Legal</h4>
          <Link href="/about">About Us</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms">Terms & Conditions</Link>
          <Link href="/disclaimer">Disclaimer</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} ToolFinance. All rights reserved.
      </div>
    </footer>
  );
}