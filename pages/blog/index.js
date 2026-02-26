import Link from "next/link";
import { blogContent } from "../../data/blogPosts";

export default function BlogIndex() {
  const posts = Object.entries(blogContent);

  return (
    <div className="container">
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