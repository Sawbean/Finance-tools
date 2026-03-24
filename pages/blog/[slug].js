// pages/blog/[slug].js

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

// IMPORT BOTH SOURCES
import { blogEducational } from "../../data/blogEducational";
import { toolGuides } from "../../data/toolGuides";

export default function BlogPost() {

  const router = useRouter();
  const { slug } = router.query;

  if (!slug) return <p>Loading...</p>;

  // ✅ MERGE BOTH CONTENT TYPES
  const allPosts = {
    ...blogEducational,
    ...toolGuides
  };

  const post = allPosts[slug];

  if (!post) return <p>Post not found.</p>;


  /* ================================
     JSON-LD STRUCTURED DATA (SEO)
  ================================= */

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
        "url": "https://finance-tools-mu.vercel.app/logo.png"
      }
    },
    "datePublished": post.publishDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://finance-tools-mu.vercel.app/blog/${slug}`
    }
  };


  /* ================================
     TABLE OF CONTENTS
  ================================= */

  const headings =
    post.content.match(/<h2>(.*?)<\/h2>/g)?.map((h) =>
      h.replace(/<\/?h2>/g, "")
    ) || [];


  /* ================================
     ADD IDs TO H2
  ================================= */

  let sectionIndex = 0;

  const contentWithIds = post.content.replace(
    /<h2>/g,
    () => `<h2 id="section-${sectionIndex++}">`
  );


  /* ================================
     RELATED POSTS (ENGAGEMENT BOOST)
  ================================= */

  const relatedPosts = Object.entries(allPosts)
    .filter(([key]) => key !== slug)
    .slice(0, 3);


  return (

    <div className="container blog-page">

      <Head>

        <title>{post.title} | ToolFinance</title>

        <meta name="description" content={post.description} />

        <meta name="keywords" content={post.keywords?.join(", ")} />

        <link
          rel="canonical"
          href={`https://finance-tools-mu.vercel.app/blog/${slug}`}
        />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd)
          }}
        />

      </Head>


      {/* ================================
         HEADER
      ================================= */}

      <div className="blog-header">
        <h1>{post.title}</h1>
        <p className="blog-date">
          Published on {post.publishDate}
        </p>
      </div>


      {/* ================================
         TOP AD (AdSense)
      ================================= */}

      <div className="adsense-placeholder">
        Advertisement
      </div>


      {/* ================================
         TABLE OF CONTENTS
      ================================= */}

      {headings.length > 0 && (
        <div className="table-of-contents">
          <h3>Contents</h3>
          <ul>
            {headings.map((heading, index) => (
              <li key={index}>
                <a href={`#section-${index}`}>
                  {heading}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}


      {/* ================================
         BLOG CONTENT (FIRST HALF)
      ================================= */}

      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: contentWithIds }}
      />


      {/* ================================
         MIDDLE AD (BEST PERFORMING)
      ================================= */}

      <div className="adsense-placeholder">
        Advertisement
      </div>


      {/* ================================
         FAQ SECTION (SEO BOOST)
      ================================= */}

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


      {/* ================================
         RELATED POSTS (TRAFFIC BOOST)
      ================================= */}

      <div className="related-posts">
        <h3>Related Articles</h3>

        <div className="related-grid">
          {relatedPosts.map(([slug, item]) => (
            <div key={slug} className="related-card">
              <h4>{item.title}</h4>
              <Link href={`/blog/${slug}`}>
                Read More →
              </Link>
            </div>
          ))}
        </div>
      </div>


      {/* ================================
         BOTTOM AD
      ================================= */}

      <div className="adsense-placeholder">
        Advertisement
      </div>


      {/* ================================
         ACTION BUTTONS
      ================================= */}

      <div className="blog-bottom-actions">

        <Link href="/" className="blog-action-btn">
          Explore More Tools
        </Link>

        <Link href="/blog" className="blog-action-btn secondary">
          More Finance Articles
        </Link>

      </div>

    </div>

  );

}