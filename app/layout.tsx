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
  title: "NFT Explorer | View Your Ethereum NFTs",
  description:
    "Explore and showcase your Ethereum NFTs. View your NFT images, metadata, and collection details directly from your wallet address.",
  keywords: [
    "NFTs",
    "Ethereum",
    "Crypto",
    "Blockchain",
    "NFT Viewer",
    "Digital Art",
    "Web3",
  ],
  openGraph: {
    title: "Tracklet — View  Ethereum NFTs, balances and transactions",
    description:
      "Easily explore NFTs owned by any Ethereum wallet. Built with Next.js, Alchemy, and OpenSea API.",
    url: "https://tracklet-xiql.vercel.app/", // replace with your actual deployed link
    siteName: "Tracklet",
    images: [
      {
        url: "/download.jpeg", // you can add a preview image in /public
        width: 1200,
        height: 630,
        alt: "Tracklet App Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NFT Explorer",
    description:
      "Explore and display Ethereum NFTs easily with the NFT Explorer app.",
    images: ["/download.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
