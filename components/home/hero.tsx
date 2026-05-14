"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import Link from "next/link";
import { CountUp } from "@/components/shared/count-up";
import { IDCard } from "@/components/home/id-card";

const stats = [
  { label: "Projects Built", value: 10, suffix: "+" },
  { label: "LeetCode Solved", value: 100, suffix: "+" },
  { label: "Years Coding", value: 3, suffix: "+" },
];

const tickerItems = [
  "Full-Stack",
  "·",
  "Machine Learning",
  "·",
  "Next.js",
  "·",
  "React",
  "·",
  "TypeScript",
  "·",
  "Node.js",
  "·",
  "Python",
  "·",
  "TailwindCSS",
  "·",
  "GSAP",
  "·",
  "Framer Motion",
  "·",
  "Full-Stack",
  "·",
  "Machine Learning",
  "·",
  "Next.js",
  "·",
  "React",
  "·",
  "TypeScript",
  "·",
  "Node.js",
  "·",
  "Python",
  "·",
  "TailwindCSS",
  "·",
  "GSAP",
  "·",
  "Framer Motion",
  "·",
];

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const nameLineRef = useRef<HTMLDivElement>(null);

  /* GSAP: Infinite Ticker */
  useGSAP(
    () => {
      if (!tickerRef.current) return;
      const ticker = tickerRef.current;
      const totalWidth = ticker.scrollWidth / 2;

      gsap.to(ticker, {
        x: -totalWidth,
        duration: 35,
        ease: "none",
        repeat: -1,
      });
    },
    { scope: containerRef },
  );

  /* GSAP: Rule expansion */
  useGSAP(
    () => {
      if (!nameLineRef.current) return;
      gsap.fromTo(
        nameLineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.2, ease: "expo.out", delay: 0.8 },
      );
    },
    { scope: containerRef },
  );


  return (
    <section
      ref={containerRef}
      className="relative w-full bg-background overflow-hidden pt-16"
    >
      <div className="container mx-auto px-8 md:px-14 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[calc(100vh-80px)] py-12 md:py-20">
        {/* Left: Content panel */}
        <div className="lg:col-span-7 xl:col-span-8 order-2 lg:order-1 flex flex-col justify-center">
          {/* Availability badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-4 mb-10"
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
              </span>
              <span className="section-label text-muted-foreground">
                Available for work
              </span>
            </div>
            <span className="h-3 w-px bg-border" />
            <span className="section-label text-muted-foreground/50">
              Ahmedabad · IN
            </span>
          </motion.div>

          {/* Giant name — THE centrepiece */}
          <div className="relative mb-6">
            {/* "JK" watermark */}
            <div
              aria-hidden
              className="absolute -left-6 -top-6 select-none pointer-events-none"
            >
              <span
                className="font-display font-black leading-none text-foreground/[0.018]"
                style={{ fontSize: "clamp(8rem,18vw,16rem)" }}
              >
                JK
              </span>
            </div>

            {/* Role label */}
            <motion.p
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="section-label mb-5"
            >
              Full-Stack Developer · ML Practitioner
            </motion.p>

            {/* "Jainam" */}
            <div
              className="overflow-hidden"
              style={{ padding: "0.5em 0.2em", margin: "0 -0.2em" }}
            >
              <motion.h1
                className="font-display font-black leading-[1.2] tracking-tight block"
                style={{ fontSize: "clamp(4.5rem,12vw,10rem)" }}
                initial={{ y: "108%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: 0.85,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.38,
                }}
              >
                Jainam
              </motion.h1>
            </div>

            {/* "Khara." — outline stroke */}
            <div
              className="overflow-hidden"
              style={{ padding: "0.5em 0.2em", margin: "-0.45em -0.2em" }}
            >
              <motion.h1
                className="font-display font-black italic leading-[1.2] tracking-tight block"
                style={{
                  fontSize: "clamp(4.5rem,12vw,10rem)",
                  color: "transparent",
                  WebkitTextStroke: "1.5px #6C47FF",
                }}
                initial={{ y: "108%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: 0.85,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.5,
                }}
              >
                Khara.
              </motion.h1>
            </div>

            {/* Rule */}
            <div ref={nameLineRef} className="mt-5 h-px bg-primary" />
          </div>

          {/* Bio + CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.68,
            }}
          >
            <p className="text-muted-foreground text-sm leading-relaxed max-w-[38ch] mb-8">
              Computer Science & Engineering student at SAL Institute. I engineer scalable fullstack
              products and intelligent systems — with obsessive attention to
              detail.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/projects"
                data-cursor="hover"
                className="inline-flex items-center gap-2.5 bg-primary text-white font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 hover:bg-white hover:text-background transition-all duration-300 group"
              >
                View Work
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </Link>
              <a
                href="/Jainam_Khara_CV.pdf"
                download
                data-cursor="hover"
                className="inline-flex items-center gap-2 border border-border font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 hover:border-primary hover:text-primary transition-all duration-300"
              >
                <b>CV ↗</b>
              </a>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-wrap gap-8 mt-12 pt-6 border-t border-border"
          >
            {stats.map((s, i) => (
              <div key={i}>
                <span className="font-display font-black text-3xl text-primary tabular-nums">
                  <CountUp to={s.value} suffix={s.suffix} />
                </span>
                <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mt-1">
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: hanging ID card */}
        <div className="lg:col-span-5 xl:col-span-4 order-1 lg:order-2 flex justify-center lg:justify-end self-start">
          <div className="relative w-full max-w-[33rem] h-[36rem] sm:h-[41rem] lg:h-[49rem] lg:-mt-24 xl:-mt-28 overflow-visible">
            <IDCard />
          </div>
        </div>
      </div>

      {/* ── Tech ticker strip ── */}
      <div className="border-t border-border h-9 flex items-center overflow-hidden relative z-10 select-none bg-background">
        <div ref={tickerRef} className="flex items-center whitespace-nowrap">
          {tickerItems.map((item, i) => (
            <span
              key={i}
              className={`inline-block px-3 font-mono text-[10px] tracking-widest ${
                item === "·"
                  ? "text-primary/30"
                  : "text-muted-foreground/35 uppercase"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export { Hero as HeroSection };
