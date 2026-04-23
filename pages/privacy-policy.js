export default function PrivacyPolicy() {
  const sectionStyle = { marginBottom: '30px' };
  const h2Style = { fontSize: '1.4rem', color: '#1e293b', marginBottom: '10px', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px' };
  const lastUpdated = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });
  return (
    <div className="container" style={{ maxWidth: '800px', margin: '60px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '900' }}>Privacy Policy</h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '40px' }}>
        Last Updated: {lastUpdated}. Your privacy is a priority at ToolFinance...
      </p>

      <div style={sectionStyle}>
        <h2 style={h2Style}>1. Data Collection</h2>
        <p>ToolFinance does not collect personally identifiable information (PII) like names or addresses. We only analyze non-personal data (browser type, device info) to optimize site performance.</p>
      </div>

      <div style={sectionStyle}>
        <h2 style={h2Style}>2. Cookies & Advertising</h2>
        <p>We use cookies to improve experience and serve relevant ads. As a third-party vendor, <strong>Google</strong> uses cookies to serve ads based on your visits to this and other sites on the Internet.</p>
        <p style={{ marginTop: '10px', fontSize: '0.9rem', background: '#f8fafc', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #cbd5e1' }}>
          <strong>User Choice:</strong> You can opt out of personalized advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noreferrer" style={{ color: '#2563eb' }}>Google Ads Settings</a>.
        </p>
      </div>

      <div style={sectionStyle}>
        <h2 style={h2Style}>3. External Links</h2>
        <p>Our analysis may link to external financial resources. We are not responsible for the privacy practices or content of these third-party sites.</p>
      </div>

      <div style={sectionStyle}>
        <h2 style={h2Style}>4. Consent & Updates</h2>
        <p>By utilizing our tools and intelligence hub, you consent to this policy. We reserve the right to update this text; changes are effective immediately upon posting.</p>
      </div>

      <footer style={{ marginTop: '50px', paddingTop: '20px', borderTop: '2px solid #f1f5f9', fontSize: '0.9rem' }}>
        <p>Contact us via our official channels for any privacy-related inquiries.</p>
      </footer>
    </div>
  );
}