// pages/blog/[slug].js

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

  if (!slug) return <p>Loading...</p>;

  // Merge all posts
  const allPosts = { ...blogEducational, ...toolGuides };
  const post = allPosts[slug];

  if (!post) return <p>Post not found.</p>;

  // JSON-LD for SEO + FAQ
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    author: { "@type": "Organization", name: "ToolFinance" },
    publisher: {
      "@type": "Organization",
      name: "ToolFinance",
      logo: { "@type": "ImageObject", url: "https://finance-tools-mu.vercel.app/logo.png" }
    },
    datePublished: post.publishDate,
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://finance-tools-mu.vercel.app/blog/${slug}` },
    image: `https://finance-tools-mu.vercel.app${post.image}`,
    ...(post.faq && {
      mainEntity: post.faq.map(f => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer }
      }))
    })
  };

  // Table of Contents
  const headings = post.content
    .filter(block => block.type === "heading")
    .map((block, i) => ({ text: block.text, id: `section-${i}` }));

  // Render blocks
  const renderBlock = (block, index) => {
    switch (block.type) {
      case "paragraph":
        return <p key={index}>{block.text}</p>;

      case "heading":
        // Prevent first heading from duplicating title
        
        return (
          <h2 id={`section-${index}`} key={index}>
            {block.text}
          </h2>
        );

      case "list":
        return (
          <ul key={index}>
            {block.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );

      case "image":
        return (
          <div key={index} className="blog-image-wrapper">
            <Image
                src={block.src}
                alt={`${post.title} - ${block.alt}`}
                width={800} // base width
                height={533} // base height
                style={{ width: "100%", height: "auto" }} // fully responsive
                className="blog-image"
                priority
            />
          </div>
        );

      case "video":
        return (
          <div className="video-wrapper" key={index}>
            <iframe src={block.url} allowFullScreen />
          </div>
        );

      case "cta":
        return (
          <Link href={`/tools/${post.tool}`} key={index} className="cta-box">
            {block.text}
          </Link>
        );

      case "callout":
        return (
          <div key={index} className={`callout ${block.style}`}>
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
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://finance-tools-mu.vercel.app/blog/${slug}`} />
        <meta property="og:image" content={`https://finance-tools-mu.vercel.app${post.image}`} />
        <meta name="description" content={post.description} />
        <meta name="keywords" content={post.keywords?.join(", ")} />
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
            <span>{post.readTime}</span>
          </div>
        </div>
      </div>

      {/* TOP CTA */}
      <div className="adsense-placeholder cta-block">
        <Link href={`/tools/${post.tool}`}>Try our {post.tool.toUpperCase()} Calculator →</Link>
      </div>

      {/* TOC */}
      {headings.length > 0 && (
        <div className="table-of-contents">
          <h3>Contents</h3>
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
        {post.content.map((block, index) => {
          if (index === 3) {
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
        })}
      </article>

      {/* FAQ */}
      {post.faq && (
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
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
        <h3>Related Articles</h3>
        <div className="related-grid">
          {relatedPosts.map(([slug, item]) => (
            <div key={slug} className="related-card">
              <h4>{item.title}</h4>
              <Link href={`/blog/${slug}`}>Read More →</Link>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM CTA */}
      <div className="adsense-placeholder cta-block">
        <Link href={`/tools/${post.tool}`}>Try our {post.tool.toUpperCase()} Calculator →</Link>
      </div>

      {/* BOTTOM ACTIONS */}
      <div className="blog-bottom-actions">
        <Link href="/" className="blog-action-btn">Explore Tools</Link>
        <Link href="/blog" className="blog-action-btn secondary">More Articles</Link>
      </div>
    </div>
  );
}