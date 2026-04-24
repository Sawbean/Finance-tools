import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "../../styles/Home.module.css";
import React, { useState, useEffect } from "react";

// 1. DATA SOURCES
import { financeArticles } from "../../data/financeArticles";
import { toolGuides } from "../../data/toolGuides";

// NEW: Import the standardized Ad component
import AdPlaceholder from "../../components/ads/AdPlaceholder";

export default function BlogPost() {
  const [readingProgress, setReadingProgress] = useState(0);
    useEffect(() => {
      const updateProgress = () => {
        const currentProgress = window.scrollY;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollHeight) {
          setReadingProgress(Number((currentProgress / scrollHeight).toFixed(2)) * 100);
        }
      };
      window.addEventListener("scroll", updateProgress);
      return () => window.removeEventListener("scroll", updateProgress);
    }, []);
  const router = useRouter();
  const { slug } = router.query;
  //  "Master Switch" for my domain
  const siteDomain = "https://finance-tools-mu.vercel.app";

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
  const headings = post.content ? post.content.filter(block => block.type === "heading") : [];

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
      case "note": return (
      <div key={index} className="article-note-box" style={{ 
        margin: '30px 0', 
        padding: '20px', 
        background: '#fff7ed', // Light warm orange/yellow
        border: '1px solid #ffedd5', 
        borderRadius: '12px',
        display: 'flex',
        gap: '15px',
        alignItems: 'center'
      }}>
        <span style={{ fontSize: '20px' }}>⚠️</span>
        <p style={{ 
          margin: 0, 
          fontSize: '14px', 
          color: '#9a3412', // Darker brownish-orange for readability
          lineHeight: '1.6',
          fontStyle: 'italic'
        }}>
          {block.text}
        </p>
      </div>
    );
      case "list": return (
        <ul key={index} className="article-list">
          {block.items.map((item, i) => {
            // Logic to find [text](url) and turn it into a link
            const linkRegex = /\[(.*?)\]\((.*?)\)/g;
            const parts = item.split(linkRegex);
            
            return (
              <li key={i}>
                {parts.map((part, idx) => {
                  // This is a bit complex, but it lets you put links in your toolGuides.js strings
                  if (idx % 3 === 1) return <Link key={idx} href={parts[idx+1]} style={{color: currentTheme.color, fontWeight: 'bold'}}>{part}</Link>;
                  if (idx % 3 === 2) return null; // skip the URL part
                  
                  // Handle the bolding ** inside the non-link parts
                  return part.includes('**') ? (
                    part.split('**').map((sub, sIdx) => sIdx % 2 === 1 ? <strong key={sIdx}>{sub}</strong> : sub)
                  ) : part;
                })}
              </li>
            );
          })}
        </ul>
      );

      case "image": return (
        <div key={index} className="article-inner-image">
          <img src={block.src} alt={block.alt} style={{ maxWidth: '100%', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }} />
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
        <div key={index} className="takeaways-box" style={{ backgroundColor: '#f8fafc', borderRadius: '12px', marginBottom: '30px'}}>
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
      <div key={index} className="formula-card" style={{ 
        margin: '40px 0', 
        background: '#f8fafc', 
        border: '1px solid #e2e8f0', 
        borderRadius: '16px', 
        overflow: 'hidden' 
      }}>
        <div style={{ background: currentTheme.color, color: '#fff', padding: '8px 20px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Mathematical Proof
        </div>
        <div style={{ padding: '30px 20px', textAlign: 'center' }}>
          <div style={{ 
            fontSize: '1.5rem', 
            fontFamily: '"Times New Roman", serif', 
            fontStyle: 'italic', 
            color: '#1e293b',
            overflowX: 'auto',
            paddingBottom: '10px'
          }}>
            {/* We strip the $$ symbols dynamically for a cleaner look */}
            {block.text ? block.text.replace(/\$\$/g, '') : ''}
          </div>
          {block.caption && (
            <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px dotted #cbd5e1', fontSize: '13px', color: '#64748b' }}>
              {block.caption}
            </div>
          )}
        </div>
      </div>
    );

      default: return null;
    }
  };

  return (
    <div className={`blog-master-wrapper ${post.masterCategory}-theme`}>
      <Head>
      <title>{post.title} | ToolFinance</title>
      <meta name="description" content={post.excerpt || `Learn everything about ${post.title}. Expert financial analysis and tools from ToolFinance.`} />
      
      {/* 1. The Canonical Link: Prevents duplicate content issues */}
      <link rel="canonical" href={`${siteDomain}/blog/${slug}`} />

      {/* 2. Open Graph (Facebook, LinkedIn, WhatsApp) */}
      <meta property="og:type" content="article" />
      <meta property="og:url" content={`${siteDomain}/blog/${slug}`} />
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={post.excerpt} />
      {/* Join the domain and the image path */}
      <meta property="og:image" content={post.image?.startsWith('http') ? post.image : `${siteDomain}${post.image}`} />

      {/* 3. Twitter Cards: Makes the post look big and clickable on X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={post.title} />
      <meta name="twitter:description" content={post.excerpt} />
      <meta name="twitter:image" content={post.image?.startsWith('http') ? post.image : `${siteDomain}${post.image}`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "NewsArticle", "headline": post.title, "description": post.excerpt, "author": {"@type": "Organization", "name": "ToolFinance"}, "datePublished": post.publishDate, "image": `${siteDomain}${post.image}` }) }} />
    </Head>

    <div style={{ position: 'fixed', top: 0, left: 0, width: `${readingProgress}%`, height: '4px', background: currentTheme.color, zIndex: 1000, transition: 'width 0.2s ease'}} />

      <nav className="article-breadcrumb">
        <Link href="/">Home</Link> / <Link href="/blog">Library</Link> / 
        <Link href={`/blog/category/${post.masterCategory}`} style={{ color: currentTheme.color, fontWeight: 'bold', textDecoration: 'none' }}> {currentTheme.label}</Link>
      </nav>

      <header className="article-header">
        {/* Flex container to keep Badge and Verified text on one line */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
        {/* This badge now shows the TYPE (News, Case Study, etc.) in a sleek dark theme */}
        <span className="article-badge" style={{ 
          backgroundColor: '#1e293b', 
          color: '#ffffff', 
          textTransform: 'uppercase', 
          fontSize: '11px', 
          letterSpacing: '1px' 
        }}>
          {post.type || 'Intelligence'}
        </span>

        {/* We keep the VERIFIED text next to it for authority */}
        <span style={{ 
          fontSize: '12px', 
          color: '#10b981', 
          fontWeight: 'bold', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '4px' 
        }}>
          ✅ Verified
        </span>
      </div>

        <h1 className="article-title">{post.title}</h1>

        <div className="article-meta">
          <span>📅 Updated: {post.publishDate}</span> • <span>⏱️ {post.readTime} Read</span>
        </div>
      </header>

      {post.image && (
        <div className="article-featured-image">
          <Image src={post.image} alt={post.title} width={1200} height={450} priority style={{ borderRadius: '16px', objectFit: 'cover' }} />
        </div>
      )}

      <div className="article-layout-container" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '50px', maxWidth: '1200px', margin: '0 auto', alignItems: 'start'}}>
        <article className="article-body">
          {headings.length > 0 && (
            <div className="table-of-contents" style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
              <h4 style={{ margin: '0 0 10px 0' }}>Jump to Section:</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {headings.map((h, i) => (
                  <li key={i} style={{ marginBottom: '8px' }}>
                    <a href={`#section-${post.content.findIndex(b => b.text === h.text)}`} style={{ color: currentTheme.color, textDecoration: 'none', fontSize: '14px' }}>
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
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

          <div className="author-box" style={{ display: 'flex', gap: '20px', alignItems: 'center', background: '#fff', border: '1px solid #eef2f6', padding: '20px', borderRadius: '16px', marginTop: '40px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: currentTheme.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
              TF
            </div>
            <div>
              <h5 style={{ margin: 0 }}>ToolFinance Editorial Team ✅</h5>
              <p style={{ margin: '5px 0 0', fontSize: '13px', color: '#64748b' }}>
                Verified for 2026 Accuracy. Our financial guides are cross-referenced with current bank lending standards and math-verified by our internal calculation engine. 
              </p>
            </div>
          </div>

          <div className="share-article-section" style={{ marginTop: '50px', paddingTop: '30px', borderTop: '1px solid #f1f5f9' }}>
            <p style={{ fontSize: '14px', fontWeight: '700', color: '#64748b', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Share this Analysis:</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {/* Twitter / X */}
              <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${siteDomain}/blog/${slug}`)}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="share-btn twitter"
              >
                X (Twitter)
              </a>

              {/* LinkedIn */}
              <a 
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${siteDomain}/blog/${slug}`)}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="share-btn linkedin"
              >
                LinkedIn
              </a>

              {/* Copy Link Button - This one uses the browser's current URL automatically */}
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

        <aside className="article-sidebar" style={{ position: 'sticky', top: '100px', height: 'fit-content', zIndex: 10}}>
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