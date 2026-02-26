// pages/blog/[slug].js
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { blogContent } from "../../data/blogPosts";

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;

  if (!slug) return <p>Loading...</p>;

  const post = blogContent[slug];
  if (!post) return <p>Post not found.</p>;

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "author": { "@type": "Organization", "name": "ToolFinance" },
    "publisher": {
      "@type": "Organization",
      "name": "ToolFinance",
      "logo": {
        "@type": "ImageObject",
        "url": "https://finance-tools-mu.vercel.app/logo.png" // Your real logo URL
      }
    },
    "datePublished": post.publishDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://finance-tools-mu.vercel.app/blog/${slug}`
    }
  };

  return (
    <div className="blog-container">
      <Head>
        <title>{post.title} | ToolFinance</title>
        <meta name="description" content={post.description} />
        <meta name="keywords" content={post.keywords.join(", ")} />
        <link
          rel="canonical"
          href={`https://finance-tools-mu.vercel.app/blog/${slug}`}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <h1>{post.title}</h1>

      {/* AdSense placeholder */}
      <div
        className="adsense-placeholder"
        style={{
          margin: "20px 0",
          textAlign: "center",
          background: "#f0f0f0",
          padding: "10px",
          border: "1px dashed #ccc"
        }}
      >
        Advertisement
      </div>

      {/* Blog content rendered as HTML */}
      <div dangerouslySetInnerHTML={{ __html: post.content }} />

      <div style={{ marginTop: "30px" }}>
        <h3>Explore Our Tools:</h3>
        <ul>
          <li>
            <Link href="/tools/emi">EMI Calculator</Link>
          </li>
          <li>
            <Link href="/tools/loan">Loan Calculator</Link>
          </li>
          <li>
            <Link href="/tools/fuel">Fuel Calculator</Link>
          </li>
        </ul>
      </div>

      {/* Back link */}
      <Link href="/blog" className="back-link" style={{ display: "block", marginTop: "20px" }}>
        ← Back to Blog
      </Link>
    </div>
  );
}