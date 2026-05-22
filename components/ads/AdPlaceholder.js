import { useEffect } from "react";
import Link from "next/link";

export default function AdPlaceholder({ 
  toolLink = "/tools/emi", 
  ctaText = "Try our EMI Calculator →" 
}) {
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.log("AdSense waiting...");
    }
  }, []);

  return (
    <div className="ad-container-pro">
      {/* Zone A: The Ad */}
      <div className="ad-slot-250">
         <ins className="adsbygoogle"
              style={{ display: "block", width: "100%", height: "auto" , minHeight: "100px" }}
              data-ad-client="ca-pub-XXXXXXXXXXXX"
              data-ad-slot="1234567890"
              data-ad-format="auto"
              data-full-width-responsive="true" />
      </div>

      {/* Zone B: The Action Bar */}
      <div className="ad-action-bar">
        <Link href={toolLink} style={{ 
          fontSize: '13px', 
          color: '#2563eb', 
          fontWeight: '700', 
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ background: '#2563eb', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '10px' }}>TOOL</span>
          {ctaText}
        </Link>
      </div>
    </div>
  );
}