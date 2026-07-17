import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "../../styles/Home.module.css";
import React, { useState, useEffect } from "react";


// 1. DATA SOURCES
//import { financeArticles } from "../../data/financeArticles";
//import { toolGuides } from "../../data/toolGuides";
import { allFinanceArticles } from "../../data/articles/index";
import { allToolGuides } from "../../data/tool-guides/index";

// NEW: Import the standardized Ad component
import AdPlaceholder from "../../components/ads/AdPlaceholder";

console.log("ALL GUIDES KEYS:", Object.keys(allToolGuides));
// 💡 HELPER: Combine them into one library for the slug to search
const allContent = { ...allFinanceArticles, ...allToolGuides };
const safeArray = (data) => (Array.isArray(data) ? data : []);


export default function BlogPost() {
  const [readingProgress, setReadingProgress] = useState(0);
  const [currentMonthYear, setCurrentMonthYear] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateProgress = () => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight) {
        setReadingProgress(Number((currentProgress / scrollHeight).toFixed(2)) * 100);
      }
    };
    const dateStr = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date());
    setCurrentMonthYear(dateStr);
    window.addEventListener("scroll", updateProgress);
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  const router = useRouter();
  const { slug } = router.query;
  //  "Master Switch" for my domain
  const siteDomain = "https://finance-tools-mu.vercel.app";

  // --- FIX 1: Hydration Guard (Prevents layout/theme flashes) ---
  if (!mounted) {
    return <div className="blog-master-wrapper" style={{ opacity: 0 }} />;
  }

  // --- FIX 2: Router Guard (Waits for the URL parameter to load) ---
  if (!router.isReady || !slug) {
    return (
      <div className="blog-master-wrapper">
        <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
          <p>Loading Assets...</p>
        </div>
      </div>
    );
  }

  const post = allContent[slug];

  // Helper to check if this is a finance article for specific ad logic
  const isFinanceArticle = !!allFinanceArticles[slug];

  // --- FIX 3: Clean Content Error Guard ---
  if (!post) {
    return (
      <div className="blog-master-wrapper">
        <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
          <h1>Content Not Found</h1>
          <Link href="/blog" className="blog-action-btn">Back to Library</Link>
        </div>
      </div>
    );
  }

  const headings = post.content ? safeArray(post.content).filter(block => block.type === "heading") : [];

  // 2. MASTER THEMING
  const masterThemes = {
    foundation: { color: "#64748b", label: "Economics", tool: { name: "Budget Planner", link: "/tools/inflation" } },
    wealth: { color: "#10b981", label: "Wealth", tool: { name: "SIP Calculator", link: "/tools/sip" } },
    markets: { color: "#0ea5e9", label: "Markets", tool: { name: "Stock Estimator", link: "/tools/stock-average" } },
    protection: { color: "#ef4444", label: "Security", tool: { name: "Loan EMI Tool", link: "/tools/emi" } },
    digital: { color: "#8b5cf6", label: "Digital", tool: { name: "Profit Margin Tool", link: "/tools/margin-markup" } },
    systems: { color: "#f59e0b", label: "Systems", tool: { name: "Tax Estimator", link: "/tools/income-tax" } }
  };

  const currentTheme = masterThemes[post.masterCategory] || { color: "#2563eb", label: "Guide" };
  const smartTool = currentTheme.tool;
  
  // 3. RELATED ARTICLES LOGIC
  const relatedPosts = Object.entries(allContent)
    .filter(([s, p]) => p && p.masterCategory === post.masterCategory && s !== slug)
    .slice(0, 2);

  // 4. RENDER LOGIC
  const renderBlock = (block, index) => {
    if (!block) return null;
    switch (block.type) {
      case "paragraph": 
  return (
    <p 
      key={index} 
      className="article-p" 
      dangerouslySetInnerHTML={{ __html: block.text }} 
    />
  );
      case "heading": return <h2 id={`section-${index}`} key={index} className="article-h2">{block.text}</h2>;
      case "sub-heading": return <h3 key={index} className="article-h3">{block.text}</h3>;
      case "note": return (
      <div key={index} className="article-note-box" style={{ 
        margin: '30px 0', 
        padding: '20px', 
        background: 'var(--note-bg)',
        border: '1px solid var(--note-border)', 
        borderRadius: '12px',
        display: 'flex',
        gap: '15px',
        alignItems: 'center',
        transition: 'all 0.3s ease'
      }}>
       <span style={{ fontSize: '20px' }}>⚠️</span>
        <p 
          style={{ 
            margin: 0, 
            fontSize: '14px', 
            color: 'var(--note-text)', 
            lineHeight: '1.6',
            fontStyle: 'italic'
          }}
          dangerouslySetInnerHTML={{ __html: block.text }}
        />
      </div>
    );
    case "list":
      return (
        <ul key={index} className="article-list">
          {safeArray(block.items).map((item, i) => (
            <li
              key={i}
              dangerouslySetInnerHTML={{ __html: item }}
            />
          ))}
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
        <div key={index} className="takeaways-box" style={{borderRadius: '12px', marginBottom: '30px'}}>
          <h4 style={{ color: currentTheme.color }}>⚡ Key Takeaways</h4>
         <ul>
          {(block.items || []).map((item, i) => (
            <li
              key={i}
              dangerouslySetInnerHTML={{
                __html: item
                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
              }}
            />
          ))}
        </ul>
        </div>
      );
         case "table":
          {
            // Ensure we have a fallback for headers
            const headers = Array.isArray(block.headers)
              ? block.headers
              : Array.isArray(block.columns)
              ? block.columns
              : [];

            // Ensure rows is an array
            const rows = Array.isArray(block.rows) ? block.rows : [];

            return (
              <div key={index} className="table-responsive" style={{ margin: '20px 0', overflowX: 'auto' }}>
                <table className="pro-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  {headers.length > 0 && (
                    <thead>
                      <tr>
                        {headers.map((h, i) => (
                          <th key={i} style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid #e2e8f0' }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                  )}
                  <tbody>
                    {rows.map((row, ri) => (
                      <tr key={ri} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        {(Array.isArray(row) ? row : []).map((cell, ci) => (
                          <td key={ci} style={{ padding: '12px', fontSize: '14px' }}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }

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
            <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px dotted #cbd5e1', fontSize: '14px', color: '#64748b' }}>
              {block.caption}
            </div>
          )}
        </div>
      </div>
    );

    case "definitionBox":
  return (
    <div key={index} className="definition-box">
      <h4>{block.title}</h4>
      <p>{block.text || ""}</p>
    </div>
  );

  case "stepBreakdown":
  return (
    <div key={index} className="step-box">
      <h4>{block.title}</h4>
      <ol>
        {safeArray(block.steps).map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
    </div>
  );

  case "dataInsight":
  return (
    <div key={index} className="data-insight">
      <h4>{block.title}</h4>
      <p>{block.text || ""}</p>
    </div>
  );
   
          case "chart":
          return (
            <div key={index} className="chart-block">
              <h4>{block.title}</h4>
              <pre>{block.data}</pre>
            </div>
          );

        case "comparisonTable":
        return (
          <table key={index}>
            <thead>
              <tr>
                {safeArray(block.headers).map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>

            <tbody>
            {safeArray(block.rows).map((r, ri) => (
              <tr key={ri}>
                {(Array.isArray(r) ? r : []).map((c, ci) => (
                  <td key={ci}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
          </table>
        );

  case "inlineImage":
  return (
    <div key={index}>
      <img
        src={block.src || "/images/default.webp"}
         alt={block.alt || "finance insight image"}
        loading="lazy"
      />
      <p>{block.caption || ""}</p>
    </div>
  );

  default:
  return (
    <div key={index} className="unknown-block">
      {block.title && <h4>{block.title}</h4>}
      <p>{block.text || ""}</p>
    </div>
  );
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
      <meta property="og:image" content={post.image ? (post.image.startsWith('http') ? post.image : `${siteDomain}${post.image}`) : `${siteDomain}/default-share-image.jpg`}/>

      {/* 3. Twitter Cards: Makes the post look big and clickable on X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={post.title} />
      <meta name="twitter:description" content={post.excerpt} />
      <meta name="twitter:image" content={post.image ? (post.image.startsWith('http') ? post.image : `${siteDomain}${post.image}`) : `${siteDomain}/default-share-image.jpg`}/>
     <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": [{ "@type": "BlogPosting", "headline": post.title, "description": post.excerpt || post.title, "image": post.image ? (post.image.startsWith('http') ? post.image : `${siteDomain}${post.image}`) : `${siteDomain}/og-image.png`, "datePublished": post.publishDate || new Date().toISOString(), "author": { "@type": "Organization", "name": "ToolFinance", "url": siteDomain }, "publisher": { "@type": "Organization", "name": "ToolFinance", "logo": { "@type": "ImageObject", "url": `${siteDomain}/favicon-32x32.png` } }, "mainEntityOfPage": { "@type": "WebPage", "@id": `${siteDomain}/blog/${slug}` } }, post.faq && post.faq.length > 0 ? { "@type": "FAQPage", "mainEntity": post.faq.map(item => ({ "@type": "Question", "name": item.question, "acceptedAnswer": { "@type": "Answer", "text": item.answer.replace(/\*\*/g, '') } })) } : null].filter(Boolean) }) }} />
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
          backgroundColor: 'var(--bg-card)', 
          color: 'var(--text-main)', 
          textTransform: 'uppercase', 
          fontSize: '11px', 
          letterSpacing: '1px' 
        }}>
          {post.type || 'Intelligence'}
        </span>

        {/* We keep the VERIFIED text next to it for authority */}
        <span style={{ 
          fontSize: '12px', 
          color: 'var(--accent-blue)', 
          fontWeight: 'bold', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '4px' 
        }}>
          ✅ Verified
        </span>
      </div>

        <h1 className="article-title">{post.title}</h1>

        <div className="article-meta" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px', alignItems: 'center', color: 'var(--text-muted)', fontSize: '14px', marginTop: '15px' }}>
          <span>📅 {post.publishDate}</span> • <span>⏱️ {post.readTime}</span> • 
          <span style={{ textTransform: 'uppercase', fontSize: '11px', fontWeight: 'bold', color: 'var(--accent-blue)' }}>{post.type}</span>
          
          {/* Category Box */}
          <span style={{ padding: '4px 10px', background: `${currentTheme.color}15`, borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', color: currentTheme.color }}>
            {post.category}
          </span>

          {/* Dynamic Trust Tag */}
          <span style={{ color: '#10b981', fontWeight: '600', fontSize: '13px' }}>
            ✅ Verified: {currentMonthYear}
          </span>
        </div>
      </header>

      {post.image && (
        <div className="article-featured-image">
          <Image src={post.image} alt={post.title} width={1200} height={450} priority style={{ borderRadius: '16px', objectFit: 'cover' }} />
        </div>
      )}

      <div className="article-layout-container" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '30px', maxWidth: '1200px', margin: '0 auto', alignItems: 'flex-start', paddingBottom: '40px'}}>
        <article className="article-body">
          {headings.length > 0 && (
            <div className="table-of-contents" style={{padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
              <h4 style={{ margin: '0 0 10px 0' }}>Jump to Section:</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {(Array.isArray(headings) ? headings : []).map((h, i) => (
                  <li key={i} style={{ marginBottom: '8px' }}>
                    <a href={`#section-${post.content.indexOf(h)}`} style={{ color: currentTheme.color, textDecoration: 'none', fontSize: '14px' }}>
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {post.content && (Array.isArray(post.content) ? post.content : []).map((block, index) => (
            <React.Fragment key={index}>
              {renderBlock(block, index)}
              
              {/* MID-CONTENT AD: Excellent for UI/UX and Traffic. 
                  Injected after the 2nd block if it's a Finance Article */}
              {isFinanceArticle && index === 1 && post.tool && (
                  <AdPlaceholder 
                    toolLink={`/tools/${post.tool}`} 
                    ctaText={`Calculated Insight: Use the ${post.tool.replace("-", " ").toUpperCase()} →`} 
                  />
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
            <div className="article-faq-container" style={{ marginTop: '40px', borderTop: `2px solid var(--border-soft)`, paddingTop: '30px' }}>
              <h2 className="article-h2">Frequently Asked Questions</h2>
              {(Array.isArray(post.faq) ? post.faq : []).map((item, idx) => (
                <div key={idx} className="faq-card" style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid var(--border-soft)' }}>
                  <h4 style={{ color: 'var(--text-main)', marginBottom: '10px' }}>
                    <span style={{ color: 'var(--accent-blue)' }}>Q:</span> {item.question}
                  </h4>
                  <p style={{ color: 'var(--text-muted)' }}>
                    {item.answer.includes('**') ? item.answer.split('**').map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part) : item.answer}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="author-box" style={{ display: 'flex', gap: '20px', alignItems: 'center', background: 'var(--card-bg)', border: '1px solid var(--border-soft)', padding: '20px', borderRadius: '16px', marginTop: '40px', marginBottom: '0px', fontSize: '15px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: currentTheme.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
              TF
            </div>
            <div>
              <h5 style={{ margin: 0 }}>ToolFinance Editorial Team ✅</h5>
              <p style={{ margin: '5px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                Verified for 2026 Accuracy. Our financial guides are cross-referenced with current bank lending standards and math-verified by our internal calculation engine. 
              </p>
            </div>
          </div>

          <div className="share-article-section" style={{ marginTop: '40px', paddingTop: '20px', fontSize: '15px', borderTop: '1px solid var(--border-soft)' }}>
            <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Share this Analysis:</p>
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
            <div className="related-section">
              <h4>Related Analysis</h4>
              <div className="related-grid">
                {relatedPosts.map(([s, p]) => (
                  <Link href={`/blog/${s}`} key={s} className="related-card-link">
                    <div className="related-card">
                      <span className="related-category">{p.category}</span>
                      <h5 className="related-title">{p.title}</h5>
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