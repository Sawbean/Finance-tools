import { useEffect, useRef } from "react";
import Link from "next/link";

export default function AdPlaceholder({ 
  toolLink = "/tools/emi", 
  ctaText = "Try our EMI Calculator →" 
}) {
  // 1. The Safety Lock: prevents the code from running twice
  const adInitialized = useRef(false);

  useEffect(() => {
    // If we already pushed an ad for this component, stop immediately
    if (adInitialized.current) return;

    const pushAd = () => {
      try {
        if (typeof window !== "undefined" && window.adsbygoogle) {
          // 2. Only target slots that haven't been 'done' by AdSense yet
          const adSlots = document.querySelectorAll('.adsbygoogle:not([data-adsbygoogle-status="done"])');
          
          if (adSlots.length > 0) {
            window.adsbygoogle.push({});
            // 3. Lock the component so it never pushes again
            adInitialized.current = true; 
          }
        }
      } catch (err) {
        console.log("AdSense is preparing the slot...");
      }
    };

    // 500ms delay to play nice with Turbopack and mobile browsers
    const timer = setTimeout(pushAd, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="ad-container-pro">
      <div className="ad-slot-250">
         <ins className="adsbygoogle"
              style={{ display: "block", width: "100%", height: "auto" , minHeight: "100px" }}
              data-ad-client="ca-pub-XXXXXXXXXXXX"
              data-ad-slot="1234567890"
              data-ad-format="auto"
              data-full-width-responsive="true" />
      </div>

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
          <span style={{ 
            background: '#2563eb', 
            color: 'white', 
            padding: '2px 8px', 
            borderRadius: '4px', 
            fontSize: '10px' 
          }}>TOOL</span>
          {ctaText}
        </Link>
      </div>
    </div>
  );
}