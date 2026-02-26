// pages/blog/[slug].js
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { blogContent } from "../../data/blogPosts";

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;

  // Prevent rendering before router query is ready
  if (!slug) return <p>Loading...</p>;

  const post = blogContent[slug];

  if (!post) return <p>Post not found.</p>;

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "author": {
      "@type": "Organization",
      "name": "ToolFinance"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ToolFinance",
      "logo": {
        "@type": "ImageObject",
        "url": "https://yourwebsite.com/logo.png" // Replace with your logo URL
      }
    },
    "datePublished": post.publishDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://yourwebsite.com/blog/${slug}`
    }
  };

  return (
    <div className="blog-container">
      <Head>
        <title>{post.title} | ToolFinance</title>
        <meta name="description" content={post.description} />
        <meta name="keywords" content={post.keywords.join(", ")} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <h1>{post.title}</h1>

      {/* Blog content rendered as HTML */}
      <div dangerouslySetInnerHTML={{ __html: post.content }} />

      {/* Back link */}
      <Link href="/blog" className="back-link">
        ← Back to Blog
      </Link>
    </div>
  );
}