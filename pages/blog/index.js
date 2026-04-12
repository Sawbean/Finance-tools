import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { blogEducational } from "../../data/blogEducational";

export default function BlogIndex() {
  const [activeCategory, setActiveCategory] = useState("all");

  // Convert object → array
  let postsArray = Object.entries(blogEducational);

  // Sort latest first
  postsArray.sort(
    (a, b) => new Date(b[1].publishDate) - new Date(a[1].publishDate)
  );

  // Categories
  const categories = ["all", ...new Set(postsArray.map(([_, p]) => p.category))];

  // Filter
  const filteredPosts =
    activeCategory === "all"
      ? postsArray
      : postsArray.filter(([_, p]) => p.category === activeCategory);

  // Featured
  const [featuredSlug, featuredPost] = postsArray[0] || [];

  /* ================================
      JSON-LD (SEO BOOST)
  ================================= */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "ToolFinance Blog",
    "url": "https://finance-tools-mu.vercel.app/blog",
    "description": "Financial guides, tools, and strategies to improve your money decisions.",
  };

  return (
    <div className="blog-container">
      <Head>
        <title>Financial Blog | ToolFinance</title>
        <meta property="og:title" content="Financial Blog | ToolFinance" />
        <meta property="og:description" content="Learn smart money strategies, financial tools, and practical guides." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://finance-tools-mu.vercel.app/blog" />
        <meta property="og:image" content={`https://finance-tools-mu.vercel.app${featuredPost?.image || "/og-image.png"}`} />
        <meta name="description" content="Learn smart money strategies, financial tools, calculators, and practical guides to improve your financial decisions." />
        <link rel="canonical" href="https://finance-tools-mu.vercel.app/blog" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>

      {/* ================= NEW PROFESSIONAL HERO ================= */}
      <div className="blog-header">
        <h1 className="text-gradient">Financial Insights & Guides</h1>
        <p>Expert analysis and smart strategies to help you navigate the world of finance.</p>
      </div>

      {/* ================= UPDATED FEATURED SECTION ================= */}
      {featuredPost && (
        <section className="featured-hero">
          <Link href={`/blog/${featuredSlug}`} className="hero-wrapper">
            <div className="hero-image">
              <img src={featuredPost.image} alt={featuredPost.title} />
            </div>
            <div className="hero-info">
              <span className="category-badge">{featuredPost.category}</span>
              <h2>{featuredPost.title}</h2>
              <p>{featuredPost.description}</p>
              <div className="meta">
                <span>{featuredPost.publishDate}</span>
                <span style={{ marginLeft: '15px' }}>{featuredPost.readTime}</span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ================= CATEGORY TABS ================= */}
      <div className="category-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={activeCategory === cat ? "active" : ""}
            onClick={() => setActiveCategory(cat)}
          >
            {cat.replace("-", " ")}
          </button>
        ))}
      </div>

      <div className="adsense-placeholder cta-block">
        <Link href="/tools/emi">Try our EMI Calculator →</Link>
      </div>

      {/* ================= MAIN CONTENT GRID WITH SIDEBAR ================= */}
      <div className="blog-main-grid">
        
        {/* LEFT SIDE: The Post Feed */}
        <div className="blog-feed">
          {filteredPosts.slice(1).map(([slug, post]) => (
            <Link href={`/blog/${slug}`} key={slug} className="post-card-v2">
              <div className="card-img">
                <img src={post.image} alt={post.title} />
              </div>
              <div className="card-body">
                <span className="mini-tag">{post.category}</span>
                <h3>{post.title}</h3>
                <p>{post.description.substring(0, 100)}...</p>
                <div className="meta">
                  <span>{post.publishDate}</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* RIGHT SIDE: Sidebar for Better UX */}
        <aside className="blog-sidebar">
          <div className="sidebar-widget">
            <h4>Popular Tools</h4>
            <div className="sidebar-links">
              <Link href="/tools/emi">EMI Calculator</Link>
              <Link href="/tools/sip">SIP Calculator</Link>
              <Link href="/tools/loan-eligibility">Loan Eligibility</Link>
              <Link href="/tools/retirement">Retirement Planner</Link>
            </div>
          </div>

          <div className="sidebar-widget">
            <h4>Financial Education</h4>
            <p style={{ fontSize: '0.9rem', color: '#6b7280', lineHeight: '1.5' }}>
              We simplify complex financial concepts to help you build a better future.
            </p>
          </div>
        </aside>
      </div>

      {/* ================= BOTTOM CTA ================= */}
      <div className="blog-bottom-cta">
        <h3 className="text-gradient">Boost Your Financial Knowledge 🚀</h3>
        <p>Explore powerful tools and make smarter money decisions today.</p>
        <Link href="/" className="cta-btn">Explore Tools</Link>
      </div>
    </div>
  );
}