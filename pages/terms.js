export default function TermsConditions() {
  const sectionStyle = { marginBottom: '30px' };
  const h2Style = { fontSize: '1.4rem', color: '#0f172a', marginBottom: '12px', fontWeight: '800', borderLeft: '4px solid #e2e8f0', paddingLeft: '15px' };
  const lastUpdated = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="container" style={{ maxWidth: '850px', margin: '60px auto', padding: '0 20px', color: '#334155', lineHeight: '1.8' }}>
      <header style={{ marginBottom: '50px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1e293b' }}>Terms & Conditions</h1>
        <p style={{ color: '#64748b' }}>Effective Date: {lastUpdated}</p>
      </header>

      <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '40px', fontSize: '0.95rem' }}>
        By accessing <strong>ToolFinance</strong>, you enter into a legally binding agreement to comply with the operational frameworks outlined below. If you do not agree to these terms, please discontinue use of our services immediately.
      </div>

      <section style={sectionStyle}>
        <h2 style={h2Style}>1. Operational Scope</h2>
        <p>ToolFinance provides mathematical simulations and economic research. You agree to use this platform for lawful, non-commercial purposes. Any attempt to disrupt site functionality, scrape data via automated bots, or reverse-engineer our proprietary calculators is strictly prohibited.</p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>2. Intellectual Property Rights</h2>
        <p>The "ToolFinance" name, our custom-coded financial algorithms, UI design, and Research Archive content are the exclusive property of ToolFinance. You may not reproduce, distribute, or "mirror" our tools on other domains without explicit written authorization.</p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>3. No Fiduciary Duty</h2>
        <p>ToolFinance is a software provider, not a financial fiduciary. Our content is provided "As Is" and "As Available." We do not guarantee that the mathematical outputs will align perfectly with real-world bank interest rates, tax laws, or market fluctuations.</p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>4. Limitation of Liability</h2>
        <p>To the maximum extent permitted by law, ToolFinance and its developers shall not be liable for any direct, indirect, or consequential financial losses resulting from reliance on our estimates. Users are solely responsible for verifying data with certified professionals before executing financial transactions.</p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>5. Service Modifications</h2>
        <p>We reserve the right to upgrade, modify, or retire any tool or archive article without prior notice. These Terms are subject to change; your continued use of the hub after updates constitutes full acceptance of the new legal framework.</p>
      </section>

      <footer style={{ marginTop: '50px', paddingTop: '30px', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
        <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>© 2026 ToolFinance Intelligence Hub. All Rights Reserved.</p>
      </footer>
    </div>
  );
}