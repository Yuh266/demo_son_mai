import type { Metadata } from "next";
import { Cormorant_Garamond, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sơn Son Mài Sắc | Bước Qua Lớp Sắc",
  description: "Nghệ thuật sơn mài truyền thống Việt Nam",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${cormorant.variable} ${beVietnam.variable} h-full antialiased dark`}
    >
      <head>
        <link rel="preload" as="image" href="/images/loading_bg.jpg" />
        <link rel="preload" as="image" href="/images/hero_bg.png" />
        <link rel="preload" as="image" href="/images/box_bg.png" />
      </head>
      <body className="min-h-full bg-black text-[#EDE6DC] font-sans overflow-hidden select-none">
        {children}
      </body>
    </html>
  );
}
