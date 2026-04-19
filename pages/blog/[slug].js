import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import React from "react";

// 1. DATA SOURCES
import { financeArticles } from "../../data/financeArticles";
import { toolGuides } from "../../data/toolGuides";

// NEW: Import the standardized Ad component
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;

  if (!router.isReady || !slug) return <div className="container"><p>Loading...</p></div>;

  const allPosts = { ...financeArticles, ...toolGuides };
  const post = allPosts[slug];

  // Helper to check if this is a finance article for specific ad logic
  const isFinanceArticle = !!financeArticles[slug];

  if (!post) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h1>Content Not Found</h1>
        <Link href="/blog" className="blog-action-btn">Back to Library</Link>
      </div>
    );
  }

  // 2. MASTER THEMING
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
      
      case "list": return (
        <ul key={index} className="article-list">
          {block.items.map((item, i) => (
            <li key={i}>
              {item.includes('**') ? (
                item.split('**').map((part, idx) => idx % 2 === 1 ? <strong key={idx}>{part}</strong> : part)
              ) : item}
            </li>
          ))}
        </ul>
      );

      case "image": return (
        <div key={index} className="article-inner-image">
          <img src={block.src} alt={block.alt} style={{ maxWidth: '100%', borderRadius: '12px' }} />
          {block.alt && <p className="image-caption">{block.alt}</p>}
        </div>
      );

      case "cta": return (
        <div key={index} className="article-cta-wrapper" style={{ margin: '40px 0', textAlign: 'center' }}>
          <Link href={block.link} className="inline-tool-btn" style={{ background: currentTheme.color }}>
            {block.text}
          </Link>
        </div>
      );

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
        <div key={index} style={{ clear: 'both', width: '100%', display: 'block', margin: '40px 0' }}>
            <div className="formula-box" style={{ margin: 0 }}>
              <div className="formula-code" style={{ whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
                {block.text || block.equation}
              </div>
              {block.caption && <p className="formula-caption-text">{block.caption}</p>}
            </div>
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

      <nav className="article-breadcrumb">
        <Link href="/">Home</Link> / <Link href="/blog">Library</Link> / 
        <Link href={`/blog/category/${post.masterCategory}`} style={{ color: currentTheme.color, fontWeight: 'bold', textDecoration: 'none' }}> {currentTheme.label}</Link>
      </nav>

      <header className="article-header">
        <span className="article-badge" style={{ backgroundColor: currentTheme.color }}>
            {post.category || currentTheme.label}
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
          {post.content && post.content.map((block, index) => (
            <React.Fragment key={index}>
              {renderBlock(block, index)}
              
              {/* MID-CONTENT AD: Excellent for UI/UX and Traffic. 
                  Injected after the 2nd block if it's a Finance Article */}
              {isFinanceArticle && index === 1 && post.tool && (
                <div style={{ margin: '40px 0' }}>
                  <AdPlaceholder 
                    toolLink={`/tools/${post.tool}`} 
                    ctaText={`Calculated Insight: Use the ${post.tool.replace("-", " ").toUpperCase()} →`} 
                  />
                </div>
              )}
            </React.Fragment>
          ))}

          {/* BOTTOM AD: Final CTA before social/FAQ */}
          {isFinanceArticle && post.tool && (
            <div style={{ marginTop: '50px' }}>
              <AdPlaceholder 
                toolLink={`/tools/${post.tool}`} 
                ctaText={`Take Action: Try our ${post.tool.replace("-", " ").toUpperCase()} Calculator →`} 
              />
            </div>
          )}

          {post.faq && post.faq.length > 0 && (
            <div className="article-faq-container" style={{ marginTop: '40px', borderTop: '2px solid #f1f5f9', paddingTop: '30px' }}>
              <h2 className="article-h2">Frequently Asked Questions</h2>
              {post.faq.map((item, idx) => (
                <div key={idx} className="faq-card" style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #eef2f6' }}>
                  <h4 style={{ color: '#1e293b', marginBottom: '10px' }}>
                    <span style={{ color: currentTheme.color }}>Q:</span> {item.question}
                  </h4>
                  <p style={{ color: '#475569' }}>
                    {item.answer.includes('**') ? item.answer.split('**').map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part) : item.answer}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="share-article-section" style={{ marginTop: '50px', paddingTop: '30px', borderTop: '1px solid #f1f5f9' }}>
            <p style={{ fontSize: '14px', fontWeight: '700', color: '#64748b', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Share this Analysis:</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://yourdomain.com/blog/${slug}`)}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="share-btn twitter"
              >
                X (Twitter)
              </a>
              <a 
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://yourdomain.com/blog/${slug}`)}`} 
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

          {relatedPosts.length > 0 && (
            <div className="related-section" style={{ marginTop: '40px', borderTop: '1px solid #eef2f6', paddingTop: '40px' }}>
              <h4 style={{ marginBottom: '20px' }}>Related Analysis</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {relatedPosts.map(([s, p]) => (
                  <Link href={`/blog/${s}`} key={s} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px' }}>
                      <span style={{ fontSize: '10px', color: currentTheme.color, fontWeight: 'bold' }}>{p.category}</span>
                      <h5 style={{ margin: '5px 0' }}>{p.title}</h5>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        <aside className="article-sidebar">
          <div className="sidebar-card">
            <h4>Intelligence Category</h4>
            <p>Part of our <strong>{currentTheme.label}</strong> discipline.</p>
          </div>
          {smartTool && (
            <div className="sidebar-card" style={{ borderTop: `4px solid ${currentTheme.color}` }}>
              <h4>Recommended Tool</h4>
              <p>Try the <strong>{smartTool.name}</strong>.</p>
              <Link href={smartTool.link} style={{ color: currentTheme.color, fontWeight: '800', textDecoration: 'none' }}>Try Calculator →</Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}