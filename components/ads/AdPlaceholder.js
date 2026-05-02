// components/ads/AdPlaceholder.js

import { useEffect } from "react";
import Link from "next/link";
import { allFinanceArticles } from "../../data/articles/index";
import { allToolGuides } from "../../data/tool-guides/index";

export default function AdPlaceholder({
  className = "",
  toolLink = "/tools/emi",          // Default link if AdSense not approved
  ctaText = "[ Try our EMI Calculator → ]" // Default text CTA
}) {
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.log("AdSense error:", err);
    }
  }, []);

  return (
    <div className={`ad-placeholder cta-block ${className}`} style={{ overflow: 'hidden' }}>
      
      {/* ====== AdSense (uncomment when approved) ====== */}
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight: '100px' }}
        data-ad-client="ca-pub-XXXXXXXXXXXX"
        data-ad-slot="1234567890"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />

      {/* ====== Fallback CTA if AdSense not live ====== */}
      <Link href={toolLink}>{ctaText}</Link>
    </div>
  );
}