// pages/_app.js
import '../styles/globals.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';
import Head from 'next/head';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Google Analytics ID
  const GA_MEASUREMENT_ID = "G-0GC10LBXEC";

  // Track page views on route change
  useEffect(() => {
    const handleRouteChange = (url) => {
      if (window.gtag) {
        window.gtag('config', GA_MEASUREMENT_ID, {
          page_path: url,
        });
      }
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      {/* Global SEO Meta */}
      <Head>
        <title>ToolFinance – Free Financial Calculators</title>
        <meta
          name="description"
          content="ToolFinance provides free online financial calculators including EMI calculator, loan calculator, and fuel cost calculator to help you plan your finances easily."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph */}
        <meta property="og:title" content="ToolFinance – Free Financial Calculators" />
        <meta property="og:description" content="Use our EMI, loan, and fuel calculators to make smarter money decisions easily." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourwebsite.com" />
        <meta property="og:image" content="https://yourwebsite.com/og-image.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ToolFinance – Free Financial Calculators" />
        <meta name="twitter:description" content="Calculate EMI, loans, and fuel costs with our easy tools." />
        <meta name="twitter:image" content="https://yourwebsite.com/twitter-card.png" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="ga-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `,
        }}
      />

      {/* JSON-LD Structured Data for Homepage */}
      <Script
        id="json-ld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "ToolFinance",
            "url": "https://yourwebsite.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://yourwebsite.com/tools/{search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />

      {/* Layout */}
      <Header />

      <main>
        <Component {...pageProps} />
      </main>

      <Footer />
    </>
  );
}

export default MyApp;