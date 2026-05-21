"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import Link from "next/link";
import { IDCard } from "@/components/home/id-card";
import { useLoading } from "@/lib/loading-context";



const tickerItems = [
  "Full-Stack", "·", "Machine Learning", "·", "Next.js", "·", "React", "·", 
  "TypeScript", "·", "Node.js", "·", "Python", "·", "TailwindCSS", "·", 
  "GSAP", "·", "Framer Motion", "·", "Three.js", "·", "PostgreSQL", "·", 
  "Docker", "·", "Cloud Native", "·", "Git", "·", "System Design", "·"
];

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const nameLineRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const btn1Ref = useRef<HTMLDivElement>(null);
  const btn2Ref = useRef<HTMLDivElement>(null);
  const tickerStripRef = useRef<HTMLDivElement>(null);
  const { isLoading } = useLoading();

  /* GSAP: Infinite Ticker with Dynamic Hover Friction */
  useGSAP(
    () => {
      if (!tickerRef.current || !tickerStripRef.current || isLoading) return;
      const ticker = tickerRef.current;
      const strip = tickerStripRef.current;
      const scrollWidth = ticker.scrollWidth / 3;

      const scrollAnim = gsap.to(ticker, {
        x: -scrollWidth,
        duration: 40,
        ease: "none",
        repeat: -1,
      });

      const onMouseEnter = () => {
        gsap.to(scrollAnim, { timeScale: 0.12, duration: 0.9, ease: "power2.out" });
      };

      const onMouseLeave = () => {
        gsap.to(scrollAnim, { timeScale: 1.0, duration: 1.2, ease: "power2.out" });
      };

      strip.addEventListener("mouseenter", onMouseEnter);
      strip.addEventListener("mouseleave", onMouseLeave);

      return () => {
        strip.removeEventListener("mouseenter", onMouseEnter);
        strip.removeEventListener("mouseleave", onMouseLeave);
        scrollAnim.kill();
      };
    },
    { scope: containerRef, dependencies: [isLoading] },
  );

  /* GSAP: 3D Watermark Parallax & Scroll Layout Parallax */
  useGSAP(
    () => {
      if (!containerRef.current || !watermarkRef.current || isLoading) return;
      const container = containerRef.current;
      const watermark = watermarkRef.current;

      const onMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const rect = container.getBoundingClientRect();
        const x = clientX - rect.left - rect.width / 2;
        const y = clientY - rect.top - rect.height / 2;

        gsap.to(watermark, {
          x: x * -0.05,
          y: y * -0.05,
          rotateX: y * 0.015,
          rotateY: x * -0.015,
          duration: 0.8,
          ease: "power2.out",
        });
      };

      container.addEventListener("mousemove", onMouseMove);

      // Scroll Parallax on watermark
      gsap.to(watermark, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });

      return () => {
        container.removeEventListener("mousemove", onMouseMove);
      };
    },
    { scope: containerRef, dependencies: [isLoading] },
  );

  /* GSAP: Magnetic Buttons */
  useGSAP(
    () => {
      if (isLoading) return;

      const setupMagnetic = (ref: React.RefObject<HTMLDivElement | null>) => {
        const el = ref.current;
        if (!el) return;

        const onMouseMove = (e: MouseEvent) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;

          gsap.to(el, {
            x: x * 0.35,
            y: y * 0.35,
            duration: 0.3,
            ease: "power2.out",
          });
        };

        const onMouseLeave = () => {
          gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.3)",
          });
        };

        el.addEventListener("mousemove", onMouseMove);
        el.addEventListener("mouseleave", onMouseLeave);
        return () => {
          el.removeEventListener("mousemove", onMouseMove);
          el.removeEventListener("mouseleave", onMouseLeave);
        };
      };

      const cleanup1 = setupMagnetic(btn1Ref);
      const cleanup2 = setupMagnetic(btn2Ref);

      return () => {
        if (cleanup1) cleanup1();
        if (cleanup2) cleanup2();
      };
    },
    { scope: containerRef, dependencies: [isLoading] }
  );

  /* GSAP: Rule expansion */
  useGSAP(
    () => {
      if (!nameLineRef.current || isLoading) return;
      gsap.fromTo(
        nameLineRef.current,
        { scaleX: 0, transformOrigin: "left" },
        { scaleX: 1, duration: 0.8, ease: "expo.out", delay: 0.5 },
      );
    },
    { scope: containerRef, dependencies: [isLoading] },
  );


  return (
    <section
      ref={containerRef}
      className="relative w-full bg-background overflow-hidden pt-16 lg:pt-24"
    >
      <div className="container mx-auto px-8 md:px-14 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-center lg:min-h-[calc(100vh-80px)] pt-12 md:pt-20 pb-24 md:pb-32 lg:pb-40">
        {/* Left: Content panel */}
        <div className="lg:col-span-7 xl:col-span-8 order-1 flex flex-col justify-center">
          {/* Availability badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={!isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: 0.1 }}
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
              <span className="section-label text-muted-foreground">
                Ahmedabad · IN
              </span>
          </motion.div>

          {/* Giant name — THE centrepiece */}
          <div className="relative mb-6">
            {/* "JK" watermark */}
            <motion.div
              ref={watermarkRef}
              aria-hidden
              className="absolute -left-6 -top-6 select-none pointer-events-none"
              style={{ perspective: 1000 }}
              initial={{ opacity: 0 }}
              animate={!isLoading ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
            >
              <span
                className="font-display font-black leading-none text-foreground/[0.018] block"
                style={{ fontSize: "clamp(8rem,18vw,16rem)" }}
              >
                JK
              </span>
            </motion.div>

            {/* Role label */}
            <motion.p
              initial={{ opacity: 0, x: -16 }}
              animate={!isLoading ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
              transition={{ duration: 0.5, delay: 0.15 }}
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
                animate={!isLoading ? { y: "0%" } : { y: "108%" }}
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.2,
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
                  WebkitTextStroke: "1.5px #D9281C",
                }}
                initial={{ y: "108%" }}
                animate={!isLoading ? { y: "0%" } : { y: "108%" }}
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.28,
                }}
              >
                Khara
              </motion.h1>
            </div>

            {/* Rule */}
            <div
              ref={nameLineRef}
              className="mt-5 h-px bg-primary"
              style={{ transform: "scaleX(0)", transformOrigin: "left" }}
            />
          </div>

          {/* Bio + CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={!isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.45,
            }}
          >
            <p className="text-foreground/80 text-sm leading-relaxed max-w-[38ch] mb-8">
              Computer Science & Engineering student at SAL Institute of Technology and Engineering Research.<br></br>
              I engineer scalable fullstack products and intelligent systems —
              with obsessive attention to detail.
            </p>

            <div className="flex flex-wrap gap-3">
              <div ref={btn1Ref} className="inline-block">
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
              </div>
              <div ref={btn2Ref} className="inline-block">
                <a
                  href="/Jainam_Khara_CV.pdf"
                  download
                  data-cursor="hover"
                  className="inline-flex items-center gap-2 border border-border font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 hover:border-primary hover:text-primary transition-all duration-300"
                >
                  <b>CV ↗</b>
                </a>
              </div>
            </div>
          </motion.div>

        </div>


        {/* Right: hanging ID card */}
        <div className="lg:col-span-5 xl:col-span-4 order-2 flex justify-center lg:justify-end self-start mt-40 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={!isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.45,
            }}
            className="relative z-20 w-full max-w-[31rem] h-[39rem] sm:h-[42rem] md:h-[45rem] lg:h-[49rem] lg:-mt-24 xl:-mt-28 overflow-visible"
          >
            <IDCard />
          </motion.div>
        </div>
      </div>

      {/* ── Tech ticker strip ── */}
      <motion.div
        ref={tickerStripRef}
        initial={{ opacity: 0, y: 15 }}
        animate={!isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
        className="border-t border-border h-9 flex items-center overflow-hidden relative z-10 select-none bg-background cursor-grab active:cursor-grabbing"
      >
        <div ref={tickerRef} className="flex items-center whitespace-nowrap">
          {[...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
            <span
              key={i}
              className={`inline-block px-3 font-mono text-[10px] tracking-widest ${
                item === "·"
                  ? "text-primary/30"
                  : "text-foreground/80 uppercase"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      </motion.div>

    </section>
  );
}

export { Hero as HeroSection };
