import Head from "next/head";
import Link from "next/link";
import ToolCard from "../components/ui/ToolCard";
import { tools } from "../data/tools";
import styles from "../styles/Home.module.css";
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

const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://finance-tools-mu.vercel.app/#organization",
        "name": "ToolFinance",
        "url": "https://finance-tools-mu.vercel.app/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://finance-tools-mu.vercel.app/images/finlogo.png"
        },
        "description": "Smart financial calculators and investment guides for modern economic planning."
      },
      {
        "@type": "WebSite",
        "@id": "https://finance-tools-mu.vercel.app/#website",
        "url": "https://finance-tools-mu.vercel.app/",
        "name": "ToolFinance",
        "publisher": { "@id": "https://finance-tools-mu.vercel.app/#organization" },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://finance-tools-mu.vercel.app/blog?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <div className="container" style={{ paddingTop: '0px' }}>
      <Head>
        <title>ToolFinance | Smart Financial Calculators & Investment Guides</title>
        <meta name="description" content="Accurate financial calculators for EMI, SIP, Loans, and Taxes. Stay updated with our expert financial guides." />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
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
      <section className="home-blog-footer latest-insights">
        <div className="insights-header">
          <h2 className="section-title">Latest Financial Insights</h2>
          <Link href="/blog" className="view-all-link">View All Articles →</Link>
        </div>
        
        <div className="mini-blog-grid" >
          {latestBlogs.map(([slug, post]) => (
            <Link href={`/blog/${slug}`} key={slug} className="minimal-blog-link">
             <div className="minimal-blog-card">
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
        background: 'var(--bg-card)',
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