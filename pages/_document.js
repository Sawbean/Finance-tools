// pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>

        {/* Basic Meta */}
        <meta charSet="UTF-8" />
        <meta name="author" content="ToolFinance" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#0a2a66" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* Canonical Base */}
        <link rel="canonical" href="https://finance-tools-mu.vercel.app/" />

        {/* Open Graph Defaults */}
        <meta property="og:site_name" content="ToolFinance" />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://finance-tools-mu.vercel.app/"
        />
        <meta
          property="og:image"
          content="https://finance-tools-mu.vercel.app/og-image.png"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />

      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}