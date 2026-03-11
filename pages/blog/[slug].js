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


  /* ================================
     JSON-LD STRUCTURED DATA
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
     EXTRACT H2 HEADINGS FOR TOC
  ================================= */

  const headings =
    post.content.match(/<h2>(.*?)<\/h2>/g)?.map((h) =>
      h.replace(/<\/?h2>/g, "")
    ) || [];


  /* ================================
     ADD ID TO EACH H2 FOR ANCHOR LINK
  ================================= */

  let sectionIndex = 0;

  const contentWithIds = post.content.replace(
    /<h2>/g,
    () => `<h2 id="section-${sectionIndex++}">`
  );


  return (

    <div className="container blog-page">

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
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd)
          }}
        />

      </Head>


      {/* BLOG HEADER */}

      <div className="blog-header">

        <h1>{post.title}</h1>

        <p className="blog-date">
          Published on {post.publishDate}
        </p>

      </div>



      {/* ADS PLACEHOLDER */}

      <div className="adsense-placeholder">
        Advertisement
      </div>



      {/* TABLE OF CONTENTS */}

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



      {/* BLOG CONTENT */}

      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: contentWithIds }}
      />



      {/* BOTTOM ACTION BUTTONS */}

      <div className="blog-bottom-actions">

        <Link href="/" className="blog-action-btn">
          Explore More Tools
        </Link>

        <Link href="/blog" className="blog-action-btn secondary">
          More About Finance
        </Link>

      </div>

    </div>

  );

}