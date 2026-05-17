"use client";

import { Playfair_Display, DM_Sans, JetBrains_Mono } from "next/font/google";
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
import React, { useEffect, useState } from "react";
import { LoadingScreen } from "@/components/shared/loading-screen";
import { LoadingProvider, useLoading } from "@/lib/loading-context";

const CustomCursor = dynamic(
  () => import("@/components/custom-cursor").then((mod) => mod.CustomCursor),
  { ssr: false },
);

const CADCrosshair = dynamic(
  () => import("@/components/cad-crosshair").then((mod) => mod.CADCrosshair),
  { ssr: false },
);

/* ── Fonts ── */
const fontDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  style: ["normal", "italic"],
  weight: ["400", "700", "900"],
});

const fontSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
});

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontDisplay.variable,
          fontMono.variable,
          loading && "overflow-hidden",
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <LoadingProvider>
            <LayoutContent loading={loading} onComplete={() => setLoading(false)}>
              {children}
            </LayoutContent>
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

function LayoutContent({ 
  children, 
  loading, 
  onComplete 
}: { 
  children: React.ReactNode; 
  loading: boolean; 
  onComplete: () => void;
}) {
  const { setIsLoading } = useLoading();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    onComplete();
  };

  return (
    <>
      {loading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {/* Grain texture */}
      <div className="grain" aria-hidden="true" />

      {/* Custom cursor (desktop only) */}
      {mounted && <CustomCursor />}

      {/* CAD Crosshair guide (desktop only) */}
      {mounted && <CADCrosshair />}

      <SmoothScrollProvider>
        <div
          className={cn(
            "relative flex min-h-screen flex-col transition-opacity duration-700",
            loading ? "opacity-0 pointer-events-none" : "opacity-100",
          )}
        >
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <ScrollToTop />
        <ScrollProgress />
        <SpeedInsights />
        <Analytics />
      </SmoothScrollProvider>
    </>
  );
}

