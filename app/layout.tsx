import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stride Collective",
  description: "Discover performance footwear and apparel for every movement.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-light-100">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-[family:var(--font-jost)] antialiased text-dark-900`}
      >
        {children}
      </body>
    </html>
  );
}
