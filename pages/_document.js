// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Default meta */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="author" content="ToolFinance" />
        <meta name="robots" content="index, follow" />

        {/* Default favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* Optional: default Open Graph */}
        <meta property="og:site_name" content="ToolFinance" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}