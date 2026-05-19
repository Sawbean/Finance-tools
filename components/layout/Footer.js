import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-column">
          {/* Use text-main to ensure "ToolFinance" is bright white in Dark Mode */}
          <div className="footer-brand" style={{ fontSize: '1.4rem', fontWeight: '900', marginBottom: '10px', color: 'var(--text-main)' }}>
            ToolFinance
          </div>
          {/* Changed opacity to var(--text-muted) for better readability */}
          <p style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--footer-text)', maxWidth: '300px', margin: '0 auto', fontWeight: '500' }}>
            Free, accurate financial tools and research. Empowering your economic intelligence.
          </p>
        </div>

        {/* Columns Logic */}
        {[
          { title: "Calculators", links: [{n: "EMI & Loans", h: "/tools/emi"}, {n: "SIP & Investments", h: "/tools/sip"}, {n: "Stock Market", h: "/tools/stock-average"}, {n: "Tax Tools", h: "/tools/gst-vat-tax"}, {n: "Utility", h: "/tools/fuel"}] },
          { title: "Resources", links: [{n: "Financial Blog", h: "/blog"}, {n: "About Us", h: "/about"}, {n: "Contact", h: "/contact"}, {n: "Sitemap", h: "/sitemap.xml"}] },
          { title: "Legal", links: [{n: "Privacy Policy", h: "/privacy-policy"}, {n: "Terms of service", h: "/terms"}, {n: "Disclaimer", h: "/disclaimer"}] }
        ].map((col, i) => (
          <div key={i} className="footer-column">
            {/* Title uses var(--primary) from your CSS */}
            <h4>{col.title}</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {col.links.map((link, j) => (
                <li key={j} style={{ marginBottom: '6px' }}>
                  <Link href={link.h}>{link.n}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} ToolFinance. All rights reserved.</p>
        {/* Removed opacity 0.6 and used text-muted */}
        <p style={{ fontSize: '11px', marginTop: '4px', color: 'var(--footer-text)', opacity: 1, }}>
          Disclaimer: Calculations are for informational purposes only.
        </p>
      </div>
    </footer>
  );
}