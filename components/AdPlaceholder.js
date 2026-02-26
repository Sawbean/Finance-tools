// components/AdPlaceholder.js
import { useEffect } from "react";

export default function AdPlaceholder() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error", e);
    }
  }, []);

  return (
    <div style={{ margin: "20px 0", textAlign: "center" }}>
      {/* Google AdSense placeholder */}
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", height: "90px", background: "#f0f0f0" }}
        data-ad-client="ca-pub-XXXXXXXXXXXX" // Replace with your real AdSense ID
        data-ad-slot="1234567890" // Replace with your real Ad slot
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}