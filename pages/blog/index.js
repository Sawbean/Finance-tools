import { useState } from "react"; 
import Head from "next/head";
import Link from "next/link";
import { allFinanceArticles } from "../../data/articles/index";
import { allToolGuides } from "../../data/tool-guides/index";

export default function BlogIndex() {
  // 1. Search State
  const [searchQuery, setSearchQuery] = useState("");

  // 2. Define the 6 Master Categories 
  const categories = [
    { id: 'foundation', name: 'Financial Foundation', icon: '🎓', color: 'slate', desc: 'Basics & Economics' },
    { id: 'wealth', name: 'Wealth Management', icon: '💵', color: 'emerald', desc: 'Personal Finance' },
    { id: 'markets', name: 'Global Markets', icon: '📈', color: 'ocean', desc: 'Investing & FinTech' },
    { id: 'protection', name: 'Risk & Protection', icon: '🛡️', color: 'ruby', desc: 'Debt & Safety' },
    { id: 'digital', name: 'Digital Economy', icon: '💻', color: 'royal', desc: 'Online Business' },
    { id: 'systems', name: 'Systems & News', icon: '🏛️', color: 'gold', desc: 'Taxes & Banking' }
  ];

  // 3. Merge and Sort Data
  const allPosts = { ...allFinanceArticles, ...allToolGuides };
  const postsArray = Object.entries(allPosts).sort(
    (a, b) => new Date(b[1].publishDate) - new Date(a[1].publishDate)
  );

 // 4. Pro-Grade Search Filtering Logic
    const filteredPosts = postsArray.filter(([slug, post]) => {
      if (!post || !post.title) return false;
      
      // 1. Prepare data and clean the search query
      const catName = categories.find(c => c.id === post.masterCategory)?.name || "";
      const searchContent = `${post.title} ${post.description} ${post.category} ${catName} ${slug}`.toLowerCase();
      const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/); // Splits into individual words

      // 2. The "Every Word" Check: Ensure all typed words match the content
      return searchTerms.every(term => searchContent.includes(term));
    });

  
 

  return (
    <div className="blog-hub-container">
      <Head>
        <title>Financial & Economic Library | Global Authority</title>
      </Head>

      {/* --- SECTION 1: HUB HEADER --- */}
      <header className="hub-header">
        <h1 className="text-gradient">Knowledge Center</h1>
        <p>Your global gateway to financial intelligence and economic trends.</p>
      </header>

      {/* --- SECTION 2: SEARCH BAR --- */}
      <div className="search-container">
        <div style={{ position: 'relative', width: '100%' }}>
          <input 
            type="text" 
            placeholder="Search for articles, tools, or economic terms..." 
            className="main-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingRight: searchQuery ? '90px' : '25px' }} 
          />
          
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")} 
              style={{
                position: 'absolute',
                right: '20px', 
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#e2e8f0',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '11px',
                cursor: 'pointer',
                color: '#475569',
                fontWeight: '600',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#cbd5e1'}
              onMouseOut={(e) => e.currentTarget.style.background = '#e2e8f0'}
            >
              Clear ✕
            </button>
          )}
        </div>

        {searchQuery && (
          <p className="search-stats" style={{ marginTop: '15px', fontSize: '14px', color: '#64748b' }}>
            Found <strong>{filteredPosts.length}</strong> results for "{searchQuery}"
          </p>
        )}
      </div>

      {/* --- SECTION 3: CONDITIONAL CONTENT --- */}
      {!searchQuery ? (
        <>
          <section className="master-grid">
            {categories.map((cat) => {
              const count = postsArray.filter(([_, p]) => p.masterCategory === cat.id).length;
              return (
                <Link href={`/blog/category/${cat.id}`} key={cat.id} className={`master-card ${cat.color}`}>
                  <div className="card-icon">{cat.icon}</div>
                  <div className="card-info">
                    <h3>{cat.name}</h3>
                    <p>{cat.desc}</p>
                    <span className="article-count">{count} Articles</span>
                  </div>
                </Link>
              );
            })}
          </section>

          {/* --- UPDATED: STRATEGIC INTELLIGENCE HUB (The Magazine Layout) --- */}
          <section className="intelligence-hub" style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
            
            {/* Left: Strategic Analysis (Large Card) */}
            <div className="analysis-focus">
              <h2 className="hub-section-title">Strategic Analysis</h2>
              {postsArray
                .filter(([_, p]) => ['guide', 'case-study', 'white-paper'].includes(p.type))
                .slice(0, 1)
                .map(([slug, post]) => (
                  <Link href={`/blog/${slug}`} key={slug} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="featured-analysis-card">
                      <div className="featured-img-wrapper">
                        <img src={post.image} alt={post.title} />
                      </div>
                      <div className="featured-text-content">
                        <span className="featured-tag">{post.category || post.masterCategory}</span>
                        <h3>{post.title}</h3>
                        <p>{post.description?.substring(0, 150)}...</p>
                        <div className="read-analysis-btn">Read Full Analysis →</div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>

            {/* Right: Market Pulse (Mini List) */}
            <div className="market-pulse">
              <h2 className="hub-section-title">Market Pulse</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {postsArray
                  .filter(([_, p]) => p.type === 'news' || p.type === 'opinion')
                  .slice(0, 4)
                  .map(([slug, post]) => (
                    <Link href={`/blog/${slug}`} key={slug} className="pulse-row-item">
                      <div className="pulse-thumb">
                         <img src={post.image} alt={post.title} />
                      </div>
                      <div>
                        <h4>{post.title}</h4>
                        <span className="pulse-date">{post.publishDate}</span>
                      </div>
                    </Link>
                  ))}
                  <Link href="/blog/news" className="view-all-link">View All Intelligence →</Link>
              </div>
            </div>
          </section>
        </>
      ) : (
        /* UI VIEW B: Search Results */
        <section className="search-results-grid">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(([slug, post]) => (
              <Link href={`/blog/${slug}`} key={slug} className="standard-post-row" style={{ display: 'flex', gap: '20px', textDecoration: 'none', color: 'inherit', marginBottom: '25px' }}>
                <div style={{ width: '100px', height: '100px', background: '#eef2f6', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                   <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#2ecc71', textTransform: 'uppercase' }}>Result Found</span>
                  <h3 style={{ fontSize: '1.2rem', margin: '5px 0' }}>{post.title}</h3>
                  <p style={{ fontSize: '14px', color: '#64748b' }}>{post.description?.substring(0, 120)}...</p>
                </div>
              </Link>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <h3>No analysis matches your search.</h3>
              <p>Try searching for broader terms like "wealth", "scam", or "market".</p>
            </div>
          )}
        </section>
      )}

      {/* --- SECTION 4: RESEARCH ARCHIVE (Smart Filtered) --- */}
        <section style={{ marginTop: '40px', paddingBottom: '20px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '15px', borderBottom: '2px solid #eef2f6', paddingBottom: '10px' }}>Research Archive</h2>
          <div className="blog-grid">
            {(() => {
              const featSlug = postsArray.find(([_, p]) => ['guide', 'case-study', 'white-paper'].includes(p.type))?.[0];
              const pulseSlugs = postsArray.filter(([_, p]) => p.type === 'news' || p.type === 'opinion').slice(0, 4).map(([s]) => s);

              return postsArray.filter(([slug]) => slug !== featSlug && !pulseSlugs.includes(slug)).slice(0, 9).map(([slug, post]) => (
                <Link href={`/blog/${slug}`} key={slug} className="standard-post-row" style={{ display: 'flex', gap: '20px', textDecoration: 'none', color: 'inherit', marginBottom: '25px', alignItems: 'center' }}>
                  <div style={{ width: '100px', height: '100px', background: '#eef2f6', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                    <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{post.category || post.masterCategory || 'Library'}</span>
                    <h3 style={{ fontSize: '1.15rem', margin: '5px 0', lineHeight: '1.3' }}>{post.title}</h3>
                    <p style={{ fontSize: '14px', color: '#64748b', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.description}</p>
                  </div>
                </Link>
              ));
            })()}
          </div>
        </section>
    </div>
  );
}