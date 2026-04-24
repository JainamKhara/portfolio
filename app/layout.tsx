import type { Metadata } from "next";
import { ClientLayout } from "./client-layout";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jainam Khara | Full Stack Developer & ML Enthusiast",
  description: "Full Stack Developer & Machine Learning Enthusiast with expertise in Next.js, React and Android.",
  
  
  // Basic metadata
  applicationName: "Jainam Khara Portfolio",
  authors: [{ name: "Jainam Khara" }],
  keywords: ["Full Stack Developer", "Next.js Developer", "React Developer", "Machine Learning", "Android Developer", "Portfolio", "Web Development", "App Development", "AI/ML Enthusiast"],
  alternates: {
    canonical: "https://jainamkhara.app", 
  },

  openGraph: {
    type: "website",
    title: "Jainam Khara | Portfolio",
    description: "Full Stack Developer and Machine Learning Enthusiast with expertise in Next.js, React, Android.",
    siteName: "Jainam Khara Portfolio",
    url: "https://jainamkhara.app",
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
  
  twitter: {
    card: "summary_large_image",
    title: "Jainam Khara | Portfolio",
    description: "Full Stack Developer & Machine Learning Enthusiast.",
    images: ["/images/og-image.png"],
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png" },
  },
  verification: {
    google: "Cw95JJnIcpRMFr65h4To0QafHKqEPIfQF0AwMRiP7vw",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}
