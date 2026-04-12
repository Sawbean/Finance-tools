import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import React from "react";

// IMPORT BLOG SOURCES
import { blogEducational } from "../../data/blogEducational";
import { toolGuides } from "../../data/toolGuides";

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;

  if (!slug) return <div className="container"><p>Loading...</p></div>;

  // Merge all posts from your two new files
  const allPosts = { ...blogEducational, ...toolGuides };
  const post = allPosts[slug];

  // 1. Handle case where post doesn't exist
  if (!post) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h1>Post Not Found</h1>
        <p>The article you are looking for does not exist or has been moved.</p>
        <Link href="/blog" className="blog-action-btn">Back to Blog</Link>
      </div>
    );
  }

  // 2. Safety Check for JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title || "Financial Guide",
    description: post.description || "",
    author: { "@type": "Organization", name: "ToolFinance" },
    publisher: {
      "@type": "Organization",
      name: "ToolFinance",
      logo: { "@type": "ImageObject", url: "https://finance-tools-mu.vercel.app/logo.png" }
    },
    datePublished: post.publishDate,
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://finance-tools-mu.vercel.app/blog/${slug}` },
    image: post.image ? `https://finance-tools-mu.vercel.app${post.image}` : "",
    ...(post.faq && Array.isArray(post.faq) && {
      mainEntity: post.faq.map(f => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer }
      }))
    })
  };

  // 3. Table of Contents - Defensive Filter
  const headings = Array.isArray(post.content)
    ? post.content
        .filter(block => block.type === "heading")
        .map((block, i) => ({ text: block.text, id: `section-${i}` }))
    : [];

  // 4. Render blocks logic (UPDATED WITH PROFESSIONAL SUB-BLOCKS)
  const renderBlock = (block, index) => {
    if (!block) return null;
    
    switch (block.type) {
      case "paragraph":
        return <p key={index}>{block.text}</p>;

      case "heading":
        return (
          <h2 id={`section-${index}`} key={index}>
            {block.text}
          </h2>
        );

      // --- NEW SUGGESTED UPDATES START ---
      case "sub-heading":
        return (
          <h3 key={index} style={{ marginTop: '30px', color: '#111827', fontSize: '1.4rem' }}>
            {block.text}
          </h3>
        );

      case "divider":
        return <hr key={index} style={{ margin: '40px 0', border: '0', borderTop: '1px solid #eee' }} />;
      // --- NEW SUGGESTED UPDATES END ---

      case "list":
        return (
          <ul key={index}>
            {Array.isArray(block.items) && block.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );

      case "image":
        return (
          <div key={index} className="blog-image-wrapper">
            <Image
                src={block.src}
                alt={`${post.title} - ${block.alt || 'image'}`}
                width={800}
                height={533}
                style={{ width: "100%", height: "auto" }}
                className="blog-image"
                priority={index === 0}
            />
          </div>
        );

      case "video":
        return (
          <div className="video-wrapper" key={index}>
            <iframe src={block.url} allowFullScreen title="Video Content" />
          </div>
        );

      case "cta":
        return (
          <Link href={`/tools/${post.tool || ''}`} key={index} className="cta-box">
            {block.text}
          </Link>
        );

      case "callout":
        return (
          <div key={index} className={`callout ${block.style || 'info'}`}>
            {block.text}
          </div>
        );

      default:
        return null;
    }
  };

  // Related posts
  const relatedPosts = Object.entries(allPosts)
    .filter(([key]) => key !== slug)
    .slice(0, 3);

  return (
    <div className="container blog-page">
      <Head>
        <title>{post.title} | ToolFinance</title>
        <meta name="description" content={post.description} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:image" content={`https://finance-tools-mu.vercel.app${post.image}`} />
        <link rel="canonical" href={`https://finance-tools-mu.vercel.app/blog/${slug}`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      {/* HERO */}
      <div className="blog-hero">
        <div className="overlay"> 
          <h1>{post.title}</h1>  
          <div className="meta">
            <span>{post.publishDate}</span>
            <span style={{ marginLeft: '15px' }}>{post.readTime}</span>
          </div>
        </div>
      </div>

      {/* TOP CTA */}
      {post.tool && (
        <div className="adsense-placeholder cta-block">
          <Link href={`/tools/${post.tool}`}>Try our {post.tool.toUpperCase()} Calculator →</Link>
        </div>
      )}

      {/* TOC */}
      {headings.length > 0 && (
        <div className="table-of-contents">
          <h3 className="text-gradient">Contents</h3>
          <ul>
            {headings.map((h, i) => (
              <li key={i}>
                <a href={`#${h.id}`}>{h.text}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* BLOG CONTENT */}
      <article className="blog-content">
        {Array.isArray(post.content) ? (
          post.content.map((block, index) => {
            // Inject Ad/CTA after 4th block if it's a long post
            if (index === 3 && post.tool) {
              return (
                <React.Fragment key={index}>
                  {renderBlock(block, index)}
                  <div className="adsense-placeholder cta-block">
                    <Link href={`/tools/${post.tool}`}>Try our {post.tool.toUpperCase()} Calculator →</Link>
                  </div>
                </React.Fragment>
              );
            }
            return renderBlock(block, index);
          })
        ) : (
          <p>Content is currently being updated.</p>
        )}
      </article>

      {/* FAQ */}
      {post.faq && Array.isArray(post.faq) && (
        <div className="faq-section">
          <h2 className="text-gradient">Frequently Asked Questions</h2>
          {post.faq.map((item, index) => (
            <div key={index} className="faq-item">
              <h4>{item.question}</h4>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      )}

      {/* RELATED POSTS */}
      <div className="related-posts">
        <h3 className="text-gradient">Related Articles</h3>
        <div className="related-grid">
          {relatedPosts.map(([relSlug, item]) => (
            <div key={relSlug} className="related-card">
              <h4>{item.title}</h4>
              <Link href={`/blog/${relSlug}`}>Read More →</Link>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM ACTIONS */}
      <div className="blog-bottom-actions">
        <Link href="/" className="blog-action-btn">Explore Tools</Link>
        <Link href="/blog" className="blog-action-btn secondary">More Articles</Link>
      </div>
    </div>
  );
}