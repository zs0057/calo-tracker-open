import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import KakaoScript from "@/components/KakaoScript";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "칼로리 측정기",
  description: "칼로리를 측정해보세요!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta property="og:title" content="칼로리 측정기"></meta>
        <meta property="og:type" content="website"></meta>
        <meta property="og:description" content="칼로리를 측정해보세요"></meta>
        {/* <script
          src="https://cdn.amplitude.com/libs/analytics-browser-2.10.0-min.js.gz"
          async
        ></script>
        <script
          src="https://cdn.amplitude.com/libs/plugin-session-replay-browser-1.6.17-min.js.gz"
          async
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.amplitude.add(window.sessionReplay.plugin({ sampleRate: 1 }))
                .promise.then(function() {
                  window.amplitude.init('963718076ebf081c31c2c37cd75e8583', {
                    autocapture: { elementInteractions: true }
                  });
                });
            `,
          }}
        /> */}
      </head>
      {/* <GoogleAnalytics gaId="G-LZ5H0PZ44Z" /> */}
      <body className={inter.className}>
        {children}
        <KakaoScript />
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1686679868536786');
          fbq('track', 'PageView');
        `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=1686679868536786&ev=PageView&noscript=1`}
          />
        </noscript>
      </body>
    </html>
  );
}
