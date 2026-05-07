import '../styles/globals.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';
import Head from 'next/head';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { CurrencyProvider } from '../context/CurrencyContext';
import { ThemeProvider } from 'next-themes'



function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const GA_MEASUREMENT_ID = "G-0GC10LBXEC";

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
    <ThemeProvider attribute="class">
    <CurrencyProvider>
      <Head>
        <meta name="theme-color" content="#2563eb" />
        {/* 1. Technical Basics - Vital for SEO */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <title>ToolFinance | 24+ Free Finance Calculators & Economic Insights</title>
        <meta name="description" content="Calculate EMI, SIP, Income Tax (2025), Inflation, and more with ToolFinance. Expert financial tools designed for Nepal and India." />

        {/* 2. Icons & Manifest - Your PWA Setup */}
{/* Google Search uses this - Pointing to your new 48x48 file */}
<link rel="icon" href="/favicon.ico" sizes="48x48" />

<link rel="manifest" href="/site.webmanifest" />

{/* These stay the same so your browser tab icon doesn't change */}
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>

{/* Important: Update this one too! Google often uses this for mobile search */}
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>

        {/* 3. Open Graph - How it looks when shared on Social Media */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="ToolFinance | Smart Financial Calculators" />
        <meta property="og:description" content="Free tools for EMI, GST, Inflation, and Investment planning." />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:url" content="https://finance-tools-mu.vercel.app/" />

        {/* 4. Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ToolFinance | Smart Financial Calculators" />
        <meta name="twitter:image" content="/og-image.png" />

        {/* 5. Verification */}
        <meta name="google-site-verification" content="A-VDqo9ZfV4Gl-6RK3gYm8p-nySB2lvq584nwERC43E"/>
      </Head>

      {/* 1. Google AdSense */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXX"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      {/* 2. Google Analytics */}
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

      {/* 3. JSON-LD Structured Data for SEO */}
      <Script
        id="json-ld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "ToolFinance",
            "url": "https://finance-tools-mu.vercel.app/",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://finance-tools-mu.vercel.app/tools/{search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />

      {/* 4. Site Layout */}
      <Header />
      
      <main>
        {/* The Component renders the specific page content once */}
        <Component {...pageProps} />
      </main>

      <Footer />
    </CurrencyProvider>
    </ThemeProvider>
  );
}

export default MyApp;