import Head from "next/head";
import Link from "next/link";
import ToolCard from "../components/ui/ToolCard";
import { tools } from "../data/tools";
import styles from "../styles/Home.module.css";
// CHANGED: Pointing to the new file name
// import { financeArticles } from "../data/financeArticles"; 
import { allFinanceArticles as financeArticles } from "../data/articles/index";
import { allToolGuides } from "../data/tool-guides/index";

export default function Home() {
  // 1. CALCULATOR LOGIC (Restored exactly)
  const loanTools = tools.filter(t => t.link.includes('loan') || t.link.includes('emi') || t.link.includes('mortgage'));
  const investTools = tools.filter(t => t.link.includes('sip') || t.link.includes('lumpsum') || t.link.includes('interest') || t.link.includes('retirement') || t.link.includes('fd'));
  const businessTools = tools.filter(t => t.link.includes('stock') || t.link.includes('margin') || t.link.includes('break-even') || t.link.includes('dividend'));
  const taxMiscTools = tools.filter(t => !loanTools.includes(t) && !investTools.includes(t) && !businessTools.includes(t));
  const allPostsCombined = { ...financeArticles, ...allToolGuides };
  // 2. BLOG LOGIC (Updated to use financeArticles)
  const latestBlogs = Object.entries(allPostsCombined)
    .sort((a, b) => new Date(b[1].publishDate) - new Date(a[1].publishDate))
    .slice(0, 3);

  const featuredTools = [
  tools.find(t => t.link === "/tools/emi"),
  tools.find(t => t.link === "/tools/sip")
].filter(Boolean);

  return (
    <div className="container" style={{ paddingTop: '0px' }}>
      <Head>
        <title>ToolFinance | Smart Financial Calculators & Investment Guides</title>
        <meta name="description" content="Accurate financial calculators for EMI, SIP, Loans, and Taxes. Stay updated with our expert financial guides." />
      </Head>
      {/* --- HERO SECTION --- */}
      <section className={styles.heroSection} style={{ background: 'var(--card-bg)', borderBottom: 'none' }}>
  <div className={styles.heroContent}>
    <h1 className={styles.mainTitle}>
       <span className={styles.textGradient}>Master Your Money with Precision</span>
    </h1>
    <p className={styles.subText}>
      ToolFinance provides <strong>simple and accurate</strong> financial calculators and expert educational content. 
      Plan loans, track investments, and make smarter economic decisions today.
    </p>
  </div>
</section>

      {/* --- MAIN TOOLS SECTION --- */}
      <div id="calculators" style={{ paddingTop: '0px' }}>
         <h2 className="home-section-title">🔥 Most Popular This Week</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', textAlign: 'center', marginBottom: '20px' }}>
              Quickly access our most used financial tools.
            </p>

            {/* NO SECTION BOX HERE */}
            <div className="tools-grid" style={{ marginBottom: '60px' }}>
              {featuredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
       <h2 className="home-section-title">Personal Loan & Mortgage EMI Calculators</h2>
         <p style={{ color: 'var(--text-muted)', marginBottom: '10px', fontSize: '0.95rem', textAlign: 'center' }}>
           Plan your debt efficiently with our accurate calculators for home, car, and personal loans.
         </p>
        <div className="tools-grid">
          {loanTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        <h2 className="home-section-title">Investment Planning & Savings Growth Tools</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '10px', fontSize: '0.95rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto 20px' }}>
           Calculate future wealth and visualize your long-term financial goals with SIP, FD, and compound interest planners.
        </p>
        <div className="tools-grid">
          {investTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        <h2 className="home-section-title">Essential Business & Stock Market Calculators</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '10px', fontSize: '0.95rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto 20px' }}>
            Analyze business profitability, margins, and stock market averages to make data-driven investment decisions.
        </p>
        <div className="tools-grid">
          {businessTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        <h2 className="home-section-title">Income Tax, GST & Financial Utility Tools</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '10px', fontSize: '0.95rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto 20px' }}>
          Stay compliant and simplify your daily finances with quick tools for tax estimation, GST, and currency conversion.
        </p>
        <div className="tools-grid">
          {taxMiscTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>

              {/* --- TRUST STATS --- */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', margin: '20px 0', textAlign: 'center' }}>
          <div>
            <h3 style={{ color: 'var(--primary)', margin: 0 }}>25+</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Precision Tools</p>
          </div>
          <div>
            <h3 style={{ color: 'var(--primary)', margin: 0 }}>100%</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Free to Use</p>
          </div>
          <div>
            <h3 style={{ color: 'var(--primary)', margin: 0 }}>Secure</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>No Data Collection</p>
          </div>
        </div>  

      {/* --- LATEST BLOGS SECTION --- */}
      <section className="home-blog-footer" style={{ marginTop: '20px', paddingTop: '10px', borderTop: '1px solid var(--border-soft)', paddingBottom: '0px', marginBottom: '0px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Latest Financial Insights</h2>
          <Link href="/blog" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>View All Articles →</Link>
        </div>
        
        <div className="mini-blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {latestBlogs.map(([slug, post]) => (
            <Link href={`/blog/${slug}`} key={slug} className="minimal-blog-link" style={{ textDecoration: 'none' }}>
              <div style={{ 
                background: 'var(--card-bg)', 
                border: '1px solid var(--border-soft)',
                padding: '20px', 
                background: 'var(--bg-card)', 
                borderRadius: '12px', 
                border: '1px solid var(--border-soft)', 
                transition: '0.2s', 
                height: '100%' 
              }}>
                <span style={{ color: 'var(--primary)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>
                  {post.category || "Finance"}
                </span>
                <h4 style={{ margin: '10px 0', color: 'var(--text-main)', fontSize: '1.1rem' }}>
                  {post.title}
                </h4>
                <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                  {post.publishDate} • {post.readTime || "5 min read"}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* --- BOTTOM CTA --- */}
      <section style={{ 
  textAlign: 'center', 
  padding: '40px 20px', 
  background: 'var(--bg-cta)', 
  borderRadius: '20px', 
  color: 'var(--text-main)', 
  marginTop: '20px'
}}>
  <h2 className="text-gradient" style={{ fontSize: '2rem' }}>Ready to Plan Your Future?</h2>
  <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Simple tools for complex financial decisions.</p>
  <Link href="/tools/emi" className="btn-primary">Calculate My EMI Now</Link>
</section>
    </div>
  );
}