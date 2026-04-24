import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { financeArticles } from '../../../data/financeArticles';
import { toolGuides } from '../../../data/toolGuides';

export default function CategoryPage() {
  const { query: { id } } = useRouter();
  const themes = {
    foundation: { name: 'Financial Foundation', desc: 'Mastering the building blocks of economics.', color: '#64748b' },
    wealth: { name: 'Wealth Management', desc: 'Strategies for long-term growth and saving.', color: '#10b981' },
    markets: { name: 'Global Markets', desc: 'Analyzing trends in stocks, crypto, and fintech.', color: '#0ea5e9' },
    protection: { name: 'Risk & Protection', desc: 'Securing your assets and avoiding financial traps.', color: '#ef4444' },
    digital: { name: 'Digital Economy', desc: 'The future of online business and decentralized finance.', color: '#8b5cf6' },
    systems: { name: 'Systems & News', desc: 'Navigating taxes, banking, and global policy.', color: '#f59e0b' }
  };
  const cat = themes[id];
  const allPosts = { ...financeArticles, ...toolGuides };
  const filtered = Object.entries(allPosts).filter(([_, p]) => p.masterCategory === id).sort((a, b) => new Date(b[1].publishDate) - new Date(a[1].publishDate));

  if (!cat) return <div style={{textAlign: 'center', padding: '50px'}}>Loading {id}...</div>;

  return (
    <div className="blog-hub-container">
      <Head><title>{cat.name} | ToolFinance</title></Head>
      <nav className="article-breadcrumb"><Link href="/blog">Library</Link> / <span>{cat.name}</span></nav>
     <header style={{ marginBottom: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 20px'}}>
        <h1 style={{ fontSize: '3rem', fontWeight: '900' }}>{cat.name}</h1>
        <p style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: '700px', margin: '0 auto' }}>{cat.desc}</p>
      </header>
      <main className="blog-grid">
        {filtered.length > 0 ? filtered.map(([slug, post]) => (
          <Link href={`/blog/${slug}`} key={slug} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ display: 'flex', gap: '30px', marginBottom: '40px' }}>
              <div style={{ width: '150px', height: '150px', background: '#f1f5f9', borderRadius: '12px', flexShrink: 0, overflow: 'hidden' }}>
                <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <div style={{ display: 'inline-block', fontSize: '10px', fontWeight: '800', padding: '2px 8px', borderRadius: '4px', background: post.type === 'news' ? '#1e293b' : '#e2e8f0', color: post.type === 'news' ? '#fff' : '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>{post.type || 'Article'}</div>
                <h3 style={{ fontSize: '1.5rem', margin: '0 0 10px 0' }}>{post.title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.95rem', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.description}</p>
                <div style={{ marginTop: '15px', fontWeight: 'bold', color: cat.color }}>Read Analysis →</div>
              </div>
            </div>
          </Link>
        )) : <div style={{ textAlign: 'center', padding: '100px 0' }}><h3>Deep dive incoming.</h3><p>We are currently finalizing research for {cat.name}.</p><Link href="/blog" style={{color: cat.color, fontWeight: 'bold'}}>Return to Library</Link></div>}
      </main>
    </div>
  );
}