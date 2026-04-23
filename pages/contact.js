export default function Contact() {
  const cardStyle = { background: '#f8fafc', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '30px' };
  const h2Style = { fontSize: '1.3rem', fontWeight: '800', color: '#1e293b', marginBottom: '15px' };

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '60px auto', padding: '0 20px', color: '#475569', lineHeight: '1.6' }}>
      <header style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: '900', color: '#0f172a', marginBottom: '15px' }}>Get in Touch</h1>
        <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Have a question about our financial tools or a suggestion for our Research Archive? Our team is ready to assist you.</p>
      </header>

      <div style={cardStyle}>
        <h2 style={h2Style}>Direct Communication</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: '#fff', padding: '15px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
          <span style={{ fontSize: '24px' }}>✉️</span>
          <div>
            <p style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#64748b', margin: 0 }}>Official Support Email</p>
            <a href="mailto:sawbeenbhandari@gmail.com" style={{ fontSize: '1.1rem', color: '#2563eb', fontWeight: 'bold', textDecoration: 'none' }}>sawbeenbhandari@gmail.com</a>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{ padding: '20px', background: '#f1f5f9', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '1rem', color: '#0f172a' }}>🛠️ Technical Support</h3>
          <p style={{ fontSize: '0.9rem' }}>Report bugs, calculation errors, or display issues across your devices.</p>
        </div>
        <div style={{ padding: '20px', background: '#f1f5f9', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '1rem', color: '#0f172a' }}>💡 Feature Requests</h3>
          <p style={{ fontSize: '0.9rem' }}>Suggest new calculators or specific topics for our Strategic Analysis section.</p>
        </div>
      </div>

      <div style={sectionStyle}>
        <h2 style={h2Style}>Response Commitment</h2>
        <p>Our intelligence team monitors inquiries <strong>Monday through Friday</strong>. We aim to provide a detailed response within <strong>24–48 hours</strong>. Please note that we do not provide personalized investment advice via email.</p>
      </div>

      <div style={{ marginTop: '40px', padding: '20px', background: '#eff6ff', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
        <p style={{ fontSize: '0.85rem', color: '#1e40af', margin: 0 }}>
          <strong>Privacy Note:</strong> Your email address is used strictly for communication purposes. We never sell your data or subscribe you to newsletters without explicit consent.
        </p>
      </div>
    </div>
  );
}