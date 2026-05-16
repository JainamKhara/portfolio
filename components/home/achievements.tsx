"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Code, BookOpen, Cpu } from "lucide-react";

const milestones = [
  { icon: Code,     count: "10+",  label: "Projects Completed",       desc: "Fullstack apps, ML systems, and real-time platforms shipped." },
  { icon: BookOpen, count: "100+", label: "LeetCode Problems",        desc: "Consistent algorithmic practice across arrays, graphs & DP." },
  { icon: Cpu,      count: "3+",   label: "Years of Development",     desc: "From first HTML page to production-ready systems." },
];

export function Achievements() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 lg:px-20">
      <div ref={ref} className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <motion.p
            className="section-label mb-3"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            By the numbers
          </motion.p>
          <div className="overflow-hidden">
            <motion.h2
              className="font-display font-black text-5xl md:text-7xl leading-none"
              initial={{ y: "110%" }}
              animate={inView ? { y: "0%" } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              Milestones
            </motion.h2>
          </div>
        </div>

        <div className="glow-line mb-16" />

        {/* Milestone cards — horizontal on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {milestones.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 + i * 0.12 }}
              className="group relative border border-border p-8 hover:border-primary/50 transition-colors duration-500 overflow-hidden"
            >
              {/* Background number watermark */}
              <span
                aria-hidden
                className="absolute -bottom-4 -right-2 font-display font-black text-[7rem] leading-none text-foreground/[0.03] select-none pointer-events-none"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <m.icon className="h-8 w-8 text-primary mb-6 group-hover:scale-110 transition-transform duration-500" />

              <p className="font-display font-black text-5xl md:text-6xl text-primary tabular-nums mb-2">
                {m.count}
              </p>
              <p className="font-semibold text-foreground mb-3">{m.label}</p>
              <p className="text-sm text-foreground/80 leading-relaxed">{m.desc}</p>

              {/* Animated bottom gold bar */}
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary group-hover:w-full transition-all duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}