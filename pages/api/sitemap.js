// pages/api/sitemap.js
import fs from "fs";
import path from "path";
import { allFinanceArticles } from "../../data/articles/index";
import { allToolGuides } from "../../data/tool-guides/index";

const SITE_URL = "https://finance-tools-mu.vercel.app";

export default function handler(req, res) {
  // Ensuring the date is always YYYY-MM-DD
  const currentDate = new Date().toISOString().split('T')[0];

  // 1. STATIC PAGES
  const staticPages = ["", "/blog", "/about", "/contact", "/privacy-policy", "/terms", "/disclaimer", "/blog/news"];

  // 2. TOOLS PAGES (Dynamic from Directory)
  const toolsDir = path.join(process.cwd(), "pages/tools");
  let toolPages = [];
  try {
    toolPages = fs
      .readdirSync(toolsDir)
      .filter((file) => file.endsWith(".js") && !file.startsWith("_") && !file.startsWith("["))
      .map((file) => `/tools/${file.replace(".js", "")}`);
  } catch (err) {
    console.warn("Warning: Tools directory not found", err);
  }

  // 3. BLOG CATEGORY PAGES (The 6 Master Categories)
  const categories = ['foundation', 'wealth', 'markets', 'protection', 'digital', 'systems'];
  const categoryPages = categories.map(id => `/blog/category/${id}`);

  // 4. BLOG PAGES (Dynamic from Data Files)
  const allBlogs = {
    ...allFinanceArticles,
    ...allToolGuides,
  };

  const blogPages = Object.keys(allBlogs).map((slug) => {
    const blog = allBlogs[slug];
    
    // --- IMPROVED DATE LOGIC ---
    let finalDate = currentDate;
    if (blog?.publishDate) {
      const d = new Date(blog.publishDate);
      finalDate = !isNaN(d.getTime()) ? d.toISOString().split('T')[0] : currentDate;
    }

    return {
      url: `/blog/${slug}`,
      lastmod: finalDate, 
    };
  });

  // 5. COMBINE ALL PAGES
  const allPages = [
    ...staticPages.map((url) => ({
      url,
      lastmod: currentDate,
    })),
    ...categoryPages.map((url) => ({
      url,
      lastmod: currentDate,
    })),
    ...toolPages.map((url) => ({
      url,
      lastmod: currentDate,
    })),
    ...blogPages,
  ];

  // 6. GENERATE SITEMAP XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map((page) => {
    // SEO Logic: Prioritize tools, home page, and category hubs
    let priority = "0.7"; 
    let freq = "weekly"; 

    if (page.url === "") {
      priority = "1.0";
      freq = "daily";
    } else if (page.url.startsWith("/tools")) {
      priority = "0.9";
      freq = "weekly"; 
    } else if (page.url === "/blog") {
      priority = "0.8";
      freq = "daily";
    } else if (page.url.startsWith("/blog/category")) {
      priority = "0.8";
      freq = "daily"; // Categories update as you add 3-4 articles daily
    }

    return `  <url>
                <loc>${SITE_URL}${page.url}</loc>
                <lastmod>${page.lastmod}</lastmod>
                <changefreq>${freq}</changefreq>
                <priority>${priority}</priority>
                ${page.image ? `<image:image><image:loc>${SITE_URL}${page.image}</image:loc></image:image>` : ''}
              </url>`;
  })
  .join("\n")}
</urlset>`;

  // 7. SEND RESPONSE
  res.setHeader("Content-Type", "text/xml");
  res.status(200).send(sitemap);
}