import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import React from "react";

// 1. DATA SOURCES
import { financeArticles } from "../../data/financeArticles";
import { toolGuides } from "../../data/toolGuides";

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;

  if (!router.isReady || !slug) return <div className="container"><p>Loading...</p></div>;

  const allPosts = { ...financeArticles, ...toolGuides };
  const post = allPosts[slug];

  if (!post) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h1>Content Not Found</h1>
        <Link href="/blog" className="blog-action-btn">Back to Library</Link>
      </div>
    );
  }

  // 2. MASTER THEMING & SMART TOOL MAPPING
  const masterThemes = {
    foundation: { color: "#64748b", label: "Economics", tool: { name: "Budget Planner", link: "/tools/budgeter" } },
    wealth: { color: "#10b981", label: "Wealth", tool: { name: "SIP Calculator", link: "/tools/sip-calculator" } },
    markets: { color: "#0ea5e9", label: "Markets", tool: { name: "Stock Estimator", link: "/tools/stock-calc" } },
    protection: { color: "#ef4444", label: "Security", tool: { name: "Loan EMI Tool", link: "/tools/loan-emi" } },
    digital: { color: "#8b5cf6", label: "Digital", tool: { name: "Profit Margin Tool", link: "/tools/margin-calculator" } },
    systems: { color: "#f59e0b", label: "Systems", tool: { name: "Tax Estimator", link: "/tools/tax-calc" } }
  };

  const currentTheme = masterThemes[post.masterCategory] || { color: "#2563eb", label: "Guide" };
  const smartTool = currentTheme.tool;

  // 3. RELATED ARTICLES LOGIC
  const relatedPosts = Object.entries(allPosts)
    .filter(([s, p]) => p.masterCategory === post.masterCategory && s !== slug)
    .slice(0, 2);

  // 4. RENDER LOGIC
  const renderBlock = (block, index) => {
    if (!block) return null;
    switch (block.type) {
      case "paragraph": return <p key={index} className="article-p">{block.text}</p>;
      case "heading": return <h2 id={`section-${index}`} key={index} className="article-h2">{block.text}</h2>;
      case "sub-heading": return <h3 key={index} className="article-h3">{block.text}</h3>;
      case "keyTakeaways": return (
        <div key={index} className="takeaways-box" style={{ borderLeft: `4px solid ${currentTheme.color}` }}>
          <h4 style={{ color: currentTheme.color }}>⚡ Key Takeaways</h4>
          <ul>{block.items.map((item, i) => <li key={i}>{item}</li>)}</ul>
        </div>
      );
      case "table": return (
        <div key={index} className="table-responsive">
          <table className="pro-table">
            <thead><tr>{block.headers.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
            <tbody>{block.rows.map((row, ri) => (
              <tr key={ri}>{row.map((cell, ci) => <td key={ci}>{cell}</td>)}</tr>
            ))}</tbody>
          </table>
        </div>
      );
      case "formula": return (
        <div key={index} className="formula-box">
          <p className="formula-label">{block.label}</p>
          <code className="formula-code">{block.equation}</code>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className={`blog-master-wrapper ${post.masterCategory}-theme`}>
      <Head>
        <title>{post.title} | Global Finance Library</title>
      </Head>

      {/* --- BREADCRUMBS --- */}
      <nav className="article-breadcrumb">
        <Link href="/">Home</Link> / <Link href="/blog">Library</Link> / 
        <Link href={`/blog/category/${post.masterCategory}`} style={{ color: currentTheme.color, fontWeight: 'bold', textDecoration: 'none' }}> {currentTheme.label}</Link>
      </nav>

      <header className="article-header">
        <span className="article-badge" style={{ backgroundColor: currentTheme.color }}>
            {post.category}
        </span>
        <h1 className="article-title">{post.title}</h1>
        <div className="article-meta">
          <span>{post.publishDate}</span> • <span>{post.readTime}</span>
        </div>
      </header>

      {post.image && (
        <div className="article-featured-image">
          <Image src={post.image} alt={post.title} width={1200} height={600} priority style={{ borderRadius: '16px', objectFit: 'cover' }} />
        </div>
      )}

      <div className="article-layout-container">
        <article className="article-body">
          {post.content && post.content.map((block, index) => {
            // INLINE TOOL BOX
            if (index === 1 && post.tool) {
              return (
                <React.Fragment key="cta">
                  {renderBlock(block, index)}
                  <div className="inline-tool-box" style={{ borderLeft: `5px solid ${currentTheme.color}` }}>
                    <div>
                      <h4>Interactive Analysis</h4>
                      <p>Apply these concepts using our {post.tool.replace("-", " ")}.</p>
                    </div>
                    <Link href={`/tools/${post.tool}`} className="inline-tool-btn" style={{ background: currentTheme.color }}>
                      Open Tool →
                    </Link>
                  </div>
                </React.Fragment>
              );
            }
            return renderBlock(block, index);
          })}

          {/* --- NEW: SHARE SECTION --- */}
          <div className="share-article-box" style={{ marginTop: '50px', padding: '30px 0', borderTop: '1px solid #eef2f6' }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '15px' }}>SHARE ANALYSIS:</span>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <a 
                href={`https://twitter.com/intent/tweet?url=https://yourdomain.com/blog/${slug}&text=${encodeURIComponent(post.title)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="share-btn twitter"
              >
                X / Twitter
              </a>
              <a 
                href={`https://www.linkedin.com/sharing/share-offsite/?url=https://yourdomain.com/blog/${slug}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="share-btn linkedin"
              >
                LinkedIn
              </a>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }} 
                className="share-btn copy"
              >
                Copy Link
              </button>
            </div>
          </div>

          {/* --- RELATED ANALYTICS SECTION --- */}
          {relatedPosts.length > 0 && (
            <div className="related-section" style={{ marginTop: '20px', borderTop: '1px solid #eef2f6', paddingTop: '40px' }}>
              <h4 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>Related Analysis</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {relatedPosts.map(([s, p]) => (
                  <Link href={`/blog/${s}`} key={s} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', height: '100%' }}>
                      <span style={{ fontSize: '10px', color: currentTheme.color, fontWeight: 'bold' }}>{p.category}</span>
                      <h5 style={{ margin: '5px 0' }}>{p.title}</h5>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* --- DYNAMIC SIDEBAR --- */}
        <aside className="article-sidebar">
          <div className="sidebar-card">
            <h4>Intelligence Category</h4>
            <p>This research is part of our <strong>{currentTheme.label}</strong> discipline.</p>
          </div>
          
          {smartTool && (
            <div className="sidebar-card" style={{ borderTop: `4px solid ${currentTheme.color}` }}>
              <h4>Recommended Tool</h4>
              <p>Based on this article, you may find the <strong>{smartTool.name}</strong> useful.</p>
              <Link href={smartTool.link} style={{ color: currentTheme.color, fontWeight: '800', textDecoration: 'none', display: 'block', marginTop: '10px' }}>
                Try Calculator →
              </Link>
            </div>
          )}

          <div className="sidebar-card" style={{ opacity: 0.8 }}>
            <h4 style={{ fontSize: '14px' }}>Global Disclaimer</h4>
            <p style={{ fontSize: '12px' }}>This content is for educational purposes. Consult a certified advisor for specific legal or tax decisions.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}