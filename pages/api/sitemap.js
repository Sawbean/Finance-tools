// pages/api/sitemap.js

import fs from "fs";
import path from "path";
import { blogContent } from "../../data/blogPosts";

const SITE_URL = "https://finance-tools-mu.vercel.app";

export default function handler(req, res) {
  const currentDate = new Date().toISOString();

  // Static pages
  const staticPages = ["", "/blog"];

  // Tools
  const toolsDir = path.join(process.cwd(), "pages/tools");

  const toolPages = fs
    .readdirSync(toolsDir)
    .filter((file) => file.endsWith(".js"))
    .map((file) => `/tools/${file.replace(".js", "")}`);

  // Blogs
  const blogPages = Object.keys(blogContent).map(
    (slug) => `/blog/${slug}`
  );

  const allPages = [...staticPages, ...toolPages, ...blogPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (url) => `
  <url>
    <loc>${SITE_URL}${url}</loc>
    <lastmod>${currentDate}</lastmod>
  </url>`
  )
  .join("")}
</urlset>`;

  res.setHeader("Content-Type", "text/xml");
  res.status(200).send(sitemap);
}