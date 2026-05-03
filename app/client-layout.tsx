"use client";

import { Inter as FontSans } from "next/font/google";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { ScrollToTop } from "@/components/shared/scroll-to-top";
import { ScrollProgress } from "@/components/shared/scroll-progress";
import { SmoothScrollProvider } from "@/components/shared/smooth-scroll-provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { LoadingScreen } from "@/components/shared/loading-screen";

const StarsCanvas = dynamic(
  () => import("@/components/star-background").then((mod) => mod.StarsCanvas),
  { ssr: false },
);
const BlackHoleVideo = dynamic(
  () =>
    import("@/components/black-hole-video").then((mod) => mod.BlackHoleVideo),
  { ssr: false },
);
const CustomCursor = dynamic(
  () => import("@/components/custom-cursor").then((mod) => mod.CustomCursor),
  { ssr: false },
);

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontDisplay = localFont({
  src: [
    {
      path: "../public/fonts/Satoshi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-display",
});

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLoadingComplete = () => {
    setLoading(false);
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontDisplay.variable,
          loading ? "overflow-hidden" : ""
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {loading && <LoadingScreen onComplete={handleLoadingComplete} />}
          {mounted && <CustomCursor />}
          {mounted && <StarsCanvas />}
          {mounted && <BlackHoleVideo />}
          <SmoothScrollProvider>
            <div className={cn(
              "relative flex min-h-screen flex-col transition-opacity duration-500",
              loading ? "opacity-0" : "opacity-100"
            )}>
              <Navbar />
              <main className="flex-1 pt-16">{children}</main>
              <Footer />
            </div>
            <ScrollToTop />
            <ScrollProgress />
            <SpeedInsights />
            <Analytics />
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
