"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import Image from "next/image";
import { scrambleText } from "@/lib/animations";

const SKILLS = [
  { cat: "Frontend",  items: ["React", "Next.js", "TypeScript", "TailwindCSS", "Framer Motion", "GSAP"] },
  { cat: "Backend",   items: ["Node.js", "Express", "Python", "Django", "REST APIs", "GraphQL"] },
  { cat: "Database",  items: ["MongoDB", "Firebase", "MySQL", "Supabase", "Redis"] },
  { cat: "ML / AI",   items: ["TensorFlow", "scikit-learn", "Pandas", "NumPy", "OpenCV"] },
  { cat: "Mobile",    items: ["Android (Java)", "React Native", "Expo"] },
  { cat: "Tools",     items: ["Git", "Docker", "Vercel", "Figma", "Linux"] },
];

const STATS = [
  { value: "10+",  label: "Projects shipped" },
  { value: "100+", label: "LeetCode problems" },
  { value: "4+",   label: "Years of building" },
  { value: "6+",   label: "Skill domains" },
];

export default function AboutPage() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const titleRef    = useRef<HTMLHeadingElement>(null);
  const photoRef    = useRef<HTMLDivElement>(null);

  /* Scramble page title */
  useEffect(() => {
    const t = setTimeout(() => {
      if (titleRef.current) scrambleText(titleRef.current, "ABOUT", 1100);
    }, 200);
    return () => clearTimeout(t);
  }, []);

  /* GSAP: photo reveal on scroll */
  useGSAP(() => {
    if (!photoRef.current) return;
    gsap.fromTo(photoRef.current,
      { clipPath: "inset(100% 0 0 0)", opacity: 0 },
      {
        clipPath: "inset(0% 0 0 0)", opacity: 1,
        duration: 1.2, ease: "power4.out",
        scrollTrigger: { trigger: photoRef.current, start: "top 78%" }
      }
    );
  }, { scope: sectionRef });

  /* GSAP: paragraph lines reveal */
  useGSAP(() => {
    const lines = sectionRef.current?.querySelectorAll(".reveal-line");
    if (!lines) return;
    lines.forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0,
          duration: 0.75, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" }
        }
      );
    });
  }, { scope: sectionRef });

  return (
    <div ref={sectionRef} className="min-h-screen bg-background">

      {/* ── Page hero strip ── */}
      <div className="relative border-b border-border overflow-hidden">
        {/* Giant watermark */}
        <div aria-hidden className="absolute inset-0 flex items-center justify-end pr-12 pointer-events-none">
          <span className="font-display font-black text-[20vw] text-foreground/[0.015] leading-none select-none">
            ABOUT
          </span>
        </div>

        <div className="px-6 md:px-12 lg:px-16 pt-28 pb-12 relative z-10">
          <motion.p className="section-label mb-4"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            01 / About Me
          </motion.p>

          <h1 ref={titleRef}
            className="font-display font-black text-[clamp(4rem,12vw,10rem)] leading-none tracking-tight mb-8">
            ABOUT
          </h1>

          <div className="glow-line" />
        </div>
      </div>

      {/* ── Two-column editorial ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] border-b border-border">

        {/* Left — bio text */}
        <div className="px-6 md:px-12 lg:px-16 py-16 border-r border-border">
          <p className="reveal-line text-2xl md:text-4xl font-display font-black leading-[1.1] tracking-tight mb-8 max-w-[45ch]">
            I&apos;m a Computer Science student at{" "}
            <span className="text-primary italic">SAL Institute of Technology and Engineering Research</span>,
            Ahmedabad — building things that matter.
          </p>

          <p className="reveal-line text-lg text-muted-foreground leading-relaxed mb-6 font-medium max-w-[65ch]">
            My engineering philosophy is simple: every line of code should serve a purpose,
            and every interface should feel inevitable. I work at the intersection of
            design and engineering — obsessive about performance, accessibility, and
            the kind of detail that users feel but can&apos;t quite name.
          </p>

          <p className="reveal-line text-lg text-muted-foreground leading-relaxed mb-6 font-medium max-w-[65ch]">
            When I&apos;m not building products, I&apos;m solving algorithmic challenges on LeetCode,
            training ML models, or contributing to open-source. I believe the best
            engineers are relentlessly curious — I try to build something new every week.
          </p>

          <p className="reveal-line text-lg text-muted-foreground leading-relaxed font-medium max-w-[65ch]">
            Currently seeking a Full-Stack or ML role where craft and ambition collide.
          </p>

          {/* Amber accent block */}
          <div className="reveal-line mt-12 border-l border-primary/30 pl-6 py-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary/80">
              Core principle
            </p>
            <p className="text-xl mt-2 text-foreground font-display font-bold italic tracking-tight">
              &quot;Build with intent. Ship with conviction.&quot;
            </p>
          </div>
        </div>

        {/* Right — photo */}
        <div className="hidden lg:block relative min-h-[500px]">
          <div ref={photoRef} className="absolute inset-0" style={{ clipPath: "inset(100% 0 0 0)" }}>
            <Image
              src="/images/profile.jpg"
              alt="Jainam Khara"
              fill
              className="object-cover object-top grayscale hover:grayscale-0 transition-all duration-1000"
              sizes="400px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          </div>

          {/* Name overlay at bottom */}
          <div className="absolute bottom-0 inset-x-0 p-8 z-10">
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/40">
              Jainam Khara · CS Student · Developer
            </p>
          </div>
        </div>
      </div>

      {/* ── Stats band ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-border">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
            className="border-r border-border last:border-r-0 px-8 py-10 group hover:bg-card transition-colors duration-300"
          >
            <span className="font-display font-black text-4xl text-primary block mb-1">{s.value}</span>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Skills — editorial table ── */}
      <div className="px-6 md:px-12 lg:px-16 py-16 border-b border-border">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-display font-black text-[clamp(1.8rem,4vw,3.5rem)] mb-10"
        >
          Skills &amp; Stack
        </motion.h2>

        <div className="space-y-0">
          {SKILLS.map((group, gi) => (
            <motion.div
              key={group.cat}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: gi * 0.07 }}
              className="flex flex-col md:flex-row md:items-start gap-4 py-5 border-b border-border last:border-b-0 group hover:bg-card/50 transition-colors duration-300 px-4 -mx-4"
            >
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/60 w-28 shrink-0 pt-0.5">
                {group.cat}
              </span>
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <span
                    key={skill}
                    className="font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 border border-border text-foreground hover:border-primary hover:text-primary transition-all duration-300"
                    data-cursor="hover"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}