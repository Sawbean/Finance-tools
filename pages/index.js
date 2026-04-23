import Head from "next/head";
import Link from "next/link";
import ToolCard from "../components/ui/ToolCard";
import { tools } from "../data/tools";
import styles from "../styles/Home.module.css";
// CHANGED: Pointing to the new file name
import { financeArticles } from "../data/financeArticles"; 

export default function Home() {
  // 1. CALCULATOR LOGIC (Restored exactly)
  const loanTools = tools.filter(t => t.link.includes('loan') || t.link.includes('emi') || t.link.includes('mortgage'));
  const investTools = tools.filter(t => t.link.includes('sip') || t.link.includes('lumpsum') || t.link.includes('interest') || t.link.includes('retirement') || t.link.includes('fd'));
  const businessTools = tools.filter(t => t.link.includes('stock') || t.link.includes('margin') || t.link.includes('break-even') || t.link.includes('dividend'));
  const taxMiscTools = tools.filter(t => !loanTools.includes(t) && !investTools.includes(t) && !businessTools.includes(t));

  // 2. BLOG LOGIC (Updated to use financeArticles)
  const latestBlogs = Object.entries(financeArticles)
    .sort((a, b) => new Date(b[1].publishDate) - new Date(a[1].publishDate))
    .slice(0, 3);

  return (
    <div className="container">
      <Head>
        <title>ToolFinance | Smart Financial Calculators & Investment Guides</title>
        <meta name="description" content="Accurate financial calculators for EMI, SIP, Loans, and Taxes. Stay updated with our expert financial guides." />
      </Head>
      {/* --- HERO SECTION --- */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.mainTitle}>
            Master Your Money with <span className={styles.textGradient}>Precision</span>
          </h1>
          <p className={styles.subText}>
            ToolFinance provides <strong>simple and accurate</strong> financial calculators and expert educational content. 
            Plan loans, track investments, and make smarter economic decisions today.
          </p>
        </div>
      </section>

      {/* --- MAIN TOOLS SECTION --- */}
      <div id="calculators" style={{ paddingTop: '20px' }}>
        
        {/* Featured Section */}
        <div className="home-section-title" style={{ background: '#f8fafc', padding: '30px', borderRadius: '16px', marginBottom: '40px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ marginTop: 0 }}>Most Popular This Week</h2>
          <div className="tools-grid">
              <ToolCard title="Personal Loan EMI" link="/tools/emi" />
              <ToolCard title="SIP Growth Calculator" link="/tools/sip" />
          </div>
        </div>

       <h2 className="home-section-title">Personal Loan & Mortgage EMI Calculators</h2>
         <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '0.95rem', textAlign: 'center' }}>
           Plan your debt efficiently with our accurate calculators for home, car, and personal loans.
         </p>
        <div className="tools-grid">
          {loanTools.map((tool) => (
            <ToolCard key={tool.link} title={tool.title} link={tool.link} />
          ))}
        </div>

        <h2 className="home-section-title">Investment Planning & Savings Growth Tools</h2>
        <p style={{ color: '#64748b', marginBottom: '25px', fontSize: '0.95rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto 20px' }}>
           Calculate future wealth and visualize your long-term financial goals with SIP, FD, and compound interest planners.
        </p>
        <div className="tools-grid">
          {investTools.map((tool) => (
            <ToolCard key={tool.link} title={tool.title} link={tool.link} />
          ))}
        </div>

        <h2 className="home-section-title">Essential Business & Stock Market Calculators</h2>
        <p style={{ color: '#64748b', marginBottom: '25px', fontSize: '0.95rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto 20px' }}>
            Analyze business profitability, margins, and stock market averages to make data-driven investment decisions.
        </p>
        <div className="tools-grid">
          {businessTools.map((tool) => (
            <ToolCard key={tool.link} title={tool.title} link={tool.link} />
          ))}
        </div>

        <h2 className="home-section-title">Income Tax, GST & Financial Utility Tools</h2>
        <p style={{ color: '#64748b', marginBottom: '25px', fontSize: '0.95rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto 20px' }}>
          Stay compliant and simplify your daily finances with quick tools for tax estimation, GST, and currency conversion.
        </p>
        <div className="tools-grid">
          {taxMiscTools.map((tool) => (
            <ToolCard key={tool.link} title={tool.title} link={tool.link} />
          ))}
        </div>
      </div>

              {/* --- TRUST STATS --- */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', margin: '40px 0', textAlign: 'center' }}>
          <div>
            <h3 style={{ color: 'var(--primary)', margin: 0 }}>25+</h3>
            <p style={{ fontSize: '14px', color: '#64748b' }}>Precision Tools</p>
          </div>
          <div>
            <h3 style={{ color: 'var(--primary)', margin: 0 }}>100%</h3>
            <p style={{ fontSize: '14px', color: '#64748b' }}>Free to Use</p>
          </div>
          <div>
            <h3 style={{ color: 'var(--primary)', margin: 0 }}>Secure</h3>
            <p style={{ fontSize: '14px', color: '#64748b' }}>No Data Collection</p>
          </div>
        </div>  

      {/* --- LATEST BLOGS SECTION --- */}
      <section className="home-blog-footer" style={{ marginTop: '80px', paddingTop: '40px', borderTop: '1px solid #eee' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Latest Financial Insights</h2>
          <Link href="/blog" style={{ color: '#27ae60', fontWeight: '600', textDecoration: 'none' }}>View All Articles →</Link>
        </div>
        
        <div className="mini-blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {latestBlogs.map(([slug, post]) => (
            <Link href={`/blog/${slug}`} key={slug} className="minimal-blog-link" style={{ textDecoration: 'none' }}>
              <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '12px', border: '1px solid #f3f4f6', transition: '0.2s', height: '100%' }}>
                <span style={{ color: '#27ae60', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>{post.category}</span>
                <h4 style={{ margin: '10px 0', color: '#111827', fontSize: '1.1rem', lineHeight: '1.4' }}>{post.title}</h4>
                <div style={{ color: '#9ca3af', fontSize: '12px' }}>{post.publishDate} • {post.readTime}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* --- BOTTOM CTA --- */}
      <section style={{ textAlign: 'center', padding: '60px 20px', background: '#111827', borderRadius: '20px', color: 'white', marginTop: '60px' }}>
        <h2 className="text-gradient" style={{ fontSize: '2rem' }}>Ready to Plan Your Future?</h2>
        <p style={{ color: '#9ca3af', marginBottom: '30px' }}>Simple tools for complex financial decisions.</p>
        <Link href="/tools/emi" className="btn-primary">Calculate My EMI Now</Link>
      </section>
    </div>
  );
}