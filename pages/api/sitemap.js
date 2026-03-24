// pages/api/sitemap.js
import fs from "fs";
import path from "path";
import { blogEducational } from "../../data/blogEducational";
import { blogGuides } from "../../data/blogGuides";

const SITE_URL = "https://finance-tools-mu.vercel.app";

export default function handler(req, res) {
  const currentDate = new Date().toISOString();

  // ================================
  // STATIC PAGES
  // ================================
  const staticPages = ["", "/blog"];

  // ================================
  // TOOLS PAGES
  // ================================
  const toolsDir = path.join(process.cwd(), "pages/tools");

  let toolPages = [];
  try {
    toolPages = fs
      .readdirSync(toolsDir)
      .filter((file) => file.endsWith(".js"))
      .map((file) => `/tools/${file.replace(".js", "")}`);
  } catch (err) {
    console.warn("Warning: Tools directory not found", err);
  }

  // ================================
  // BLOG PAGES
  // ================================
  // Merge all blog files for sitemap
  const allBlogs = { ...blogEducational, ...blogGuides };

  const blogPages = Object.keys(allBlogs).map((slug) => {
    const blog = allBlogs[slug];
    const lastmod = blog.lastModified || currentDate;
    return {
      url: `/blog/${slug}`,
      lastmod,
    };
  });

  // ================================
  // BUILD ALL PAGES
  // ================================
  const allPages = [
    ...staticPages.map((url) => ({ url, lastmod: currentDate })),
    ...toolPages.map((url) => ({ url, lastmod: currentDate })),
    ...blogPages,
  ];

  // ================================
  // GENERATE SITEMAP XML
  // ================================
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>`;

  // ================================
  // SEND RESPONSE
  // ================================
  res.setHeader("Content-Type", "text/xml");
  res.status(200).send(sitemap);
}