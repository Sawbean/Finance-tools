import Head from 'next/head';
import Link from 'next/link';
import { allFinanceArticles } from "../../data/articles/index";
import { allToolGuides } from "../../data/tool-guides/index";

export default function NewsFeed() {
  const allPosts = { ...allFinanceArticles, ...allToolGuides };
  // Filter for ONLY news and opinions across ALL categories
  const newsPosts = Object.entries(allPosts)
    .filter(([_, p]) => p.type === 'news' || p.type === 'opinion')
    .sort((a, b) => new Date(b[1].publishDate) - new Date(a[1].publishDate));

  return (
    <div className="blog-hub-container">
      <Head>
        <title>Market Pulse & News Feed | Global Intelligence</title>
        <meta name="description" content="Real-time updates, expert opinions, and financial news on the global economy from ToolFinance." />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "itemListElement": newsPosts.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "url": `https://finance-tools-mu.vercel.app/blog/${item[0]}`,
            "name": item[1].title
          }))
        }) }} />
      </Head>

      <nav className="article-breadcrumb">
        <Link href="/blog">Library</Link> / <span>Market Pulse</span>
      </nav>

      <header style={{ marginBottom: '50px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900' }}>Market Pulse</h1>
        <p style={{ color: '#64748b' }}>Real-time updates and expert opinions on the global economy.</p>
      </header>

      <main>
        {newsPosts.map(([slug, post]) => (
          <Link href={`/blog/${slug}`} key={slug} className="news-feed-item" style={{ textDecoration: 'none', color: 'inherit', display: 'block', marginBottom: '30px' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', padding: '20px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #eef2f6' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
                <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b' }}>{post.publishDate}</span>
                <h3 style={{ fontSize: '1.2rem', margin: '5px 0' }}>{post.title}</h3>
              </div>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}