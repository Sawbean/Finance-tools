import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-column">
          <div className="footer-brand">ToolFinance</div>
          <p className="footer-description">
            Your trusted destination for free, accurate, and easy-to-use financial calculators. 
            Empowering you to plan your future with confidence.
          </p>
        </div>

        {/* Categories / Popular Tools */}
        <div className="footer-column">
          <h4>Calculators</h4>
          <ul className="footer-links">
            <li><Link href="/tools/emi">EMI & Loans</Link></li>
            <li><Link href="/tools/sip">SIP & Investments</Link></li>
            <li><Link href="/tools/stock-average">Stock Market</Link></li>
            <li><Link href="/tools/gst-vat-tax">Tax Tools</Link></li>
            <li><Link href="/tools/fuel">Utility Calculators</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div className="footer-column">
          <h4>Resources</h4>
          <ul className="footer-links">
            <li><Link href="/blog">Financial Blog</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact">Contact Support</Link></li>
            <li><Link href="/sitemap.xml">Sitemap</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div className="footer-column">
          <h4>Legal</h4>
          <ul className="footer-links">
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Service</Link></li>
            <li><Link href="/disclaimer">Disclaimer</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} ToolFinance. All rights reserved.</p>
        <p style={{ fontSize: '12px', marginTop: '5px', opacity: 0.7 }}>
          Disclaimer: Calculations are for informational purposes only.
        </p>
      </div>
    </footer>
  );
}