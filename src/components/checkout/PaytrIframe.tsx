"use client";

import Script from "next/script";

export function PaytrIframe({ token }: { token: string }) {
  return (
    <>
      <iframe
        src={`https://www.paytr.com/odeme/guvenli/${token}`}
        id="paytriframe"
        frameBorder={0}
        scrolling="no"
        style={{ width: "100%", minHeight: 620 }}
        title="PayTR Güvenli Ödeme"
      />
      <Script
        src="https://www.paytr.com/js/iframeResizer.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          // @ts-expect-error - iframeResizer harici global
          if (typeof window.iFrameResize === "function") {
            // @ts-expect-error - harici global
            window.iFrameResize({}, "#paytriframe");
          }
        }}
      />
    </>
  );
}
