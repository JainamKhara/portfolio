import type { Metadata } from "next";
import { ClientLayout } from "./client-layout";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://jainamkhara.app"),
  title: "Jainam Khara | Full Stack Developer & ML Enthusiast",
  description: "Full Stack Developer & Machine Learning Enthusiast with expertise in Next.js, React and Android.",
  
  
  // Basic metadata
  applicationName: "Jainam Khara Portfolio",
  authors: [{ name: "Jainam Khara" }],
  keywords: ["Full Stack Developer", "Next.js Developer", "React Developer", "Machine Learning", "Android Developer", "Portfolio", "Web Development", "App Development", "AI/ML Enthusiast", "Jainam", "Khara", "Jainam Khara"],
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
  return (
    <ClientLayout>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Jainam Khara",
            "url": "https://jainamkhara.app",
            "image": "https://jainamkhara.app/images/og-image.png",
            "sameAs": [
              "https://github.com/JainamKhara",
              "https://www.linkedin.com/in/jainamkhara/"
            ],
            "jobTitle": "Full Stack Developer & Machine Learning Engineer",
            "description": "Jainam Khara is a Full-Stack Web & Mobile Developer and Machine Learning Enthusiast. Explore my portfolio website for drop-of-hope, skribbl-clone, and other projects.",
            "knowsAbout": [
              "Full Stack Development",
              "Next.js",
              "React",
              "TypeScript",
              "Node.js",
              "Python",
              "Machine Learning",
              "Android Development",
              "PostgreSQL",
              "Docker",
              "System Design"
            ]
          })
        }}
      />
    </ClientLayout>
  );
}
