import Head from "next/head";
import Link from "next/link";
import { blogEducational } from "../../data/blogEducational";

export default function BlogIndex() {

  // Convert object → array
  const postsArray = Object.entries(blogEducational);

  // Sort by latest
  postsArray.sort(
    (a, b) => new Date(b[1].publishDate) - new Date(a[1].publishDate)
  );

  return (
    <div className="container">

      <Head>
        <title>Financial Blog | ToolFinance</title>

        <meta
          name="description"
          content="Explore financial guides on saving, budgeting, loans, and personal finance tips to improve your money management."
        />

        <meta
          name="keywords"
          content="finance blog, saving tips, budgeting, loans, personal finance, Nepal finance, ToolFinance"
        />

        <link
          rel="canonical"
          href="https://finance-tools-mu.vercel.app/blog"
        />

        {/* Open Graph (for sharing) */}
        <meta property="og:title" content="Financial Blog | ToolFinance" />
        <meta
          property="og:description"
          content="Learn finance with simple guides on saving, budgeting, and money management."
        />
        <meta property="og:type" content="website" />
      </Head>


      {/* ================================
         HEADER
      ================================= */}

      <div className="blog-header">
        <h1>📖 Financial Blog</h1>

        <p className="blog-intro">
          Learn personal finance with simple, practical guides on saving, budgeting,
          loans, and money management. Improve your financial knowledge step by step.
        </p>
      </div>


      {/* ================================
         TOP AD (AdSense)
      ================================= */}

      <div className="adsense-placeholder">
        Advertisement
      </div>


      {/* ================================
         BLOG GRID
      ================================= */}

      <div className="blog-grid">

        {postsArray.length === 0 ? (
          <p>No articles available yet.</p>
        ) : (
          postsArray.map(([slug, post]) => (
            <div key={slug} className="blog-card">

              {/* Image */}
              {post.image && (
                <div className="blog-card-image">
                  <img src={post.image} alt={post.title} />
                </div>
              )}

              {/* Title */}
              <h3>{post.title}</h3>

              {/* Date (SEO + trust) */}
              <p className="blog-date">
                {post.publishDate}
              </p>

              {/* Description */}
              <p>{post.description}</p>

              {/* CTA */}
              <Link href={`/blog/${slug}`} className="read-more">
                Read More →
              </Link>

            </div>
          ))
        )}

      </div>


      {/* ================================
         BOTTOM AD
      ================================= */}

      <div className="adsense-placeholder">
        Advertisement
      </div>

    </div>
  );
}