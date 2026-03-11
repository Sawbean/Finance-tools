import Head from "next/head";
import Link from "next/link";
import { blogContent } from "../../data/blogPosts";

export default function BlogIndex() {
  const posts = Object.entries(blogContent);

  return (
    <div className="container">

      <Head>
        <title>Financial Blog | ToolFinance</title>
        <meta
          name="description"
          content="Read financial guides on loans, EMI, fuel cost calculation, and personal finance tips."
        />
        <link
          rel="canonical"
          href="https://finance-tools-mu.vercel.app/blog"
        />
      </Head>

      <h1>📖 Financial Blog</h1>

      <div className="blog-grid">
        {posts.map(([slug, post]) => (
          <div key={slug} className="blog-card">

            <h3>{post.title}</h3>

            <p>{post.description}</p>

            <Link href={`/blog/${slug}`} className="read-more">
              Read More →
            </Link>

          </div>
        ))}
      </div>

    </div>
  );
}