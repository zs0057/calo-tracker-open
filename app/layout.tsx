import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import KakaoScript from "@/components/KakaoScript";
import { GoogleAnalytics } from "@next/third-parties/google";

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
      </body>
    </html>
  );
}
