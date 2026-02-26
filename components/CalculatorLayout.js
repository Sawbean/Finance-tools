// components/CalculatorLayout.js
import Head from 'next/head';
import Link from 'next/link';
import AdPlaceholder from './AdPlaceholder';

export default function CalculatorLayout({ title, description, keywords, canonicalUrl, jsonLD, children }) {
  return (
    <div className="container">
      <Head>
        <title>{title} | ToolFinance</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords.join(', ')} />
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        {jsonLD && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLD) }}
          />
        )}
      </Head>

      <h1>{title}</h1>
      <p style={{ textAlign: 'center', marginBottom: '25px' }}>{description}</p>

      {children}

      {/* Ad placeholder below calculator */}
      <AdPlaceholder />

      {/* Internal linking to main tools */}
      <div style={{ marginTop: '25px', textAlign: 'center' }}>
        <h3>Try other tools:</h3>
        <Link href="/tools/emi">EMI Calculator</Link> |{' '}
        <Link href="/tools/loan">Loan Calculator</Link> |{' '}
        <Link href="/tools/fuel">Fuel Calculator</Link>
      </div>
    </div>
  );
}