import type { Metadata } from "next";
import { ClientLayout } from "./client-layout";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jainam Khara | Full Stack Developer",
  description: "Full Stack Developer & Machine Learning Enthusiast with expertise in Next.js, React, and blockchain technologies.",
  metadataBase: new URL("https://achyutkatiyar.com"),
  
  // Basic metadata
  applicationName: "Jainam Khara Portfolio",
  authors: [{ name: "Jainam Khara" }],
  keywords: ["Full Stack Developer", "Web3", "Blockchain", "Next.js", "React", "Machine Learning"],
  
  openGraph: {
    type: "website",
    url: "https://achyutkatiyar.com",
    title: "Jainam Khara | Full Stack Developer",
    description: "Full Stack Developer & Blockchain and Machine Learning Enthusiast with expertise in Next.js, React, and blockchain technologies.",
    siteName: "Jainam Khara",
    locale: "en_US",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Jainam Khara - Portfolio",
      },
    ],
  },
  
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png" },
  },
  
  alternates: {
    canonical: "https://achyutkatiyar.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}