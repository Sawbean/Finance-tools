// components/ads/AdPlaceholder.js

import { useEffect } from "react";

export default function AdPlaceholder({ className = "" }) {
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
    <div className={`ad-placeholder ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-XXXXXXXXXXXX"
        data-ad-slot="1234567890"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}