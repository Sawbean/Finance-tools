import Link from 'next/link';

export default function About() {
  const highlightBox = { background: '#f0f9ff', padding: '25px', borderRadius: '16px', border: '1px solid #e0f2fe', marginBottom: '40px' };
  const h2Style = { fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' };

  return (
    <div className="container" style={{ maxWidth: '850px', margin: '60px auto', padding: '0 20px', color: '#334155', lineHeight: '1.7' }}>
      <header style={{ marginBottom: '50px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#1e293b', marginBottom: '10px' }}>The ToolFinance Mission</h1>
        <p style={{ fontSize: '1.2rem', color: '#64748b' }}>Precision Engineering for Personal Finance.</p>
      </header>

      <div style={highlightBox}>
        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '500' }}>
          ToolFinance is an independent financial intelligence platform. We bridge the gap between complex economic data and everyday decision-making through <strong>high-precision calculators</strong> and <strong>expert strategic analysis</strong>.
        </p>
      </div>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={h2Style}><span>🛡️</span> Our Core Commitment</h2>
        <p>In a world of financial noise, clarity is the ultimate asset. We build tools that are 100% free, mobile-responsive, and registration-free, ensuring that every user has the power to calculate their future without barriers.</p>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '50px' }}>
        <div style={{ padding: '25px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#0f172a' }}>Calculators & Logic</h3>
          <p style={{ fontSize: '0.95rem' }}>From <Link href="/tools/emi" style={{color:'#2563eb'}}>EMI projections</Link> to complex loan breakdowns, our tools are built with mathematical rigor to ensure your estimates are as close to reality as possible.</p>
        </div>
        <div style={{ padding: '25px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#0f172a' }}>The Knowledge Center</h3>
          <p style={{ fontSize: '0.95rem' }}>Beyond numbers, we offer a <Link href="/blog" style={{color:'#2563eb'}}>Strategic Research Archive</Link> that covers global markets, wealth management, and the emerging digital economy.</p>
        </div>
      </div>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={h2Style}><span>⚖️</span> Transparency & Sustainability</h2>
        <p>ToolFinance is supported by transparent advertising. This model allows us to maintain a "Privacy-First" environment where you can use our advanced systems without ever providing your personal name, address, or payment details.</p>
      </section>

      <section style={{ background: '#0f172a', padding: '40px', borderRadius: '20px', color: '#f8fafc', textAlign: 'center' }}>
        <h2 style={{ ...h2Style, color: '#fff', justifyContent: 'center' }}>The Vision for 2026</h2>
        <p style={{ opacity: 0.9, maxWidth: '600px', margin: '0 auto 20px' }}>We are scaling ToolFinance into a comprehensive global resource hub, combining automated financial tools with deep-dive economic intelligence.</p>
        <Link href="/contact" style={{ display: 'inline-block', background: '#2563eb', color: '#fff', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>Collaborate With Us</Link>
      </section>
    </div>
  );
}