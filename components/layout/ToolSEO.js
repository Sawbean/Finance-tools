import Head from 'next/head';

export default function ToolSEO({ tool }) {
  // 1. UPDATE THIS TO YOUR REAL DOMAIN
  const siteDomain = "https://finance-tools-mu.vercel.app"; 
  const fullUrl = `${siteDomain}${tool.link}`;

  const ldJson = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.title,
    "operatingSystem": "All",
    "applicationCategory": "FinanceApplication",
    "url": fullUrl,
    "description": tool.desc,
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "NPR" },
    "author": { "@type": "Organization", "name": "ToolFinance" }
  };

  return (
    <Head>
      {/* Standard SEO */}
      <title>{tool.title} | ToolFinance</title>
      <meta name="description" content={tool.desc} />
      <link rel="canonical" href={fullUrl} />

      {/* Social Media (Open Graph) - Makes links look good on FB/WhatsApp */}
      <meta property="og:title" content={`${tool.title} | ToolFinance`} />
      <meta property="og:description" content={tool.desc} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="ToolFinance" />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
      />
    </Head>
  );
}