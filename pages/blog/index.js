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
    "description":
      "Financial guides, tools, and strategies to improve your money decisions.",
  };

  return (
    <div className="blog-container">
      <Head>
        <title>Financial Blog | ToolFinance</title>

        <meta property="og:title" content="Financial Blog | ToolFinance" />
        <meta
          property="og:description"
          content="Learn smart money strategies, financial tools, and practical guides."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://finance-tools-mu.vercel.app/blog"
        />
        <meta
          property="og:image"
          content={`https://finance-tools-mu.vercel.app${
            featuredPost?.image || "/og-image.png"
          }`}
        />

        <meta
          name="description"
          content="Learn smart money strategies, financial tools, calculators, and practical guides to improve your financial decisions."
        />

        <link
          rel="canonical"
          href="https://finance-tools-mu.vercel.app/blog"
        />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </Head>

      {/* ================= HERO ================= */}
      <div className="blog-header">
        <h1>Financial Insights & Guides</h1>
        <p>
          Learn smart money strategies, explore financial tools, and grow your
          wealth with practical insights.
        </p>
      </div>

      {/* ================= TOP AD ================= */}
      <div className="adsense-placeholder cta-block">
        <Link href="/tools/emi">Try our EMI Calculator →</Link>
      </div>

      {/* ================= FEATURED (VERY IMPORTANT) ================= */}
      {featuredPost && (
        <Link href={`/blog/${featuredSlug}`} className="featured-card">
          <img src={featuredPost.image} alt={featuredPost.title} />

          <div className="featured-content">
            <span className="badge">🔥 Featured</span>

            <h2>{featuredPost.title}</h2>
            <p>{featuredPost.description}</p>

            <div className="meta">
              <span>{featuredPost.publishDate}</span>
              <span>{featuredPost.readTime}</span>
            </div>
          </div>
        </Link>
      )}

      {/* ================= CATEGORY ================= */}
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

      {/* ================= MIDDLE AD ================= */}
      <div className="adsense-placeholder cta-block">
        <Link href="/tools/emi">Try our EMI Calculator →</Link>
      </div>

      {/* ================= BLOG GRID ================= */}
      <div className="blog-grid">
        {filteredPosts.map(([slug, post]) => (
          <div key={slug} className="blog-card">

            {/* ✅ FIX 1: CATEGORY TAG (NEW POSITION) */}
            <span className="blog-tag">{post.category}</span>

            <Link href={`/blog/${slug}`}>
              <img src={post.image} alt={post.title} />
            </Link>

            {/* ✅ FIX 2: CONTENT WRAPPER */}
            <div className="blog-card-content">

              <h3>
                <Link href={`/blog/${slug}`}>
                  {post.title}
                </Link>
              </h3>

              <p>{post.description}</p>

              <div className="meta">
                <span>{post.publishDate}</span>
                <span>{post.readTime}</span>
              </div>

              <Link href={`/blog/${slug}`} className="read-more">
                Read article →
              </Link>

            </div>
          </div>
        ))}
      </div>

      {/* ================= BOTTOM AD ================= */}
      <div className="adsense-placeholder cta-block">
        <Link href="/tools/emi">Try our EMI Calculator →</Link>
      </div>

      {/* ================= CTA ================= */}
      <div className="blog-bottom-cta">
        <h3>Boost Your Financial Knowledge 🚀</h3>
        <p>Explore powerful tools and make smarter money decisions today.</p>

        <Link href="/" className="cta-btn">
          Explore Tools
        </Link>
      </div>
    </div>
  );
}