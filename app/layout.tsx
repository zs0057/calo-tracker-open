import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import KakaoScript from "@/components/KakaoScript";

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
      <meta property="og:title" content="칼로리 측정기"></meta>
      <meta property="og:type" content="website"></meta>
      <meta property="og:description" content="공유시 보여질 설명"></meta>
      <body className={inter.className}>{children}</body>
      <KakaoScript />
    </html>
  );
}
