import '../styles/globals.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';
import Head from 'next/head';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

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
    <>
      {/* Global Site Head */}
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>

        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>

        <meta property="og:image" content="/og-image.png" />
        <meta name="google-site-verification" content="A-VDqo9ZfV4Gl-6RK3gYm8p-nySB2lvq584nwERC43E"/>
      </Head>
      {/* Google AdSense Script */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXX"
          crossorigin="anonymous"
          strategy="afterInteractive"
        />
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

      {/* JSON-LD Structured Data */}
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

      <Header />

      <main>
        <Component {...pageProps} />
      </main>

      <Footer />
    </>
  );
}

export default MyApp;