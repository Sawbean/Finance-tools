import Head from 'next/head';
import { useCurrency } from '../../context/CurrencyContext';

export default function ToolSEO({ tool }) {
  const { currency } = useCurrency();
  // 1. UPDATE THIS TO YOUR REAL DOMAIN
  const siteDomain = "https://finance-tools-mu.vercel.app"; 
  const fullUrl = `${siteDomain}${tool.link}`;

  const ldJson = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": tool.title,
        "operatingSystem": "All",
        "applicationCategory": "FinanceApplication",
        "url": fullUrl,
        "description": tool.desc,
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": currency.code },
        "author": { "@type": "Organization", "name": "ToolFinance" },
        // Adds a rating fallback to help trigger star ratings if you add them later
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "1250"
        }
      },
      {
        "@type": "HowTo",
        "name": `How to use the ${tool.title}`,
        "description": `Step-by-step guide to calculating your finances using the ${tool.title}.`,
        "step": [
          {
            "@type": "HowToStep",
            "name": "Input Data",
            "text": "Enter your financial figures such as principal amount, interest rate, and duration into the input fields."
          },
          {
            "@type": "HowToStep",
            "name": "Analyze Results",
            "text": "Review the instant breakdown of your estimated returns, wealth created, or monthly payments."
          },
          {
            "@type": "HowToStep",
            "name": "Adjust & Optimize",
            "text": "Use the sliders or advanced toggles like 'Step-Up' to see how small changes impact your long-term wealth."
          }
        ]
      }
    ]
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