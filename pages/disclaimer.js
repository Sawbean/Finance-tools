export default function Disclaimer() {
  const sectionStyle = { marginBottom: '25px' };
  const h2Style = { fontSize: '1.3rem', color: '#0f172a', marginBottom: '8px', fontWeight: '700' };

  return (
    <div className="container" style={{ maxWidth: '850px', margin: '60px auto', padding: '0 20px', color: '#334155', lineHeight: '1.7' }}>
      <header style={{ borderBottom: '4px solid #f1f5f9', marginBottom: '40px', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1e293b' }}>Legal Disclaimer</h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Last Revised: April 2026</p>
      </header>

      <div style={{ background: '#fff7ed', borderLeft: '5px solid #f97316', padding: '20px', marginBottom: '40px', borderRadius: '4px' }}>
        <strong>IMPORTANT:</strong> The tools and intelligence provided by ToolFinance are for <strong>educational purposes only</strong>. We do not provide financial advice.
      </div>

      <section style={sectionStyle}>
        <h2 style={h2Style}>1. No Professional-Client Relationship</h2>
        <p>Use of ToolFinance, including our financial calculators and market analysis, does not create an advisor-client relationship. Content should not be considered a substitute for professional advice from a certified financial planner, CPA, or attorney.</p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>2. Investment Risk Disclosure</h2>
        <p>Calculations provided are mathematical estimates based on user input. Actual market conditions, taxes, and inflation may significantly alter real-world results. Past performance of any strategy discussed in our Intelligence Hub is not indicative of future returns.</p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>3. Accuracy & Warranty</h2>
        <p>While we leverage high-precision logic for our tools, ToolFinance provides all content "as is" without warranty. We are not responsible for typographical errors, calculation glitches, or outdated economic data.</p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>4. Limitation of Liability</h2>
        <p>In no event shall ToolFinance or its developers be liable for any financial loss, data loss, or incidental damages resulting from the use or inability to use our tools and articles.</p>
      </section>

      <section style={sectionStyle}>
        <h2 style={h2Style}>5. External Affiliations</h2>
        <p>We may link to external fintech platforms or news sources. ToolFinance does not endorse and is not responsible for the products, services, or content found on third-party domains.</p>
      </section>

      <footer style={{ marginTop: '60px', padding: '20px', background: '#f8fafc', borderRadius: '12px', textAlign: 'center', fontSize: '0.9rem' }}>
        <p>By continuing to use ToolFinance, you acknowledge you have read and understood this legal framework.</p>
      </footer>
    </div>
  );
}