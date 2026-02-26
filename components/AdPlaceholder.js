import { useEffect } from "react";
import Script from "next/script";

export default function AdPlaceholder() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.adsbygoogle) {
      try {
        window.adsbygoogle.push({});
      } catch (e) {
        console.error("Adsense error", e);
      }
    }
  }, []);

  return (
    <div style={{ margin: "30px 0", textAlign: "center" }}>
      {/* Google AdSense Script */}
      <Script
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        crossOrigin="anonymous"
      />

      {/* Ad Placeholder */}
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          minHeight: "90px",
          background: "#f4f4f4",
        }}
        data-ad-client="ca-pub-XXXXXXXXXXXX"
        data-ad-slot="1234567890"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />

      {/* Fallback text (safe & useful before approval) */}
      <small style={{ display: "block", color: "#777", marginTop: "8px" }}>
        Advertisement
      </small>
    </div>
  );
}