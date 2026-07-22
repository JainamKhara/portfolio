"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import Link from "next/link";
import { IDCard } from "@/components/home/id-card";
import { useLoaderDone } from "../PageLoader/useLoaderDone";
import { useState, useEffect } from "react";


export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const nameLineRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const tickerStripRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const done = useLoaderDone();
  const [isSkipped, setIsSkipped] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("jk_loaded") === "true") {
      setIsSkipped(true);
    }
  }, []);

  /* GSAP: Infinite Ticker with Dynamic Hover Friction */
  useGSAP(
    () => {
      if (!tickerRef.current || !tickerStripRef.current || !done) return;
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
    { scope: containerRef, dependencies: [done] },
  );

  /* GSAP: 3D Watermark Parallax & Scroll Layout Parallax */
  useGSAP(
    () => {
      if (!containerRef.current || !watermarkRef.current || !done) return;
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
    { scope: containerRef, dependencies: [done] },
  );



  /* GSAP: Rule expansion */
  useGSAP(
    () => {
      if (!nameLineRef.current || !done) return;
      gsap.fromTo(
        nameLineRef.current,
        { scaleX: 0, transformOrigin: "left" },
        { scaleX: 1, duration: 0.8, ease: "expo.out", delay: isSkipped ? 0.5 : 0.6 },
      );
    },
    { scope: containerRef, dependencies: [done, isSkipped] },
  );

  /* GSAP: Cursor-following spotlight inside hero */
  useGSAP(
    () => {
      const container = containerRef.current;
      const spotlight = spotlightRef.current;
      if (!container || !spotlight || !done) return;

      const onMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        gsap.to(spotlight, {
          background: `radial-gradient(600px circle at ${x}% ${y}%, rgba(217,40,28,0.06) 0%, transparent 70%)`,
          duration: 0.6,
          ease: "power2.out",
        });
      };
      const onMouseLeave = () => {
        gsap.to(spotlight, { opacity: 0, duration: 0.8, ease: "power2.out" });
      };
      const onMouseEnter = () => {
        gsap.to(spotlight, { opacity: 1, duration: 0.4, ease: "power2.out" });
      };

      container.addEventListener("mousemove", onMouseMove);
      container.addEventListener("mouseleave", onMouseLeave);
      container.addEventListener("mouseenter", onMouseEnter);

      return () => {
        container.removeEventListener("mousemove", onMouseMove);
        container.removeEventListener("mouseleave", onMouseLeave);
        container.removeEventListener("mouseenter", onMouseEnter);
      };
    },
    { scope: containerRef, dependencies: [done] },
  );


  return (
    <section
      ref={containerRef}
      className="relative w-full bg-transparent overflow-hidden pt-12 lg:pt-16"
    >
      <div className="container mx-auto px-8 md:px-14 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-center lg:min-h-[calc(100vh-64px)] pt-8 md:pt-12 pb-16 md:pb-20 lg:pb-24">
        {/* Left: Content panel */}
        <div className="lg:col-span-7 xl:col-span-8 order-1 flex flex-col justify-center">
          {/* Availability badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={done ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
              </span>
              <span className="font-mono text-[9px] sm:text-[9.5px] uppercase tracking-[0.25em] text-muted-foreground/70">
                Available for work
              </span>
            </div>
            <span className="h-3 w-px bg-border" />
              <span className="font-mono text-[9px] sm:text-[9.5px] uppercase tracking-[0.25em] text-muted-foreground/70">
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
              animate={done ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
            >
              <span
                className="font-display font-black leading-none text-foreground/[0.018] block"
                style={{ fontSize: "clamp(8rem,18vw,16rem)" }}
              >
                JK
              </span>
            </motion.div>

            {/* SEO Heading: Single semantic H1 for search indexation of the owner's name */}
            <h1 className="sr-only">Jainam Khara | Full Stack Developer & Machine Learning Engineer Portfolio</h1>

            {/* "Jainam" */}
            <div
              className="overflow-hidden"
              style={{ padding: "0.5em 0.2em", margin: "0 -0.2em" }}
            >
              <motion.div
                className="font-display font-black leading-[1.2] tracking-tight block"
                style={{ fontSize: "clamp(4.5rem,12vw,10rem)" }}
                initial={{ y: "108%" }}
                animate={done ? { y: "0%" } : { y: "108%" }}
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                  delay: isSkipped ? 0.05 : 0.15,
                }}
              >
                Jainam
              </motion.div>
            </div>

            {/* "Khara." — outline stroke */}
            <div
              className="overflow-hidden"
              style={{ padding: "0.5em 0.2em", margin: "-0.45em -0.2em" }}
            >
              <motion.div
                className="font-display font-black italic leading-[1.2] tracking-tight block"
                style={{
                  fontSize: "clamp(4.5rem,12vw,10rem)",
                  color: "transparent",
                  WebkitTextStroke: "1.5px #D9281C",
                }}
                initial={{ y: "108%" }}
                animate={done ? { y: "0%" } : { y: "108%" }}
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                  delay: isSkipped ? 0.08 : 0.27,
                }}
              >
                Khara
              </motion.div>
            </div>

            {/* Role Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={done ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.6, delay: isSkipped ? 0.12 : 0.38 }}
              className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-foreground/80 font-medium mt-5 mb-1.5"
            >
              Full-Stack Developer · ML Practitioner
            </motion.p>

            {/* Rule */}
            <div
              ref={nameLineRef}
              className="mt-4 h-px bg-primary"
              style={{ transform: "scaleX(0)", transformOrigin: "left" }}
            />
          </div>

          {/* Bio */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={done ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{
              duration: 0.45,
              ease: "easeOut",
              delay: isSkipped ? 0.15 : 0.4,
            }}
            className="text-foreground/80 text-sm leading-relaxed max-w-[38ch] mb-8"
          >
            Computer Science & Engineering student at SAL Institute of Technology and Engineering Research.<br></br>
            I engineer scalable fullstack products and intelligent systems —
            with obsessive attention to detail.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={done ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{
              duration: 0.45,
              ease: "easeOut",
              delay: isSkipped ? 0.2 : 0.48,
            }}
            className="flex flex-wrap gap-3"
          >
            <div className="inline-block">
              <Link
                href="/projects"
                data-cursor="hover"
                className="inline-flex items-center gap-2.5 bg-primary text-white font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 hover:bg-[#c22016] hover:text-white transition-colors duration-300 group"
              >
                View Work
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </Link>
            </div>
            <div className="inline-block">
              <a
                href="/Jainam_Khara_CV.pdf"
                download
                data-cursor="hover"
                className="inline-flex items-center gap-2 border border-border font-mono text-[10px] uppercase tracking-widest px-6 py-3.5 hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors duration-300"
              >
                <b>CV ↗</b>
              </a>
            </div>
          </motion.div>

        </div>


        {/* Right: hanging ID card — hook attaches at the navbar bottom edge */}
        <div className="lg:col-span-5 xl:col-span-4 order-2 flex justify-center lg:justify-end self-start mt-40 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={done ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
              delay: isSkipped ? 0.1 : 0.3,
            }}
            className="relative z-20 w-full max-w-[31rem] h-[39rem] sm:h-[42rem] md:h-[45rem] lg:h-[49rem] lg:-mt-[5rem] xl:-mt-[3rem] overflow-visible"
          >
            <IDCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export { Hero as HeroSection };
