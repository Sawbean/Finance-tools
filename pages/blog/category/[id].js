import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { financeArticles } from '../../../data/financeArticles';
import { toolGuides } from '../../../data/toolGuides';

export default function CategoryPage() {
  const router = useRouter();
  const { id } = router.query;

  // 1. Logic: Define Category details to show on the header
  const masterThemes = {
    foundation: { name: 'Financial Foundation', desc: 'Mastering the building blocks of economics.', color: '#64748b' },
    wealth: { name: 'Wealth Management', desc: 'Strategies for long-term growth and saving.', color: '#10b981' },
    markets: { name: 'Global Markets', desc: 'Analyzing trends in stocks, crypto, and fintech.', color: '#0ea5e9' },
    protection: { name: 'Risk & Protection', desc: 'Securing your assets and avoiding financial traps.', color: '#ef4444' },
    digital: { name: 'Digital Economy', desc: 'The future of online business and decentralized finance.', color: '#8b5cf6' },
    systems: { name: 'Systems & News', desc: 'Navigating taxes, banking, and global policy.', color: '#f59e0b' }
  };

  const category = masterThemes[id];

  // 2. Filter all articles that match this masterCategory
  const allPosts = { ...financeArticles, ...toolGuides };
  const filteredPosts = Object.entries(allPosts).filter(([_, p]) => p.masterCategory === id);

  if (!category) return <div className="loading">Loading Category...</div>;

  return (
    <div className="blog-hub-container">
      <Head>
        <title>{category.name} | Research Archive</title>
      </Head>

      <nav className="article-breadcrumb">
        <Link href="/blog">Library</Link> / <span>{category.name}</span>
      </nav>

      <header className="category-header" style={{ marginBottom: '60px', borderLeft: `8px solid ${category.color}`, paddingLeft: '30px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '900' }}>{category.name}</h1>
        <p style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: '700px' }}>{category.desc}</p>
      </header>

      <main className="blog-grid">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(([slug, post]) => (
            <Link href={`/blog/${slug}`} key={slug} className="standard-post-row" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ display: 'flex', gap: '30px', marginBottom: '40px' }}>
                <div style={{ width: '150px', height: '150px', background: '#f1f5f9', borderRadius: '12px', flexShrink: 0, overflow: 'hidden' }}>
                    <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{post.title}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.95rem' }}>{post.description}</p>
                  <div style={{ marginTop: '15px', fontWeight: 'bold', color: category.color }}>Read Analysis →</div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div style={{ padding: '100px 0', textAlign: 'center' }}>
            <h3>No articles found in this discipline yet.</h3>
            <Link href="/blog">Return to Library</Link>
          </div>
        )}
      </main>
    </div>
  );
}