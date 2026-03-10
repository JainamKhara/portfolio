import type { Metadata } from "next";
import { ClientLayout } from "./client-layout";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jainam Khara | Full Stack Developer",
  description: "Full Stack Developer & Machine Learning Enthusiast with expertise in Next.js, React and Android.",
  
  
  // Basic metadata
  applicationName: "Jainam Khara Portfolio",
  authors: [{ name: "Jainam Khara" }],
  keywords: ["Full Stack Developer", "Next.js", "React", "Machine Learning", "Android"],
  
  openGraph: {
    type: "website",
    title: "Jainam Khara | Full Stack Developer",
    description: "Full Stack Developer and Machine Learning Enthusiast with expertise in Next.js, React, Android.",
    siteName: "Jainam Khara",
    locale: "en_US",
    images: [
      {
        url: "/images/og-image.png",
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}