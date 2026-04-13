import { useState } from "react"; // Added for search state
import Head from "next/head";
import Link from "next/link";
import { financeArticles } from "../../data/financeArticles";
import { toolGuides } from "../../data/toolGuides";

export default function BlogIndex() {
  // 1. Search State
  const [searchQuery, setSearchQuery] = useState("");

  // 2. Merge and Sort Data
  const allPosts = { ...financeArticles, ...toolGuides };
  const postsArray = Object.entries(allPosts).sort(
    (a, b) => new Date(b[1].publishDate) - new Date(a[1].publishDate)
  );

  // 3. Search Filtering Logic
  const filteredPosts = postsArray.filter(([slug, post]) => {
    const contentToSearch = `${post.title} ${post.description} ${post.category}`.toLowerCase();
    return contentToSearch.includes(searchQuery.toLowerCase());
  });

  // 4. Define the 6 Master Categories
  const categories = [
    { id: 'foundation', name: 'Financial Foundation', icon: '🎓', color: 'slate', desc: 'Basics & Economics' },
    { id: 'wealth', name: 'Wealth Management', icon: '💵', color: 'emerald', desc: 'Personal Finance' },
    { id: 'markets', name: 'Global Markets', icon: '📈', color: 'ocean', desc: 'Investing & FinTech' },
    { id: 'protection', name: 'Risk & Protection', icon: '🛡️', color: 'ruby', desc: 'Debt & Safety' },
    { id: 'digital', name: 'Digital Economy', icon: '💻', color: 'royal', desc: 'Online Business' },
    { id: 'systems', name: 'Systems & News', icon: '🏛️', color: 'gold', desc: 'Taxes & Banking' }
  ];

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
        <input 
          type="text" 
          placeholder="Search for articles, tools, or economic terms..." 
          className="main-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <p className="search-stats">
            Found {filteredPosts.length} results for "{searchQuery}"
          </p>
        )}
      </div>

      {/* --- SECTION 3: CONDITIONAL CONTENT --- */}
      {!searchQuery ? (
        /* UI VIEW A: The Master Directory (Default) */
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

          {/* TRENDING NEWS SECTION */}
          <section className="trending-section" style={{ marginTop: '60px' }}>
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Economic Pulse & Trends</h2>
              <Link href="/blog/category/systems" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>View All Updates →</Link>
            </div>
            
            <div className="news-scroll" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
              {postsArray
                .filter(([_, p]) => p.type === 'news')
                .slice(0, 3)
                .map(([slug, post]) => (
                  <Link href={`/blog/${slug}`} key={slug} className="news-card-mini" style={{ background: '#f8fafc', padding: '25px', borderRadius: '16px', textDecoration: 'none', color: 'inherit', border: '1px solid #eef2f6' }}>
                    <div className="news-tag" style={{ background: '#1e293b', color: '#fff', fontSize: '10px', padding: '3px 8px', borderRadius: '4px', width: 'fit-content', marginBottom: '12px' }}>NEWS</div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>{post.title}</h4>
                    <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>{post.description?.substring(0, 90)}...</p>
                  </Link>
              ))}
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

      {/* --- SECTION 4: RECENT GUIDES (Always visible at bottom) --- */}
      <section style={{ marginTop: '80px', paddingBottom: '60px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '30px', borderBottom: '2px solid #eef2f6', paddingBottom: '10px' }}>Recently Added Guides</h2>
        <div className="blog-grid">
          {postsArray.slice(0, 6).map(([slug, post]) => (
            <Link href={`/blog/${slug}`} key={slug} className="standard-post-row" style={{ display: 'flex', gap: '20px', textDecoration: 'none', color: 'inherit', marginBottom: '25px' }}>
              <div style={{ width: '100px', height: '100px', background: '#eef2f6', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                 <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase' }}>{post.masterCategory || 'Library'}</span>
                <h3 style={{ fontSize: '1.2rem', margin: '5px 0' }}>{post.title}</h3>
                <p style={{ fontSize: '14px', color: '#64748b' }}>{post.description?.substring(0, 120)}...</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}