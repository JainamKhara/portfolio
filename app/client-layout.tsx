"use client";

import { Playfair_Display, DM_Sans, JetBrains_Mono, Unbounded } from "next/font/google";
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
import { PageLoader } from "@/components/PageLoader";
import { LoadingProvider, useLoading } from "@/lib/loading-context";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const CustomCursor = dynamic(
  () => import("@/components/custom-cursor").then((mod) => mod.CustomCursor),
  { ssr: false },
);

const InteractiveBackground = dynamic(
  () => import("@/components/interactive-background").then((mod) => mod.InteractiveBackground),
  { ssr: false },
);

const InkReveal = dynamic(
  () => import("@/components/ui/ink-reveal").then((mod) => mod.default),
  { ssr: false },
);



/* ── Fonts ── */
const fontDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  style: ["normal", "italic"],
  weight: ["400", "700", "900"],
});

const fontLoader = Unbounded({
  subsets: ["latin"],
  variable: "--font-loader",
  weight: ["900"],
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
          fontLoader.variable,
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
  const [revealStarted, setRevealStarted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRevealStart = () => {
    setRevealStarted(true);
    setIsLoading(false);
  };

  const handleLoadingComplete = () => {
    setRevealStarted(true);
    setIsLoading(false);
    onComplete();
  };

  // Force ScrollTrigger to refresh once the loading screen is dismissed
  // This ensures all scroll triggers are calculated with the final document scroll bounds.
  useEffect(() => {
    if (!loading) {
      const timer1 = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);

      // Secondary check to catch delayed layouts, Three.js or WebGL renders
      const timer2 = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 800);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [loading]);

  return (
    <>
      {loading && (
        <PageLoader 
          onRevealStart={handleRevealStart} 
          onComplete={handleLoadingComplete} 
        />
      )}

      {/* Grain texture */}
      <div className="grain" aria-hidden="true" />

      {/* Interactive Background Grid */}
      {mounted && <InteractiveBackground />}

      {/* Ink Reveal Cursor Trail */}
      {mounted && (
        <InkReveal
          mode="paint"
          inkColor={[217, 40, 28]}
          brushSize={70}
          lifetime={900}
          globalTrack={true}
          className="fixed inset-0 z-0 pointer-events-none opacity-45"
        />
      )}

      {/* Custom cursor (desktop only) */}
      {mounted && <CustomCursor />}



      <SmoothScrollProvider>
        <div
          className={cn(
            "relative flex min-h-screen flex-col transition-opacity duration-400",
            revealStarted ? "opacity-100" : "opacity-0 pointer-events-none",
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

